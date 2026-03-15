

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutesroutes from './routes/authRoutes.js';
import DoctorRoutes from './routes/DoctorRoutes.js';
import AdminRoutes from'./routes/AdminRoutes.js';
import fileUploadRouter from './routes/fileUpoladrouter.js';
import chatRoutes from './routes/chatRoutes.js'




dotenv.config();
const app=express();


//middlewares

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


const limiter =rateLimit({
    windowMs:1*60*1000,
    max:500,
    message:{message:'Too many requests from this IP, please try again after a minute'},
    standardHeaders:true,
    legacyHeaders:false,
})


app.use('/api/',limiter);


app.get('/',(req,res)=>{
    res.send('Server asaralo is running')
})
app.use('/api/auth/doctors',DoctorRoutes);
app.use('/api/auth',authRoutesroutes);
app.use('/api/auth', fileUploadRouter);
app.use('/api/admin/auth',AdminRoutes)
app.use('/uploads', express.static('public/uploads'));
app.use('/api/chat', chatRoutes);




app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({message:'Internal Server Error'})
})

export default app;