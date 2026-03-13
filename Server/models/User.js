


import mongoose from 'mongoose';
const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:[true,'Please provide a name']
    },
    email:{
        type: String,
        required:[true,'please provide an email'],
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:[true,'Please enter a password'],
        minlenght:6,
    },
    phone:{
        type:String,
        required:false,
    },
    image:{
        type:String,
        required:false,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user',
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }

},{timestamps:true})


const User =mongoose.model('User',userSchema);
export default User