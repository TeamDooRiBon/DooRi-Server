import { Router } from 'express';
import scheduleController  from '../controllers/scheduleController'
import auth from '../middleware/auth';

const router = Router();

router.post('/:group-id', auth, scheduleController.makeSchedule);
router.post('/daily/:groupId/:date', auth, scheduleController.getDailySchedule);

export default router;