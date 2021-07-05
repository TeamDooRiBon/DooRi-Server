//router index file
import { Router } from 'express';
import travelRouter from './travelRouter';

const router = Router();

router.use('/travel', travelRouter);

export default router;