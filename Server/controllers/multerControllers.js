import User from '../models/User.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const updateProfile = async (req, res) => {
    try {
        let updateData = { ...req.body };

        if (req.file) {
            const fileName = `profile-${req.user.id}-${Date.now()}.webp`;
            
            // ১. প্রজেক্টের রুট থেকে public/uploads পাথটি নিশ্চিত করুন
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            const outputPath = path.join(uploadDir, fileName);

            // ২. ফোল্ডার না থাকলে তৈরি করবে (Recursive true দিলে সব লেভেল তৈরি হয়)
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // ৩. Sharp দিয়ে প্রসেস করে সঠিক পাথে সেভ করা
            await sharp(req.file.buffer) 
                .resize(500, 500, { 
                    fit: 'cover',
                    withoutEnlargement: true
                })
                .webp({ quality: 80 }) 
                .toFile(outputPath);

            // ৪. ডাটাবেজে শুধুমাত্র /uploads/filename সেভ হবে
            updateData.image = `/uploads/${fileName}`;
        }

        const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });

        res.status(200).json({ success: true, message: "Profile updated successfully!", user });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export { updateProfile };