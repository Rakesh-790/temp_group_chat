import express from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validate.middleware';
import { assignRoleSchema, createGroupSchema, deleteGroupSchema, joinGroupSchema, removeMemberSchema, updateGroupAvatarSchema, updateGroupSchema } from './group.validation';
import { assignMemberRole, createTempGroup, deleteTempGroup, getAllGroupsController, getGroupByIdController, joinTempGroup, removeGroupMember, updateGroupAvatarController, updateGroupController } from './group.controller';
import { uploadImage } from '../../middlewares/upload.middleware';

export const groupRouter = express.Router();

groupRouter.post('/create', authMiddleware, validate(createGroupSchema), createTempGroup);

groupRouter.post('/join', authMiddleware, validate(joinGroupSchema), joinTempGroup);

groupRouter.patch('/:groupId', authMiddleware, validate(updateGroupSchema), updateGroupController);

groupRouter.patch('/:groupId/avatar', authMiddleware, uploadImage.single('avatar'), validate(updateGroupAvatarSchema), updateGroupAvatarController);

groupRouter.patch('/:groupId/role', authMiddleware, validate(assignRoleSchema), assignMemberRole);

groupRouter.delete("/:groupId/members/:userId", authMiddleware, validate(removeMemberSchema), removeGroupMember);

groupRouter.delete('/:groupId', authMiddleware, validate(deleteGroupSchema), deleteTempGroup);

groupRouter.get('/:groupId', authMiddleware, getGroupByIdController);

groupRouter.get('/', authMiddleware, getAllGroupsController);