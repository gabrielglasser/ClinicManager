import express from 'express';
import { loginController } from '../controllers/authController';

const router = express.Router();

router.post('/login', loginController);

export default router;