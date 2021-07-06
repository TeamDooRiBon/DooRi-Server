//router index file
import { Router } from 'express';
import travelRouter from './travelRouter';
import mainRouter from './mainRouter';

const router = Router();

router.use('/travel', travelRouter);
router.use('/travel', mainRouter);

export default router;