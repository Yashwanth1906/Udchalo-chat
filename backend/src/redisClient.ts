import Redis from 'ioredis';

const redis = new Redis({
    host: 'redis-17318.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 17318,
});

export default redis;
