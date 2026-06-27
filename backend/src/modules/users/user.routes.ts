import express from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { getAllUsersController, getProfile, searchUsersController, updateUserProfile, uploadUserAvatar } from './user.controller';
import { uploadAvatar } from '../../middlewares/upload.middleware';

const useRouter = express.Router();

useRouter.get('/profile', authMiddleware, getProfile);

useRouter.patch('/profile', authMiddleware, updateUserProfile);

useRouter.patch('/avatar', authMiddleware, uploadAvatar.single('avatar'), uploadUserAvatar);

useRouter.get('/search', authMiddleware, searchUsersController);

useRouter.get('/', getAllUsersController);

export default useRouter;