import express from 'express';
import { login, logoutAllDevices, logoutUser, refreshAccessTokenController, register } from './auth.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import sessionMiddleware from '../../middlewares/session.middleware';

const authRouter = express.Router();

authRouter.post('/register', register);

authRouter.post('/login', login);

authRouter.post('/refresh', refreshAccessTokenController);

authRouter.post('/logout', authMiddleware, sessionMiddleware, logoutUser);

authRouter.post('/logoutAll', authMiddleware, sessionMiddleware, logoutAllDevices);

export default authRouter;