var config = require('../etc/implementations');

/**
 * Interface to the underlying Game store implementation.
 *
 * @constructor
 */
var Game = function() {

    /**
     * Implementation class name.
     *
     * @type {String}
     * @private
     */
    var _implementation = require('./implementations/' + config.Game.implementation);

    /**
     * Configuration to pass in to the implementation class.
     *
     * @type {Object}
     * @private
     */
    var _implementationConfig = config.Game.config;

    /**
     * Implementation class to forward User requests to.
     *
     * @type {implementation}
     * @private
     */
    var _implClass = new _implementation(_implementationConfig);

    /**
     * Create a new game
     *
     * @param {String} categoryId
     * @param {String} questionId
     * @param {String} identifier
     * @param {Function<error, Object>} callback
     */
    this.create = function(categoryId, questionId, identifier, callback) {
        return _implClass.create(categoryId, questionId, identifier, callback);
    };

    /**
     * Return a list of all active games
     *
     * @param {String} identifier
     * @param {Function<error, Object>} callback
     */
    this.getAllById = function(identifier, callback) {
        return _implClass.getAllById(identifier, callback);
    };

    /**
     * Get game data for a single game Id
     *
     * @param {String} gameId
     * @param {Function<error, Object>} callback
     */
    this.getGameData = function(gameId, callback) {
        return _implClass.getGameData(gameId, callback);
    };

    /**
     * Check if a game exists.
     *
     * @Param {String} gameId
     * @param {Function<error, Object>} callback
     */
    this.exists = function(gameId, callback) {
        return _implClass.exists(gameId, callback);
    };

    /**
     * Invite a user to a game.
     *
     * @param {String} gameId
     * @param {String} identifier
     * @param {Function<error, Object>} callback
     */
    this.inviteUser = function(gameId, identifier, callback) {
        return _implClass.inviteUser(identifier, callback);
    };

    /**
     * Add a user to a game.
     *
     * @param {String} gameId
     * @param {String} identifier
     * @param {Function<error, Object>} callback
     */
    this.addUser = function(gameId, identifier, callback) {
        return _implClass.addUser(gameId, identifier, callback);
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
        return _implClass.recordAnswer(gameId, identifier, answer, callback);
    };

    /**
     * Get all scores for game.
     *
     * @param {String} gameId
     * @param {Function<error, Object>} callback
     */
    this.getScores = function(gameId, callback) {
        return _implClass.getScores(gameId, callback);
    };

    // Non-implementation specific methods

    /**
     * Taking an object of scores data, check if the game is complete.  A game is
     * complete when all players have entered a score.
     *
     * @param {Object} scoresData
     * @return {Boolean}
     */
    this.isComplete = function(scoresData) {
        var isComplete = true;

        for(var id in scoresData) {
            if(scoresData.hasOwnProperty(id)) {
                var score = parseFloat(scoresData[id]);
                if(score == 0) {
                    isComplete = false;
                    break;
                }
            }
        }

        return isComplete;
    };

    /**
     * Calculate a winner based on an answer and a set of guesses.
     *
     * @param {Number} answer
     * @param {Object} scoresData
     * @return {Boolean}
     */
    this.calculateWinner = function(answer, scoresData) {
        var diff = -1;
        var winner = null;

        for(var id in scoresData) {
            if(! scoresData.hasOwnProperty(id)) {
                continue;
            }

            var idAnswer = parseFloat(scoresData[id]);
            var scoreDiff = Math.abs(answer - idAnswer);

            if(diff === -1 || scoreDiff < diff) {
                diff = scoreDiff;
                winner = id;
            }
        }

        return winner;
    };
};

module.exports = Game;