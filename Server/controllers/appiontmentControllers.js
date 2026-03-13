

import Appiontment from "../models/Appiontments.js";
import jwt from 'jsonwebtoken';




export const CreateAppiontment=async(req,res)=>{
    const{patientName,doctorName,date,doctorId,discription,age}=req.body;
    try{
        const token=req.headers.authorization?.split(' ')[1];
        if(!token){
            return res.status(401).json({message:"Login required"})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const userId=decoded.userId;

        const appiontment=await Appiontment.create({
            patientName,
            doctorName,
            date,
            doctorId,
            discription,
            age,
            userId
        })
        res.status(201).json({message:"Appiontment created successfully",appiontment})
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Internal Server Error"})
    }

}