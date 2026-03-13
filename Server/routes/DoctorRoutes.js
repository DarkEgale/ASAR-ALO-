import { Router } from "express";
import { DoctorRegister,DoctorLogin } from "../controllers/authControllers.js";
import { doctorProtect,  } from "../middleware/authmiddleware.js";
import { DoctorDashboard, GetDoctorsData, ModifyappointmentStats, updateDoctorProfile } from "../controllers/DoctorDashboard.js";
import { getDoctorAppiontments } from "../controllers/getdoctorsappiontments.js";
import { AdminMiddleware } from "../middleware/AdminMiddleware.js";
import upload from '../middleware/multerMiddleware.js';
import { createPrescription, getDoctorPrescriptions } from '../controllers/prescriptionController.js';


const router=Router();


router.post('/login', DoctorLogin);
router.get('/my',doctorProtect,DoctorDashboard)
router.put('/update-profile', doctorProtect, upload.single('profileImage'), updateDoctorProfile);
router.post('/create-prescription', doctorProtect, upload.single('prescriptionPdf'), createPrescription);
router.get('/my/prescriptions', doctorProtect, getDoctorPrescriptions);
router.get('/my/appiontments',doctorProtect,getDoctorAppiontments)
router.get('/all' ,GetDoctorsData)
router.patch('/modify/status/:id', doctorProtect, ModifyappointmentStats)




export default router;