

import User from "../models/User.js";
import Doctor from "../models/Doctors.js";

import bcrypt, { genSalt } from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register=async(req,res)=>{
    try{
        const{name,email,password}=req.body;

        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:'User already exists'});
        }

        const salt=await bcrypt.genSalt(10);
        const hashedpassword=await bcrypt.hash(password,salt);


        const user =await User.create({
            name,
            email,
            password:hashedpassword,
        })

        res.status(201).json({message:'User registered successfully',user})
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Internal Server Error'})
    }
}


export const  login=async(req, res)=>{
    try{
        const{email, password}=req.body;

        const user = await User.findOne({ email:email });
        if(!user){
            const count = await User.countDocuments();
            console.log("Database-e total user ache:", count);
            

            const allEmails = await User.find({}, 'email');
            console.log("DB-te thaka email gulo holo:", allEmails);

            return res.status(400).json({ message: 'not users' });
        }

        const isMacth=await bcrypt.compare(password,user.password);
        if(! isMacth){
            return res.status(400).json({message:"Invalid email or password"})   
        }
        const token=jwt.sign(
            {userId:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:'1d'}
        );

        res.status(200).json({token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        });
    }catch(error){
        console.error( error)
        res.status(500).json({message:'Internal Server Error'})
    }
}


export const DoctorRegister=async(req,res)=>{
    const{email,password,name,phone,specialization,availableTime}=req.body;
    try{
            const doctorExists= await Doctor.findOne({email})
    if(doctorExists){
         return res.status(401).json({message:"Email alrady exists"})
    }
    const salt=await genSalt(10)
    const hashpassword= await bcrypt.hash(password,salt)


    const doctor=await Doctor.create({
        name,
        email,
        password:hashpassword,
        specialization,
        phone,
        availableTime,
    })
    res.status(201).json({message:"Registration Sucessfull"})
    }catch(error){
        console.error(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const DoctorLogin=async (req,res) => {
    try{

        const{email,password}=req.body;
        console.log('login Attmp with',email)
    const doctor=await Doctor.findOne({email:email})
    if(!doctor){
        return res.status(401).json({message:"Wrong email or password"})
    }
    const isMacth= await bcrypt.compare(password,doctor.password)
    
    if(!isMacth){
        return res.status(401).json({message:"Wrong email or password"})
    }

    const token=jwt.sign(
        {doctorId:doctor._id},process.env.JWT_SECRET,{expiresIn:'1d'}
    )
    res.status(200).json({token,
            doctor:{
            id:doctor._id,
            name:doctor.name,
            email:doctor.email,
            specialization:doctor.specialization,
            phone:doctor.phone,
            availableTime:doctor.availableTime,
            createdAt:doctor.createdAt
        }
})
    }catch(error){
        console.error(error)
        res.status(500).json({message:"Internal Server Error"})
    }


}