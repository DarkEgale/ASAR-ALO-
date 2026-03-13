

import jwt, { decode } from 'jsonwebtoken';
import User from '../models/User.js';
import Doctor from '../models/Doctors.js';
import Appiontment from '../models/Appiontments.js';

export const protect=async(req,res,next)=>{
    let token=req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({message:'Unthorize Access'})
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=await User.findById(decoded.userId).select('-password');
        console.log("I got it")
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({message:'Invalid token'});
    }
}


export const doctorProtect=async(req,res,next)=>{
    const token=req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json("Unthorize acess")
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded)
        req.doctor=await Doctor.findById(decoded.doctorId).select('-password');
        next()
    }catch(error){
        console.error(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}