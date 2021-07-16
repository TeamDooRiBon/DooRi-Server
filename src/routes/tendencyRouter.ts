import { Router } from 'express';
import tendencyController from '../controllers/tendencyController'
import auth from '../middleware/auth';

const router = Router();

router.get('/question', tendencyController.getQuestion);
router.get('/question/:groupId', auth, tendencyController.getAnswerCount);
router.post('/:groupId', auth, tendencyController.addResult);
router.get('/:groupId', auth, tendencyController.getAllResult);
router.post('/result/main', auth, tendencyController.getTendencyResult);

export default router;