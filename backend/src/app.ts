import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import { errorMiddleware } from "./middlewares/Error.middleware";
import authRouter from "./modules/auth/auth.routes";
import sessionRouter from "./modules/session/session.routes";
import useRouter from "./modules/users/user.routes";

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/session', sessionRouter);
app.use('/api/users', useRouter);

app.use(errorMiddleware);