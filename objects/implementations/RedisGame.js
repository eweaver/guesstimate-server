var createRedisClient = require('../../lib/RedisClient'),
    config = require('../../etc/api-config'),
    uuid = require('uuid');

/**
 * Represents an active game.
 *
 * @param {redis} redisClient
 * @constructor
 */
var RedisGame = function(redisConfig) {
    var GAME_BASE_KEY = 'g:';
    var PLAYERS_KEY  = ':players';

    var _redisClient = createRedisClient(redisConfig);

    /**
     * Create a new game
     *
     * @param {String} categoryId
     * @param {String} questionId
     * @param {String} identifier
     * @param {Function<error, Object>} callback
     */
    this.create = function(categoryId, questionId, identifier, callback) {
        var gameId = uuid.v4();
        var hashKey = GAME_BASE_KEY + gameId;
        var playersKey = hashKey + PLAYERS_KEY;

        // Game object
        _redisClient.hset(hashKey, 'categoryId', categoryId);
        _redisClient.hset(hashKey, 'questionId', questionId);
        _redisClient.hset(hashKey, 'creator', identifier);
        _redisClient.expire(hashKey, config.Game.expiration);

        // Players
        _redisClient.zadd(playersKey, 0, identifier);

        callback({gameId: gameId});
    };
};

module.exports = RedisGame;