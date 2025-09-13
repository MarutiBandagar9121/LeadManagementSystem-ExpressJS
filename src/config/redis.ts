import { createClient, RedisClientType } from "redis";
import config from "./Config";

let client: RedisClientType;

const connectToRedis = async (): Promise<RedisClientType> => {
    try{
        if (client && client.isOpen) {
            return client;
        }
        
        client = createClient({
            url: `redis://${config.redisHost}:${config.redisPort}?tls=${config.redisTls}`,
        }) as RedisClientType;
        
        client.on('error',(err)=>{
            console.error('Redis Client Error',err);
            process.exit(1);
        });
        
        await client.connect();
        return client;
    }catch(error){
        console.error("Redis connection failed:", error);
        process.exit(1);
    }
}

export { connectToRedis, client };