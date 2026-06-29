import "./jobs";
import { app } from './app';
import { PORT } from './config/config';
import { connectDB } from './config/database';
import { addDeleteGroupJob } from './jobs/queues/deleteGroup.queues';


const startServer = async () => {
    
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    });

    await connectDB();
    await addDeleteGroupJob("test-group-id");
}

startServer();