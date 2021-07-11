import { Router } from 'express';
import  travelController  from '../controllers/travelController';
import auth from '../middleware/auth';

const router = Router();

router.post('/', auth, travelController.makeTravel);
router.get('/', auth, travelController.getTravel);
router.post('/:groupId', auth, travelController.pushMemberToTravel);
router.get('/:groupId', auth, travelController.getTravelInformation);
router.get('/group/:inviteCode', auth, travelController.checkTravel);
router.patch('/:groupId', auth, travelController.editTravel);

export default router;