import { Router } from 'express';
import  travelController  from '../controllers/travelController';
import auth from '../middleware/auth';

const router = Router();

router.post('/', auth, travelController.makeTravel);
router.get('/', auth, travelController.getTravel);

export default router;