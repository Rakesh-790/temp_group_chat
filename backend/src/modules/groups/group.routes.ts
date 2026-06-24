import express from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate.middleware';
import { createGroupSchema } from './group.validation';
import { createTempGroup } from './group.controller';

export const groupRouter = express.Router();

groupRouter.post('/create', authMiddleware, validate(createGroupSchema), createTempGroup);