import { Request, Response } from "express";
import { ACCESS_COOKIE_OPTIONS, REFRESH_COOKIE_OPTIONS } from "./auth.constants";
import { loginUser, logout, logoutAll, refreshAccessToken, registerUser } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";
import { AuthRequest } from "../auth/auth.types";
import { getMyProfile, updateProfile } from "../users/user.service";

export const register = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {

        const {
            username,
            email,
            password
        } = req.body;

        const {
            user,
            accessToken,
            refreshToken
        } = await registerUser({
            username,
            email,
            password,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            deviceInfo: 'Unknown'
        });


        res.cookie(
            'accessToken',
            accessToken,
            ACCESS_COOKIE_OPTIONS
        );

        res.cookie(
            'refreshToken',
            refreshToken,
            REFRESH_COOKIE_OPTIONS
        );

        return res.status(201).json({
            success: true,
            message: 'User Registered',
            user
        });


    }
);

export const login = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {

        const {
            email,
            password
        } = req.body;

        const {
            user,
            accessToken,
            refreshToken
        } = await loginUser({
            email,
            password,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            deviceInfo: 'Unknown'
        });

        res.cookie(
            'accessToken',
            accessToken,
            ACCESS_COOKIE_OPTIONS
        );

        res.cookie(
            'refreshToken',
            refreshToken,
            REFRESH_COOKIE_OPTIONS
        );

        return res.status(200).json({
            success: true,
            message: 'Login Successful',
            user
        });

    }
);

export const refreshAccessTokenController = catchAsync(
    async (
        req: Request,
        res: Response
    ): Promise<void> => {

        const refreshToken = req.cookies?.refreshToken ?? req.body?.refreshToken;

        if (!refreshToken) {
            res.status(401).json({
                success: false,
                message: "Refresh token missing"
            });
            return;
        }

        const {
            accessToken,
            refreshToken: newRefreshToken
        } = await refreshAccessToken(refreshToken);

        res.cookie(
            "accessToken",
            accessToken,
            ACCESS_COOKIE_OPTIONS
        );

        res.cookie(
            "refreshToken",
            newRefreshToken,
            REFRESH_COOKIE_OPTIONS
        );

        res.status(200).json({
            success: true,
            message: "Token refreshed successfully"
        });
    }
);

export const logoutUser = catchAsync(
    async (req: AuthRequest, res: Response) => {

        await logout(req.user!.sessionId);

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    }
);

export const logoutAllDevices = catchAsync(
    async (req: AuthRequest, res: Response) => {

        await logoutAll(req.user!.id);

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json({
            success: true,
            message: 'Logged out from all devices'
        });
    }
);