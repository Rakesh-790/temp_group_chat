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

interface UploadImageParams {
    file: Express.Multer.File;
    folder: string;
    identifier: string;
}

interface UploadImageResponse {
    url: string;
    key: string;
}

export const uploadImageToS3 = async ({
    file,
    folder,
    identifier
}: UploadImageParams): Promise<UploadImageResponse> => {

    const extension = file.originalname.split(".").pop();

    const key = `uploads/${folder}/${identifier}_${uuidV4()}.${extension}`;

    const upload = new Upload({
        client: s3Client,
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

export const deleteImageFromS3 = async (
    key: string
): Promise<void> => {

    await s3Client.send(
        new DeleteObjectCommand({
            Bucket: AWS_BUCKET_NAME!,
            Key: key
        })
    );
};