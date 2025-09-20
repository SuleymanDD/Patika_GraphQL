const {RedisPubSub} = require("graphql-redis-subscriptions");
const Redis = require("ioredis");

require('dotenv').config();

const options = {
    host: process.env.DB_HOST,
    port: 19181,
    password: process.env.DB_PASSWORD,
    retryStrategy: times => {
        return Math.min(times * 50, 2000);
    }
};

const pubsub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options),
});

module.exports = pubsub;















