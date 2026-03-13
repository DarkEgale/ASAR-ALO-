
import { AdminMiddleware } from "../middleware/AdminMiddleware.js";
import { DeleteUser,UpdateUser,DeleteAppiontments, UpdateAppiontments, Getalluser, GetallAppiontments, GetallDoctors } from "../controllers/AdminAuthControllers.js";
import { Router } from "express";
import { DoctorRegister } from "../controllers/authControllers.js";

const router=Router()


router.delete('/user/delete/:id',AdminMiddleware,DeleteUser)
router.patch('/user/update/:id',AdminMiddleware,UpdateUser)
router.delete('/appiontments/delete/:id',AdminMiddleware,DeleteAppiontments)
router.patch('/appiontments/update/:id',AdminMiddleware,UpdateAppiontments)
router.get('/appiontment/all',AdminMiddleware,GetallAppiontments)
router.get('/user/all',AdminMiddleware,Getalluser)
router.get('/doctor/all',AdminMiddleware, GetallDoctors)
router.post('/doctor/register',AdminMiddleware,DoctorRegister)



export default router