import { Router } from "express";
import imageController from "../controllers/imageController";
import auth from '../middleware/auth';

const router = Router();

router.get('/', imageController.getImages);
router.get('/:groupId', auth, imageController.getTravelImage);

export default router;