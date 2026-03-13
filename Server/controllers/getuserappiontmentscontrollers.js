
import Appiontment from "../models/Appiontments.js";




export const getUserAppiontmentsData=async(req,res)=>{

    try{
        const userId=req.user._id;
        const userappointment= await Appiontment.find({userId:userId})
    if(!userappointment){
        return res.status(404).json({message:"NO Appiontments found"})
    }
        res.status(200).json({userappointment})
    }catch(error){
        console.error(error)
        res.status(500).json('Internal Server Error')
    }

}