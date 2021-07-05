import { Router } from "express";
import mainController from "../controllers/mainController";
import auth from '../middleware/auth';

const router = Router();

router.get('/', auth, mainController.travel);

export default router;
