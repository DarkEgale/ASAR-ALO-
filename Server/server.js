import app from './App.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import Message from './models/Message.js'; // আপনার তৈরি করা Message মডেলটি ইমপোর্ট করুন

dotenv.config();

// Connect to Database
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [
            "https://www.mdshimulhossen.top", 
            "http://localhost:5173",
            "http://localhost:3000",
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    // মেসেজ সেভ এবং সেন্ড করার লজিক
    socket.on('send_message', async (data) => {
        try {
            const { roomId, sender, message, time } = data;

            // ১. ডাটাবেসে মেসেজটি সেভ করা
            const newMessage = new Message({
                roomId: roomId,
                senderName: sender,
                message: message,
                time: time
            });
            await newMessage.save();

            // ২. রুমে থাকা সবাইকে (পেশেন্ট এবং ডাক্তার) মেসেজটি পাঠানো
            io.to(roomId).emit('receive_message', data);
            
        } catch (error) {
            console.error("Message saving error:", error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User has disconnected');
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});