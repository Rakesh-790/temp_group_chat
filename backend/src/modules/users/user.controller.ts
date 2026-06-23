import { Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthRequest } from "../auth/auth.types";
import { getMyProfile, updateProfile, uploadAvatar } from "./user.service";
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