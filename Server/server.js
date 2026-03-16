import app from './App.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import compression from 'compression'; // ১. সাইজ কমানোর জন্য
import Message from './models/Message.js'; 

dotenv.config();

// ১. ফাইল কম্প্রেশন এনাবল করুন (এটি সাইজ ৭০% কমিয়ে দেয়)
app.use(compression());

// Connect to Database
connectDB();

const server = http.createServer(app);

// ২. সকেট অপ্টিমাইজেশন
const io = new Server(server, {
    cors: {
        origin: [
            "https://www.mdshimulhossen.top", 
            "http://localhost:5173",
            "http://localhost:3000",
        ],
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling'] // ৩. কানেকশন ফাস্ট করার জন্য
});

const onlineUsers = new Map(); 

io.on('connection', (socket) => {
    socket.on('register_user', (userId) => {
        if (userId) {
            onlineUsers.set(userId, socket.id);
            // ৪. শুধু ইউনিক আইডি পাঠানোর জন্য Set ব্যবহার
            const userList = Array.from(new Set(onlineUsers.keys()));
            io.emit('online_users_list', userList);
        }
    });

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
    });

    socket.on('send_message', async (data) => {
        try {
            const { roomId, sender, message, time, senderId } = data;
            
            // ৫. ব্যাকগ্রাউন্ডে সেভ করুন যেন ইউজার ল্যাগ না পায়
            const newMessage = new Message({
                roomId, senderName: sender, senderId, message, time
            });
            await newMessage.save();
            
            io.to(roomId).emit('receive_message', data);
        } catch (error) {
            console.error("Socket Message error:", error);
        }
    });

    socket.on('disconnect', () => {
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        io.emit('online_users_list', Array.from(onlineUsers.keys()));
    });
});



const PORT = process.env.PORT || 5001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Optimized Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Error: ${err.message}`);
    server.close(() => process.exit(1));
});