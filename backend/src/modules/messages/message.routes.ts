import express from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { getGroupMessagesController } from './message.controller';

export const messageRouter = express.Router();

messageRouter.get('/groups/:groupId/messages',
    authMiddleware,
    getGroupMessagesController
);