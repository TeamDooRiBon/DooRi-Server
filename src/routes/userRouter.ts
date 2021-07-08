import { Router } from 'express';
import  userController  from '../controllers/userController';
import auth from '../middleware/auth';

const router = Router();

router.get('/myPage', auth, userController.getMyPage);

export default router;