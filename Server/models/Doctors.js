

import mongoose from "mongoose";

const doctorSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide a Doctor Name"]
    },
    email:{
        type:String,
        required:[true,"Please provide an email"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Please enter a password"]
    },
    specialization:{
        type:String,
        required:[true,"Please provide Specialization"]
    },
    phone:{
        type:String,
        required:[true,"Please provide a Phone Number"]
    },
    availableTime:{
        type:String,
        required:[true,"please provide available time"]
    },
    image:{
        type:String,
        required:false,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true})

const Doctor=mongoose.model("Doctor",doctorSchema);
export default Doctor;