import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        index: true 
    },
    senderName: {
        type: String,
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    message: {
        type: String,
        required: true
    },
    time: {
        type: String 
    }
}, { 
    timestamps: true 
});

const Message = mongoose.model('Message', messageSchema);

export default Message;