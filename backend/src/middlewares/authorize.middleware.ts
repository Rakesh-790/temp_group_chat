import { NextFunction, Response } from "express";
import { AuthRequest } from "../modules/auth/auth.types";
import { AppError } from "../utils/AppError";

export const authorize = (...roles: string[]) => {
    return (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) : void => {

        if(!req.user){
            return next(
                new AppError(
                    "Unauthroized",
                    401
                )
            );
        };

        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    "Forbidden",
                    403
                )
            );
        };

        next();
    };
};