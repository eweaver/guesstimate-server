var createRedisClient = require('../../lib/RedisClient'),
    async = require('async'),
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
    var PLAYERS_KEY  = ':p';
    var PLAYER_GAME_LIST_KEY = 'my:';
    var PLAYER_INVITES_LIST_KEY = 'in:';

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
        var myGamesKey = PLAYER_GAME_LIST_KEY + identifier;
        var timestamp = Math.round((new Date()).getTime()/1000) + config.Game.expiration;

        // Game object
        _redisClient.hset(hashKey, 'categoryId', categoryId);
        _redisClient.hset(hashKey, 'questionId', questionId);
        _redisClient.hset(hashKey, 'creator', identifier);
        _redisClient.expire(hashKey, config.Game.expiration);

        // Players
        _redisClient.zadd(playersKey, 0, identifier);
        _redisClient.expire(playersKey, config.Game.expiration + 60);

        // Add to my games (expire gameIds at some point)
        _redisClient.zadd(myGamesKey, timestamp, gameId);

        callback({gameId: gameId});
    };

    /**
     * Return a list of all active games
     *
     * @param {String} identifier
     * @param {Function<error, Object>} callback
     */
    this.getAllById = function(identifier, callback) {
        var myGamesKey = PLAYER_GAME_LIST_KEY + identifier;
        var now = Math.round((new Date()).getTime()/1000);

        // Prune expired games.
        _redisClient.zremrangebyscore(myGamesKey, '-inf', now, function(err) {
            if(err!== null) {
                callback(err);
                return;
            }

            _redisClient.zrangebyscore(myGamesKey, now, '+inf', function(err, games) {
                callback(err, games);
            });
        });
    };

    /**
     * Get game data for a single game Id
     *
     * @param {String} gameId
     * @param {Function<error, Object>} callback
     */
    this.getGameData = function(gameId, callback) {
        var hashKey = GAME_BASE_KEY + gameId;
        var playersKey = hashKey + PLAYERS_KEY;

        _redisClient.hgetall(hashKey, function(err, gameData) {
            if(err !== null) {
                callback(err);
                return;
            }

            if(gameData === null) {
                // Remove bad games?
                callback({error:{message:"Invalid game, no data found."}});
                return;
            }

            // get player data
            _redisClient.zrangebyscore(playersKey, '-inf', '+inf', function(err, playersData) {
                if(err !== null) {
                    callback(err);
                    return;
                }

                gameData.players = playersData;
                callback(null, gameData);
            });
        });
    };

    /**
     * Check if a game exists.
     *
     * @Param {String} gameId
     * @param {Function<error, Object>} callback
     */
    this.exists = function(gameId, callback) {
        var hashKey = GAME_BASE_KEY + gameId;
        _redisClient.exists(hashKey, function(err, value) {
            callback(err, (value == 1));
        });
    };

    /**
     * Invite a user to a game.
     *
     * @param {String} gameId
     * @param {String} identifier
     * @param {Function<error, Object>} callback
     */
    this.inviteUser = function(gameId, identifier, callback) {
        var myInvitesKey = PLAYER_INVITES_LIST_KEY + identifier;

        _redisClient.zadd(myInvitesKey, gameId, gameId, function(err) {
            callback(err);
        });
    };

    /**
     * Add a user to a game.
     *
     * @param {String} gameId
     * @param {String} identifier
     * @param {Function<error, Object>} callback
     */
    this.addUser = function(gameId, identifier, callback) {
        var hashKey = GAME_BASE_KEY + gameId;
        var playersKey = hashKey + PLAYERS_KEY;
        var myGamesKey = PLAYER_GAME_LIST_KEY + identifier;
        var timestamp = Math.round((new Date()).getTime()/1000) + config.Game.expiration;

        _redisClient.zadd(myGamesKey, timestamp, gameId, function(err) {
            if(err !== null) {
                callback(err);
                return;
            }

            _redisClient.zadd(playersKey, 0, identifier, function(err) {
                if(err !== null) {
                    // Remove invite that has been accepted
                    var myInvitesKey = PLAYER_INVITES_LIST_KEY + identifier;
                    _redisClient.zrem(myInvitesKey. gameId);
                }

                callback(err);
            });
        });
    };

    /**
     * Record an answer
     *
     * @param {String} gameId
     * @param {String} identifier
     * @param {Number} answer
     * @param {Function<error, Object>} callback
     */
    this.recordAnswer = function(gameId, identifier, answer, callback) {
        var hashKey = GAME_BASE_KEY + gameId;
        var playersKey = hashKey + PLAYERS_KEY;

        _redisClient.zadd(playersKey, answer, identifier, function(err) {
            callback(err);
        });
    };

    /**
     * Get all scores for game.
     *
     * @param {String} gameId
     * @param {Function<error, Object>} callback
     */
    this.getScores = function(gameId, callback) {
        var hashKey = GAME_BASE_KEY + gameId;
        var playersKey = hashKey + PLAYERS_KEY;

        _redisClient.zrangebyscore(playersKey, '-inf', '+inf', function(err, playersData) {
            if(err !== null) {
                callback(err);
                return;
            }

            var scores = {};

            async.each(playersData, function(userIdentifier, aCallback) {
                    _redisClient.zscore(playersKey, userIdentifier, function(err, score) {
                        if(err !== null) {
                            throw new Error('Unable to load scores data for ' + userIdentifier + ', game ' + gameId);
                        }

                        scores[ userIdentifier ] = score;
                        aCallback();
                    });
                },
                function(err) {
                    if(err === null || typeof err === 'undefined') {
                        callback(null, scores);
                    } else {
                        callback(err);
                    }

                });
        });
    };
};

module.exports = RedisGame;