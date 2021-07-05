//router index file
import { Router } from 'express';
import travelRouter from './travelRouter';
import scheduleRouter from './scheduleRouter';

const router = Router();

router.use('/travel', travelRouter);
router.use('/schedule', scheduleRouter);

export default router;