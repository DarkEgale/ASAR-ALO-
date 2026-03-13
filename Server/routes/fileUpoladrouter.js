import express from 'express';
const router = express.Router();
import upload from '../middleware/multerMiddleware.js';
import { updateProfile } from '../controllers/multerControllers.js';
import { protect } from '../middleware/authmiddleware.js';

router.put('/update-profile', protect, upload.single('profileImage'), updateProfile);

export default router;