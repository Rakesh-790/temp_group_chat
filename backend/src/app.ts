import cookieParser from "cookie-parser";
import express from "express";
import cors from 'cors';
import { errorMiddleware } from "./middlewares/Error.middleware";
import authRouter from "./modules/auth/auth.routes";
import sessionRouter from "./modules/session/session.routes";
import useRouter from "./modules/users/user.routes";
import { groupRouter } from "./modules/groups/group.routes";
import { messageRouter } from "./modules/messages/message.routes";
import { notificationRouter } from "./modules/notifications/notification.router";

export const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/session', sessionRouter);
app.use('/api/users', useRouter);
app.use('/api/groups', groupRouter);
app.use('/api/messages', messageRouter);
app.use("/api/notifications", notificationRouter);

app.use(errorMiddleware);