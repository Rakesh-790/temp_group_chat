import "./jobs";
import { app } from './app';
import { PORT } from './config/config';
import { connectDB } from './config/database';

const startServer = async () => {
    
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    });

    await connectDB();
}

startServer();