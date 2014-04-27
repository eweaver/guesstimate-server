var redis = require('redis'),
    url = require('url');

/**
 * Create a new redis client from the given configuration.
 *
 * @param {Object} config
 * @return {redis}
 * @constructor
 */
var createRedisClient = function(config) {
    var redisURL = url.parse(config.url);
    var client = redis.createClient(config.port, redisURL.hostname, {no_ready_check: true});
    client.auth(config.password);
    return client;
};


module.exports = createRedisClient;