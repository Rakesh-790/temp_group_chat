import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AWS_ACCESS_KEY_ID, AWS_BUCKET_NAME, AWS_REGION, AWS_SECRET_ACCESS_KEY } from "../config/config";
import {v4 as uuidV4} from 'uuid';
import { Upload } from "@aws-sdk/lib-storage";

const s3Client = new S3Client({
    region: AWS_REGION!,

    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID!,
        secretAccessKey: AWS_SECRET_ACCESS_KEY!
    }
});

interface UploadAvatarParams {
    file: Express.Multer.File;
    userId: string;
};

interface UploadAvatarResponse {
    url: string,
    key: string
};

export const uploadAvatarToS3 = async({
    file,
    userId
} : UploadAvatarParams) : Promise<UploadAvatarResponse> => {

    const extension = file.originalname.split('.').pop();

    const key = `avatars/${userId}_${uuidV4()}.${extension}`;

    const upload = new Upload({
        client : s3Client,
        params: {
            Bucket: AWS_BUCKET_NAME!,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        }
    });

    const result = await upload.done();

    return {
        key,
        url: result.Location ?? ""
    };
};

export const deleteAvatarFromS3 = async(
    key: string
) : Promise<void> => {

    await s3Client.send(
        new DeleteObjectCommand({
            Bucket: AWS_BUCKET_NAME!,
            Key: key
        })
    );
};