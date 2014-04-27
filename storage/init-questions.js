var config = require('../etc/config'),
    categories = require('./categories.json'),
    createRedisClient = require('../lib/RedisClient'),
    redisClient = createRedisClient(config.redis);

for(var c in categories) {
    if(categories.hasOwnProperty(c)) {
        var questions = require('./questions-' + c);
        for(var q in questions) {
            if(questions.hasOwnProperty(q)) {
                redisClient.hsetnx('questions-' + c, q, JSON.stringify(questions[q]));
            }
        }
    }
}