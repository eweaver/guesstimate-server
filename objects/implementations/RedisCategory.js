var createRedisClient = require('../../lib/RedisClient');

/**
 * Represents a single User object.  Contains three properties.
 *
 * token            UUID auth token
 * id               Unique identifier
 *
 * @param {redis} redisClient
 * @constructor
 */
var RedisCategory = function(redisConfig) {
    var CATEGORIES_KEY = 'categories';

    var _redisClient = createRedisClient(redisConfig);

    /**
     * Get a single category by id
     *
     * @param {String} id
     * @param {Function<error, Object>} callback
     * @throws Error
     */
    this.load = function(id, callback) {
        _redisClient.hget(CATEGORIES_KEY, id, function(err, value) {
            callback(err, value);
        });
    };

    /**
     * Get all categories
     *
     * @param {Function<error, Array>} callback
     * @throws Error
     */
    this.loadAll = function(callback) {
        _redisClient.hgetall(CATEGORIES_KEY, function(err, values) {
            var categories = [];

            for(var c in values) {
                if(values.hasOwnProperty(c)) {
                    var obj = {id: c, title: values[c]}
                    categories.push(obj);
                }
            }

            callback(err, categories);
        });
    };
};

module.exports = RedisCategory;