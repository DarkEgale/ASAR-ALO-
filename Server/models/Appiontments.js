

import mongoose  from "mongoose";


const appiontmentSchema=new mongoose.Schema({
    patientName:{
        type:String,
        reuired:[true,"Please Enter patient name"]
    },
    doctorName:{
        type:String,
        required:[true,"Please Enter doctor name"]
    },

    date:{
        type:Date,
        required:[true,"Please Enter appointment date"]
    },
    age:{
        type:String,
        required:[true,"Please Enter your age"]
    },
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
        required:[true,"Please provide doctor id"]
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"User Id Required"]
    },
    status:{
        type:String,
        enum:['pending','confirm','complete'],
        default:'pending'
    },
    discription:{
        type:String,
        required:[true,"Please provide discription"]
    }
})

const Appiontment=mongoose.model('Appiontment',appiontmentSchema);
export default Appiontment;