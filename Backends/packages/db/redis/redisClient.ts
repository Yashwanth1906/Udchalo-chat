import { createClient } from 'redis';

const redis = createClient({
    username: 'default',
    password: 'GTqiYU3SVVnBRnEhS6YtnnYvTn9mdC9Z',
    socket: {
        host: 'redis-18018.c80.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 18018
    }
});

redis.on('error', err => console.log('Redis Client Error', err));

const func = async()=>{
    await redis.connect();
}
func();

export default redis;