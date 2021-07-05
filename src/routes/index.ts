//router index file
import { Router } from 'express';
import mainRouter from './mainRouter';

const router = Router();

router.use('/travel', mainRouter);

export default router;