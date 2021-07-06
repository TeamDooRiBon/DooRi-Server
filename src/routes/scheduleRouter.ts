import { Router } from 'express';
import scheduleController  from '../controllers/scheduleController'
import auth from '../middleware/auth';

const router = Router();

router.post('/:group-id', auth, scheduleController.makeSchedule);
router.get('/daily/:groupId/:date', auth, scheduleController.getDailySchedule);
router.get('/:groupId/:scheduleId', auth, scheduleController.getDailySchedule);

export default router;