var config = require('./config');

module.exports = {
    User: {
        implementation: "RedisUser",
        config: config.redis
    },
    AuthToken: {
        implementation: "RedisAuthToken",
        config: config.redis
    },
    Category: {
        implementation: "RedisCategory",
        config: config.redis
    },
    Question: {
        implementation: "RedisQuestion",
        config: config.redis
    }
};