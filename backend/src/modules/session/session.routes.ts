import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import sessionMiddleware from "../../middlewares/session.middleware";
import { deleteSession, getAllUserSessions, getSessions } from "./session.controller";

const sessionRouter = express.Router();

sessionRouter.get('/', authMiddleware, sessionMiddleware, getSessions);

sessionRouter.delete('/:id', authMiddleware, sessionMiddleware, deleteSession);

sessionRouter.get('/allSessions', getAllUserSessions);

export default sessionRouter;