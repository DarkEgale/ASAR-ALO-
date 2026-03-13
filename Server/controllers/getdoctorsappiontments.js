
import Appiontment from "../models/Appiontments.js";
import Doctor from "../models/Doctors.js";



export const getDoctorAppiontments=async(req,res)=>{
    try{
        const doctorId=req.doctor._id
        //const Id="69ac86be167a8852283f5553";
       // console.log(Id)
       //const doctorId="69ae9e295106b7a22fc00a8e"
       console.log(doctorId)
        const DoctorAppiontments=await Appiontment.find({doctorId:doctorId})
        .populate('doctorId', 'name specialization image') // এখানে 'image' আর 'specialization' নিয়ে আসলাম
        .sort({ date: -1 });
        console.log(DoctorAppiontments)
        res.status(200).json({message:"Appiontments Found",DoctorAppiontments})
    }catch(error){
        console.error(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}