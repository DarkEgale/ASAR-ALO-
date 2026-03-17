import User from '../models/User.js'; // এটি যোগ করা হয়েছে
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const __dirname = path.resolve();

const updateProfile = async (req, res) => {
    try {
        let updateData = { ...req.body };

        if (req.file) {
            const fileName = `profile-${req.user.id}-${Date.now()}.webp`;
            
            // সঠিক পাথ সেট করা
            const uploadDir = path.join(__dirname, 'public', 'uploads');
            const outputPath = path.join(uploadDir, fileName);

            // ফোল্ডার না থাকলে তৈরি করা
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Sharp দিয়ে ইমেজ প্রসেসিং
            await sharp(req.file.buffer)
                .resize(500, 500, { fit: 'cover' })
                .webp({ quality: 80 })
                .toFile(outputPath);

            // ডাটাবেজের জন্য পাথ সেট করা
            updateData.image = `/uploads/${fileName}`;
        }

        const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "Profile updated successfully!", user });

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Failed to process image", error: error.message });
    }
};

// এই এক্সপোর্ট লাইনটি অবশ্যই থাকতে হবে
export { updateProfile };