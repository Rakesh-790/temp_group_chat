import IORedis from 'ioredis';
import { REDIS_HOST, REDIS_PORT } from './config';

const redis = new IORedis({
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
    maxRetriesPerRequest: null
});

redis.on("connect", () => {
    console.log("Redis Connected successfully");
});

redis.on("ready", () =>{
    console.log("Redis is ready to accept commands");
});

redis.on("error", (error) =>{
    console.log("Redis Error", error);
});

redis.on("close", ()=>{
    console.log("Redis connection closed");
});

redis.on("reconnecting", () => {
    console.log("Reconnecting to Redis...");
});

export default redis;