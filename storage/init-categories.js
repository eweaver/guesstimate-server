var config = require('../etc/config'),
    categories = require('./categories.json'),
    createRedisClient = require('../lib/RedisClient'),
    redisClient = createRedisClient(config.redis);

for(var c in categories) {
    if(categories.hasOwnProperty(c)) {
        redisClient.hsetnx('categories', c, categories[c]);
    }
}