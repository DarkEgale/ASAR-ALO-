import User from '../models/User.js';
import Doctor from '../models/Doctors.js'; 
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const __dirname = path.resolve();

const updateProfile = async (req, res) => {
    try {
        let updateData = { ...req.body };
        // আপনার মিডলওয়্যার থেকে যদি role আসে, তবে সেটা দিয়ে চেক করা সহজ
        const isDoctor = req.user.role === 'doctor' || req.baseUrl.includes('doctors'); 

        if (req.file) {
            // ফাইলের নাম ডক্টর বা ইউজারের ভিত্তিতে আলাদা করা
            const prefix = isDoctor ? 'doctor' : 'profile';
            const fileName = `${prefix}-${req.user.id}-${Date.now()}.webp`;
            
            const uploadDir = path.join(__dirname, 'public', 'uploads');
            const outputPath = path.join(uploadDir, fileName);

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            await sharp(req.file.buffer)
                .resize(500, 500, { fit: 'cover' })
                .webp({ quality: 80 })
                .toFile(outputPath);

            updateData.image = `/uploads/${fileName}`;
        }

        // ডাইনামিকভাবে মডেল সিলেক্ট করা
        const Model = isDoctor ? Doctor : User;
        const updatedProfile = await Model.findByIdAndUpdate(req.user.id, updateData, { new: true });
        
        if (!updatedProfile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        // ফ্রন্টএন্ডের জন্য ডাইনামিক রেসপন্স
        const responseKey = isDoctor ? 'doctor' : 'user';
        res.status(200).json({ 
            success: true, 
            message: "Profile updated successfully!", 
            [responseKey]: updatedProfile 
        });

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Failed to process image", error: error.message });
    }
};

export { updateProfile };