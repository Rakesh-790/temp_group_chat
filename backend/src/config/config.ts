import dotenv from 'dotenv';
dotenv.config({ path: "./.env" });

export const NODE_ENV : string | undefined = process.env.NODE_ENV;
export const PORT : Number | string = process.env.PORT ?? 3001;
export const MONGO_URI : string | undefined = process.env.MONGO_URI;
export const JWT_ACCESS_SECRET : string | undefined = process.env.JWT_ACCESS_SECRET;
export const JWT_REFRESH_SECRET : string | undefined = process.env.JWT_REFRESH_SECRET; 
export const AWS_ACCESS_KEY_ID : string | undefined = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY : string | undefined = process.env.AWS_SECRET_ACCESS_KEY;
export const AWS_REGION : string | undefined = process.env.AWS_REGION;
export const AWS_BUCKET_NAME : string | undefined = process.env.AWS_BUCKET_NAME;
export const REDIS_HOST: string | undefined = process.env.REDIS_HOST;
export const REDIS_PORT: string | undefined = process.env.REDIS_PORT;
export const CLIENT_URL: string | undefined = process.env.CLIENT_URL;