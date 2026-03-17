import User from '../models/User.js';
import Doctor from '../models/Doctors.js'; // নিশ্চিত করো তোমার ফাইলের নাম Doctors.js (নাকি Doctor.js)
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const __dirname = path.resolve();

const updateProfile = async (req, res) => {
    try {
        let updateData = { ...req.body };
        
        // ১. চেক করা হচ্ছে রিকোয়েস্টটা ডক্টর রাউট থেকে আসছে কি না
        const isDoctor = req.baseUrl.includes('doctors') || req.originalUrl.includes('doctors');

        if (req.file) {
            const prefix = isDoctor ? 'doctor' : 'profile';
            const fileName = `${prefix}-${req.user.id}-${Date.now()}.webp`;
            
            const uploadDir = path.join(__dirname, 'public', 'uploads');
            const outputPath = path.join(uploadDir, fileName);

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Sharp দিয়ে ইমেজ প্রসেসিং
            await sharp(req.file.buffer)
                .resize(500, 500, { fit: 'cover' })
                .webp({ quality: 80 })
                .toFile(outputPath);

            // ইমেজ ফিল্ড সেট করা (উভয় স্কিমাতেই ফিল্ডের নাম 'image')
            updateData.image = `/uploads/${fileName}`;
        }

        // ২. ডাইনামিকভাবে মডেল সিলেক্ট করা
        const Model = isDoctor ? Doctor : User;
        
        // ৩. আইডি দিয়ে আপডেট করা
        const updatedProfile = await Model.findByIdAndUpdate(req.user.id, updateData, { new: true });
        
        if (!updatedProfile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        // ৪. ফ্রন্টএন্ডের জন্য সঠিক কী (key) তে ডাটা পাঠানো
        const responseKey = isDoctor ? 'doctor' : 'user';
        
        res.status(200).json({ 
            success: true, 
            message: "Profile updated successfully!", 
            [responseKey]: updatedProfile 
        });

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { updateProfile };