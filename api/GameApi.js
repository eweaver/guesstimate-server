var util = require('util'),
    ApiClass = require('./ApiClass'),
    Game = require('../objects/Game'),
    Question = require('../objects/Question');

/**
 * Handle the registration of a new user.
 *
 * @constructor
 */
var GameApi = function() {

    /**
     * Create a Game
     *
     * @param {User} userObject
     * @param {String} gameId
     * @param {Function<error, Object>} callback
     */
    this.get = function(userObject, gameId, callback) {
        var game = new Game();

        game.getGameData(gameId, function(err, gameData) {
            if(err !== null) {
                callback(err);
                return;
            }

            var question = new Question();
            question.load(gameData.categoryId, gameData.questionId, function(err, questionData) {
                if(err !== null) {
                    callback(err);
                    return;
                }

                gameData.questionText = questionData.text;
                callback(null, gameData);
            });
        });
    };
};

util.inherits(GameApi, ApiClass);
module.exports = GameApi;