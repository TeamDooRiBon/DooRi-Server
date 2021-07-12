//router index file
import { Router } from 'express';
import travelRouter from './travelRouter';
import imageRouter from './imageRouter';
import scheduleRouter from './scheduleRouter';
import kakaoRouter from './kakaoRouter';
import userRouter from './userRouter';
import boardRouter from './boardRouter';
import tendencyRouter from './tendencyRouter';

const router = Router();

router.use('/travel', travelRouter);
router.use('/image', imageRouter);
router.use('/schedule', scheduleRouter); 
router.use('/auth', kakaoRouter);
router.use('/user', userRouter);
router.use('/board', boardRouter);
router.use ('/tendency', tendencyRouter);

export default router;