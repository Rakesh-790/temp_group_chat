import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import sessionMiddleware from "../../middlewares/session.middleware";
import { deleteSession, getSessions } from "./session.controller";

export const router = express.Router();

router.get('/', authMiddleware, sessionMiddleware, getSessions);

router.delete('/:id', authMiddleware, sessionMiddleware, deleteSession);