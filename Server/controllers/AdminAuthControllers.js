
import User from "../models/User.js";
import Doctor from "../models/Doctors.js";
import Appiontment from "../models/Appiontments.js";


export const DeleteUser=async(req,res)=>{
    const{id}=req.params

    try{
        const user= await User.findById(id)

        if(!user){
        return res.status(404).json({message:"User Not found"})
        }
        await User.findByIdAndDelete(id)
        await Appiontment.deleteMany({userId:id})
        res.status(200).json({message:"Data Deleted"})
    }catch(error){
        console.error(error)
        res.status(500).json({message:"Internal Server Error"})
    }

}

export const UpdateUser=async(req,res)=>{
    const{id}=req.params
    const updateData=req.body
    try{
        const userData=await User.findById(id)
        if(!userData){
            return res.status(404).json({message:"User not found"})
        }
        if(updateData.password){
            delete updateData.password
        }
        const user=await User.findByIdAndUpdate(id, updateData,{new:true})
        res.status(200).json({message:"Data Updated",user})
    }catch(error){
        console.error(error)
        res.status(500).json({message:"Internal server Error"})
    }
}

export const DeleteAppiontments=async(req,res)=>{
    const{id}=req.params;

    try{
        const appiontments=await Appiontment.findById(id)
        if(!appiontments){
            return res.status(404).json({message:"Appiontments not found"})
        }
        await Appiontment.findByIdAndDelete(id)
        res.status(200).json({appiontments})
    }catch(error){
        console.error(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const UpdateAppiontments=async(req,res)=>{
    const{id}=req.params
    const updateData=req.body
    try{
            const appiontments=await  Appiontment.findById(id)
            if(!appiontments){
            return res.status(404).json({message:"Appiontments not found"})
            }
            const UpdateAppiontments=await Appiontment.findByIdAndUpdate(id, updateData, {new:true})
            res.status(200).json({message:"Appiontment Updated", UpdateAppiontments})
    }catch(error){
        console.error(error)
        res.status(500).json({message:"Internal Server error"})
    }
}

export const Getalluser=async(req,res)=>{
    console.log("Controllers is here")
    try{
        const allUser=await User.find({}).select("-password")
        res.status(200).json({message:"User found",allUser})
        console.log(allUser)
    }catch(error){
        console.error(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}
export const GetallDoctors=async(req,res)=>{
    console.log("Coltrollers got Doctor Section")
    try{
        const alldoctor=await Doctor.find({}).select("-password")
        console.log(alldoctor)
        res.status(200).json({alldoctor})
    }catch(error){
        res.status(500).json({message:"Internal Server Erorr"})
    }
}
export const GetallAppiontments=async(req, res)=>{
    try{
        console.log("controllers got all appiontments")
        const allappiontments=await Appiontment.find({})
        res.status(200).json({allappiontments})
    }catch(error){
        console.error(error)
        res.status(500).json("Internal Server Error")
    }
}