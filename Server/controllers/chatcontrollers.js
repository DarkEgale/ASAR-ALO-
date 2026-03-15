
import Message from "../models/Message";

export const getChatHistory = async (req, res) => {
    try {
        const { roomId } = req.params;
        const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history", error });
    }
};