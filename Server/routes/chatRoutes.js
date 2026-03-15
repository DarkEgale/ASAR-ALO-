import {Router} from 'express';
import  {getChatHistory}  from '../controllers/chatcontrollers.js';

const router = Router();

//ok
router.get('/history/:roomId', getChatHistory);

export default router;