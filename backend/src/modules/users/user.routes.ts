import express from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { getProfile, updateUserProfile } from '../auth/auth.controller';

const useRouter = express.Router();

useRouter.get('/profile', authMiddleware, getProfile);

useRouter.patch('/profile', authMiddleware, updateUserProfile);

export default useRouter;