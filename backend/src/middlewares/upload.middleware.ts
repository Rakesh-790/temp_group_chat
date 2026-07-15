import multer from "multer";
import { AppError } from "../utils/AppError";
import path from "node:path";

const storage = multer.memoryStorage();

const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) : void => {
     
    const allowedMimeTypes = [
        '.jpg',
        '.jpeg',
        '.png',
        '.webp',
        '.heic'
    ];

    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMimeTypes.includes(ext)) {
        cb(null, true);
    }else{
        cb(
            new AppError(
                'Only jpg, jpeg, png, webp and HEIC images are allowed',
                400
            )
        );
    };
};

export const uploadAvatar = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter
});