import User from '../models/User.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const updateProfile = async (req, res) => {
    try {
        let updateData = { ...req.body };

        if (req.file) {
            
            const fileName = `profile-${req.user.id}-${Date.now()}.webp`;
            const uploadDir = 'uploads/';
            const outputPath = path.join(uploadDir, fileName);

            
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }

           
            await sharp(req.file.buffer) 
                .resize(500, 500, { 
                    fit: 'cover',
                    withoutEnlargement: true
                })
                .webp({ quality: 80 }) 
                .toFile(outputPath);

           
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