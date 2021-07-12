import { Router } from 'express';
import boardController  from '../controllers/boardController'
import auth from '../middleware/auth';

const router = Router();

router.post('/:groupId/:tag', auth, boardController.makeBoard);
router.get('/:groupId/:tag', auth, boardController.getBoard);
router.patch('/:groupId/:tag/:boardId', auth, boardController.editBoard);
router.delete('/:groupId/:tag/:boardId', auth, boardController.deleteBoard);

export default router;