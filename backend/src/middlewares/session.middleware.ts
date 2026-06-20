import { Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import sessionModel from '../modules/session/session.model';
import { ISession } from '../types/session.types';
import { AuthRequest } from '../types/auth.types';

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

    const session = await sessionModel.findById(sessionId);

    if (!session) {
        return next(
            new AppError('Session does not exist', 401)
        );
    }

    if (session.isRevoked) {
        return next(
            new AppError('Session has been revoked', 401)
        );
    }

    req.session = session;

    next();
};

export default sessionMiddleware;