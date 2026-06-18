import dotenv from 'dotenv';
dotenv.config({ path: "./.env" });

export const NODE_ENV : string | undefined = process.env.NODE_ENV;
export const PORT : Number | string = process.env.PORT ?? 3001;
export const MONGO_URI : string | undefined = process.env.MONGO_URI;
export const JWT_ACCESS_SECRET : string | undefined = process.env.JWT_ACCESS_SECRET;
export const JWT_REFRESH_SECRET : string | undefined = process.env.JWT_REFRESH_SECRET; 