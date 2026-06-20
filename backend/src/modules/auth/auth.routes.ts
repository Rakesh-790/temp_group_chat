import express from 'express';
import { login, logoutAllDevices, logoutUser, refreshAccessTokenController, register } from './auth.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import sessionMiddleware from '../../middlewares/session.middleware';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/refresh', refreshAccessTokenController);

router.post('/logout', authMiddleware, sessionMiddleware, logoutUser);

router.post('/logoutAll', authMiddleware, sessionMiddleware, logoutAllDevices);

export default router;