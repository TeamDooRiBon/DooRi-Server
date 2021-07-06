//router index file
import { Router } from 'express';
import travelRouter from './travelRouter';
import mainRouter from './mainRouter';
import imageRouter from './imageRouter';

const router = Router();

router.use('/travel', travelRouter);
router.use('/travel', mainRouter);
router.use('/image', imageRouter);

export default router;