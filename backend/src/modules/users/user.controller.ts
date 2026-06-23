import { Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthRequest } from "../auth/auth.types";
import { getMyProfile, searchUsers, updateProfile, uploadAvatar } from "./user.service";
import { AppError } from "../../utils/AppError";

export const getProfile = catchAsync(
    async (
        req: AuthRequest,
        res: Response
    ) => {

        const profile = await getMyProfile(
            req.user!.id
        );

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            profile
        });

    }
);

export const updateUserProfile = catchAsync(
    async (
        req: AuthRequest,
        res: Response
    ) => {

        const profile = await updateProfile(
            req.user!.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile
        });

    }
);

export const uploadUserAvatar = catchAsync(
    async (req: AuthRequest, res: Response) => {

        const userId = req.user?.id;

        if (!userId) {
            throw new AppError(
                'Unauthorized',
                401
            );
        }

        if (!req.file) {
            throw new AppError(
                'Avatar is required',
                400
            );
        }

        const avatar = await uploadAvatar(
            userId,
            req.file
        );

        return res.status(200).json({
            success: true,
            message: 'Avatar uploaded successfully',
            data: avatar
        });
    }
);

export const searchUsersController = catchAsync(
    async (req: AuthRequest, res: Response) => {

        if (!req.user) {
            throw new AppError(
                'Unauthorized',
                401
            );
        }

        const searchQuery = (req.query.q as string)?.trim();

        if (!searchQuery) {
            throw new AppError(
                'Search query is required',
                400
            );
        }

        const page = Math.max(Number(req.query.page) || 1, 1);

        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);


        const searchResult = await searchUsers(
            req.user.id,
            searchQuery,
            page,
            limit
        );

        return res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            data: searchResult
        });
    }
);