//router index file
import { Router } from 'express';
import travelRouter from './travelRouter';
import mainRouter from './mainRouter';
import scheduleRouter from './scheduleRouter';
const router = Router();

router.use('/travel', travelRouter);
router.use('/travel', mainRouter);
router.use('/schedule', scheduleRouter);

export default router;