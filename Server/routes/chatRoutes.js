import {Router} from 'express';
import { getChatHistory } from '../controllers/chatcontrollers';

const router = Router();


router.get('/history/:roomId', getChatHistory);

export default router;