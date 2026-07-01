import { Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../modules/auth/auth.types';
import { findValidSession } from '../modules/session/session.service';

export const sessionMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {

    const sessionId = req.user?.sessionId;

    if (!sessionId) {
        return next(
            new AppError('Session not found', 401)
        );
    }

    const session = await findValidSession(sessionId);

    req.session = session;

    next();
};

export default sessionMiddleware;