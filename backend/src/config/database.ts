import mongoose from "mongoose";
import { MONGO_URI } from './config';

export const connectDB = async() =>{
    try {
        await mongoose.connect(MONGO_URI!);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.log('Failed to Connect Database', error);
        process.exit(1);
    }
}