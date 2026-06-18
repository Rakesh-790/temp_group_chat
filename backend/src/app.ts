import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import authRouter from '../src/modules/auth/auth.routes';

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);