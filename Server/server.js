import app from './App.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import Message from './models/Message.js'; 

dotenv.config();

// Connect to Database
connectDB();

const server = http.createServer(app);

// এই অংশটুকু আপনার কোডে বাদ পড়েছে, এটি যোগ করুন
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

const onlineUsers = new Map(); 

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('register_user', (userId) => {
        if (userId) {
            onlineUsers.set(userId, socket.id);
            const userList = Array.from(onlineUsers.keys());
            io.emit('online_users_list', userList);
            console.log(`User Registered: ${userId} | Total Online: ${onlineUsers.size}`);
        }
    });

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
    });

    // মেসেজ হ্যান্ডলিং লজিক (এটিও যোগ করা জরুরি)
    socket.on('send_message', async (data) => {
        try {
            const { roomId, sender, message, time, senderId } = data;
            const newMessage = new Message({
                roomId, senderName: sender, senderId, message, time
            });
            await newMessage.save();
            io.to(roomId).emit('receive_message', data);
        } catch (error) {
            console.error("Message error:", error);
        }
    });

    socket.on('disconnect', () => {
        let disconnectedUserId = null;
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                disconnectedUserId = userId;
                onlineUsers.delete(userId);
                break;
            }
        }
        if (disconnectedUserId) {
            io.emit('online_users_list', Array.from(onlineUsers.keys()));
        }
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});