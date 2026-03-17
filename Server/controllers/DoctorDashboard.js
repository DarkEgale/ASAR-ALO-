import Appiontment from "../models/Appiontments.js"
import Doctor from "../models/Doctors.js"
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';





export const DoctorDashboard=async(req,res)=>{
    const doctor=req.doctor
    try{
        if(!doctor){
            return res.status(404).json({message:"Doctor not found"})
        }
        res.status(200).json({message:"Doctor Found",doctor})
    }catch(error){
        console.error(error)
        res.status(500).json("Internal Server Error")
    }
}

export const updateDoctorProfile = async (req, res) => {
    try {
        let updateData = { ...req.body };

        if (req.file) {
            // ১. ফাইল নেম তৈরি করা (যেহেতু MemoryStorage এ filename থাকে না)
            const fileName = `doctor-${req.doctor.id}-${Date.now()}.webp`;
            const uploadDir = path.resolve('public/uploads');
            const outputPath = path.join(uploadDir, fileName);

            // ২. ফোল্ডার না থাকলে তৈরি করা
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // ৩. Sharp দিয়ে ইমেজ প্রসেসিং এবং সেভ করা
            await sharp(req.file.buffer)
                .resize(500, 500, { fit: 'cover' }) // রিসাইজ
                .webp({ quality: 80 })              // ফরম্যাট কনভার্ট
                .toFile(outputPath);                // সেভ করা

            // ৪. ডাটাবেজের জন্য পাথ সেট করা
            updateData.image = `/uploads/${fileName}`;
        }

        // ৫. ডাটাবেজ আপডেট
        const doctor = await Doctor.findByIdAndUpdate(
            req.doctor.id, 
            updateData, 
            { new: true }
        ).select("-password");

        res.status(200).json({ success: true, message: "Profile updated!", doctor });
    } catch (error) {
        console.error("Update Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};


// Send all doctor data for home page

export const GetDoctorsData=async(req,res)=>{
    try{
        const Doctors=await Doctor.find({}).select('-email -password')
        res.status(200).json({message:"Doctor Found",Doctors})
    }catch(eror){
        res.status(500).json({message:"Internal Server Error"})
    }
}


//doctor appointment modify

export const ModifyappointmentStats=async(req,res)=>{
    try{
        console.log("Controllers Got")
        const {id}=req.params
        const {status}=req.body
        const modifyData=await Appiontment.findByIdAndUpdate(id,{status},{new:true})
        if(!modifyData){
           return res.status(404).json({message:"Data not found"})
        }
        res.status(200).json({message:"Data Updated",modifyData})
    }catch(error){
        console.error(error)
        res.status(500).json("Internal Server Error")
    }
}