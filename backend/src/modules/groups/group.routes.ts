import express from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate.middleware';
import { createGroupSchema, joinGroupSchema } from './group.validation';
import { createTempGroup, joinTempGroup } from './group.controller';

export const groupRouter = express.Router();

groupRouter.post('/create', authMiddleware, validate(createGroupSchema), createTempGroup);

groupRouter.post('/join', authMiddleware, validate(joinGroupSchema), joinTempGroup);