import multer from "multer";
import { AppError } from "../utils/AppError";
import path from "node:path";

const storage = multer.memoryStorage();

const imageFileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
): void => {

    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".heic"
    ];

    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(extension)) {
        cb(null, true);
        return;
    }

    cb(
        new AppError(
            "Only JPG, JPEG, PNG, WEBP and HEIC images are allowed.",
            400
        )
    );
};

export const uploadImage = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: imageFileFilter
});