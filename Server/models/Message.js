import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        index: true 
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    senderName: { 
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    time: {
        type: String 
    }
}, { 
    timestamps: true 
});


messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

const Message = mongoose.model('Message', messageSchema);

export default Message;