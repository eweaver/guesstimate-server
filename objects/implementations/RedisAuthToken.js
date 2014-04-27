var createRedisClient = require('../../lib/RedisClient'),
    config = require('../../etc/api-config'),
    uuid = require('uuid');

/**
 * Represents a single User object.  Contains three properties.
 *
 * token            UUID auth token
 * id               Unique identifier
 *
 * @param {redis} redisClient
 * @constructor
 */
var RedisAuthToken = function(redisConfig) {
    var _redisClient = createRedisClient(redisConfig);

    /**
     * Create a new authentication token.
     *
     * @param {String} id
     * @param {Function<error, String>} callback
     * @throws Error
     */
    this.create = function(id, callback) {
        var token = uuid.v4();
        _redisClient.set(token, id, function(err, value){
            _redisClient.expire(token, config.Authenticate.timeout);
            callback(err, token);
        });
    };

    /**
     * Retrieve the identifier associated with a token.
     *
     * @param {String} token
     * @param {Function<error, String>} callback
     */
    this.load = function(token, callback) {
        _redisClient.get(token, function(err, identifier) {
            callback(err, identifier);
        });
    };
};

module.exports = RedisAuthToken;