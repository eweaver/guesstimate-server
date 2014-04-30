var util = require('util'),
    ApiClass = require('./ApiClass'),
    Game = require('../objects/Game');

/**
 * Handle the registration of a new user.
 *
 * @constructor
 */
var CreateGame = function() {

    /**
     * Create a Game
     *
     * @param {userObject} userObject
     * @param {String} categoryId
     * @param {String} questionId
     * @param {Function<error, Object>} callback
     */
    this.get = function(userObject, categoryId, questionId, callback) {
        var game = new Game();

        console.log(userObject);
        game.create(categoryId, questionId, userObject.getId(), function(gameObject){
            callback(null, gameObject);
        });
    };
};

util.inherits(CreateGame, ApiClass);
module.exports = CreateGame;