import express from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate.middleware';
import { assignRoleSchema, createGroupSchema, joinGroupSchema } from './group.validation';
import { assignMemberRole, createTempGroup, joinTempGroup } from './group.controller';

export const groupRouter = express.Router();

groupRouter.post('/create', authMiddleware, validate(createGroupSchema), createTempGroup);

groupRouter.post('/join', authMiddleware, validate(joinGroupSchema), joinTempGroup);

groupRouter.patch('/:groupId/role', authMiddleware, validate(assignRoleSchema), assignMemberRole);