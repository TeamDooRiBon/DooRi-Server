import { Router } from 'express';
import scheduleController  from '../controllers/scheduleController'
import auth from '../middleware/auth';

const router = Router();

router.post('/:groupId', auth, scheduleController.makeSchedule);
router.get('/daily/:groupId/:date', auth, scheduleController.getDailySchedule);
router.get('/:groupId/:scheduleId', auth, scheduleController.getOneSchedule);
router.patch('/:groupId/:scheduleId', auth, scheduleController.editSchedule);
router.delete('/:groupId/:scheduleId', auth, scheduleController.deleteSchedule);

export default router;