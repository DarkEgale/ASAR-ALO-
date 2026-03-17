import User from '../models/User.js';
import Doctor from '../models/Doctors.js'; 
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const __dirname = path.resolve();

export const updateProfile = async (req, res) => {
    try {
        // ১. টোকেন থেকে আইডি বের করার সবচেয়ে নিরাপদ উপায়
        // আপনার লগ অনুযায়ী req.user এর ভেতর সরাসরি doctorId আছে
        const userId = req.user.doctorId || req.user.id || req.user._id;

        console.log(">>> [Debug] Starting Update for ID:", userId);

        if (!userId) {
            console.error(">>> [Error] No User ID found in Request!");
            return res.status(401).json({ success: false, message: "Authentication failed. No ID found." });
        }

        let updateData = { ...req.body };
        const isDoctor = req.baseUrl.includes('doctors') || req.originalUrl.includes('doctors');

        // ২. ইমেজ প্রসেসিং (যদি ফাইল থাকে)
        if (req.file) {
            console.log(">>> [Debug] Processing File:", req.file.originalname);
            
            const prefix = isDoctor ? 'doctor' : 'profile';
            // এখানে নিশ্চিত করা হচ্ছে যে userId একটি স্ট্রিং হিসেবে বসছে
            const fileName = `${prefix}-${userId.toString()}-${Date.now()}.webp`; 
            
            const uploadDir = path.join(__dirname, 'public', 'uploads');
            const outputPath = path.join(uploadDir, fileName);

            // ফোল্ডার না থাকলে তৈরি করা
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Sharp দিয়ে ইমেজ ফরম্যাট ও সাইজ ঠিক করা
            await sharp(req.file.buffer)
                .resize(500, 500, { fit: 'cover' })
                .webp({ quality: 80 })
                .toFile(outputPath);

            // ডাটাবেজে সেভ করার জন্য পাথ সেট
            updateData.image = `/uploads/${fileName}`; 
            console.log(">>> [Success] Image Saved:", updateData.image);
        }

        const Model = isDoctor ? Doctor : User;

        // ৩. ডাটাবেজ আপডেট করা
        const updatedProfile = await Model.findByIdAndUpdate(
            userId, 
            { $set: updateData }, 
            { new: true }
        ).select('-password');

        if (!updatedProfile) {
            console.error(">>> [Error] Profile not found in DB for ID:", userId);
            return res.status(404).json({ success: false, message: "Profile not found in database" });
        }

        console.log(">>> [Success] Database Updated. Path:", updatedProfile.image);

        // ৪. রেসপন্স পাঠানো
        res.status(200).json({ 
            success: true, 
            message: "Profile updated successfully!",
            doctor: isDoctor ? updatedProfile : null,
            user: !isDoctor ? updatedProfile : null
        });

    } catch (error) {
        console.error(">>> [Fatal Error]:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};