import { Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthRequest } from "../auth/auth.types";
import { getMyProfile, updateProfile } from "./user.service";

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