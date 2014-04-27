var createRedisClient = require('../../lib/RedisClient');

/**
 * Represents a single Question object.  Can also be used to load all questions
 * in collection format.
 *
 * token            UUID auth token
 * id               Unique identifier
 *
 * @param {redis} redisClient
 * @constructor
 */
var RedisQuestion = function(redisConfig) {
    var QUESTIONS_BASE_KEY = 'questions-';

    var _redisClient = createRedisClient(redisConfig);

    /**
     * Get a single category by id
     *
     * @param {String} categoryId
     * @param {String} id
     * @param {Function<error, Object>} callback
     */
    this.load = function(categoryId, id, callback) {
        _redisClient.hget(QUESTIONS_BASE_KEY + categoryId, id, function(err, value) {
            callback(err, JSON.parse(value));
        });
    };

    /**
     * Get all categories
     *
     * @param {String} categoryId
     * @param {Function<error, Array>} callback
     */
    this.loadAll = function(categoryId, callback) {
        _redisClient.hgetall(QUESTIONS_BASE_KEY + categoryId, function(err, values) {
            var questions = [];

            for(var v in values) {
                if(values.hasOwnProperty(v)) {
                    var obj = JSON.parse(values[v]);
                    obj.id = v;
                    questions.push(obj);
                }
            }

            callback(err, questions);
        });
    };
};

module.exports = RedisQuestion;