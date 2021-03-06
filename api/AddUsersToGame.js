var util = require('util'),
    async = require('async'),
    ApiClass = require('./ApiClass'),
    User = require('../objects/User'),
    Game = require('../objects/Game'),
    PushNotifications = require('../lib/PushNotifications');

/**
 * Invite users to join a game.
 *
 * @constructor
 */
var AddUsersToGame = function() {

    /**
     * Invite a a list of users to a game
     *
     * @param {User} userObject
     * @param {String} gameId
     * @param {Array} users
     * @param {Function<error, Object>} callback
     */
    this.get = function(userObject, gameId, users, callback) {
        var game = new Game();
        game.exists(gameId, function(err, gameExists) {
            if(err !== null) {
                callback(err);
                return;
            }

            if(gameExists === false) {
                callback({error:{message:"Game does not exist."}});
                return;
            }

            var usersAdded = [];
            var pushNotifications = new PushNotifications();

            async.each(users, function(userIdentifier, aCallback) {
                    game.addUser(gameId, userIdentifier, function(err) {
                        if(err !== null && typeof error !== 'undefined') {
                            throw new Error('Unable to add ' + userIdentifier + ' to game ' + gameId);
                        } else {
                            var user = new User();
                            user.init(userIdentifier, function(err, userData) {
                                if(err === null) {
                                    usersAdded.push({id: userIdentifier, name: user.getName()});
                                    user.getPushTokens(function(err, devices) {
                                        pushNotifications.send(devices, userObject.getName() + ' invited you to a game!', {gameId: gameId, type:"gameInvite"}, function(){});
                                        aCallback();
                                    });
                                }
                            });
                        }
                    });
                },
                function(err) {
                    if(err === null || typeof err === 'undefined') {
                        callback(null, usersAdded);
                    } else {
                        callback(err);
                    }
                });
        });
    };
};

util.inherits(AddUsersToGame, ApiClass);
module.exports = AddUsersToGame;