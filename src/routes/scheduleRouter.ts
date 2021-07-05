import { Router } from 'express';
import  scheduleController  from '../controllers/scheduleController';
import auth from '../middleware/auth';

const router = Router();

router.post('/', auth, scheduleController.makeSchedule);

export default router;