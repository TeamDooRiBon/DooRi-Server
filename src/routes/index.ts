//router index file
import { Router } from 'express';
import travelRouter from './travelRouter';
import mainRouter from './mainRouter';
import kakaoRouter from './kakaoRouter';

const router = Router();

router.use('/travel', travelRouter);
router.use('/travel', mainRouter);
router.use('/auth', kakaoRouter);

export default router;