import { Router } from 'express';
import boardController  from '../controllers/boardController'
import auth from '../middleware/auth';

const router = Router();

router.post('/:groupId/:tag', auth, boardController.makeBoard);
router.get('/:groupId/:tag', auth, boardController.getBoard);

export default router;