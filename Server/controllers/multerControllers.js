import User from '../models/User.js';

const updateProfile = async (req, res) => {
    try {
        let updateData = { ...req.body };

        if (req.file) {
            // ডাটাবেজে ইমেজের পাথ সেভ করা (যেমন: /uploads/image-123.jpg)
            updateData.image = `/uploads/${req.file.filename}`;
        }

        // আপনার ডাটাবেজ আপডেট লজিক...
        const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });

        res.status(200).json({ success: true, message: "Profile updated!", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { updateProfile };