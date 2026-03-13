import { register,login } from "../controllers/authControllers.js";
import { Router } from "express";
import { protect } from "../middleware/authmiddleware.js";
import { getUserProfile } from "../controllers/userDashboard.js";
import { getUserAppiontmentsData } from "../controllers/getuserappiontmentscontrollers.js";
import { CreateAppiontment } from "../controllers/appiontmentControllers.js";
import { getUserPrescriptions, downloadPrescription } from '../controllers/prescriptionController.js';

const router=Router();

router.post('/register',register);
router.post('/login',login);
router.get('/my',protect,getUserProfile);
router.get('/my/appiontments',protect,getUserAppiontmentsData)
router.get('/my/prescriptions', protect, getUserPrescriptions);
router.get('/prescription/download/:id', protect, downloadPrescription);
router.post('/create/appiontments',CreateAppiontment)

export default router;