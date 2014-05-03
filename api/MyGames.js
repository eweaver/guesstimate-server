var util = require('util'),
    async = require('async'),
    ApiClass = require('./ApiClass'),
    Game = require('../objects/Game');

/**
 * Handle the registration of a new user.
 *
 * @constructor
 */
var MyGames = function() {

    /**
     * Create a Game
     *
     * @param {userObject} userObject
     * @param {Function<error, Object>} callback
     */
    this.get = function(userObject, callback) {
        var game = new Game();

        game.getAllById(userObject.getId(), function(err, games) {
            if(games instanceof Array && games.length > 0) {
                var gamesReturn = [];
                async.each(games, function(gameId, aCallback) {
                    game.getGameData(gameId, function(err, gameData) {
                        if(err === null) {
                            var gameObj = gameData;
                            gameObj.id = gameId;
                            gamesReturn.push(gameObj);
                        }
                        aCallback();
                    });
                }, function(err) {
                    if(err === null || typeof err === 'undefined') {
                        callback(null, gamesReturn);
                    } else {
                        callback(err);
                    }
                });
            } else {
                callback(err, games);
            }
        });
    };
};

util.inherits(MyGames, ApiClass);
module.exports = MyGames;