import express from 'express';
import { getChatHistory } from '../controllers/chatcontrollers';

const router = express.Router();


router.get('/history/:roomId', getChatHistory);

export default router;