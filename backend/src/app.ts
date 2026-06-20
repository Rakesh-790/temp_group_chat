import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import authRouter from '../src/modules/auth/auth.routes';
import { errorMiddleware } from "./middlewares/Error.middleware";
import { router as sessionRouter } from "./modules/session/session.routes";

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/session', sessionRouter);

app.use(errorMiddleware);