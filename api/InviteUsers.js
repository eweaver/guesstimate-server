var util = require('util'),
    async = require('async'),
    ApiClass = require('./ApiClass'),
    User = require('../objects/User'),
    Game = require('../objects/Game');

/**
 * Invite users to join a game.
 *
 * @constructor
 */
var InviteUsers = function() {

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

            var usersAdded = 0;

            async.each(users, function(userIdentifier, aCallback) {
                game.inviteUser(gameId, userIdentifier, function(err) {
                    if(err !== null && typeof error !== 'undefined') {
                        throw new Error('Unable to invite ' + userIdentifier + ' to game ' + gameId);
                    } else {
                        usersAdded++;
                    }

                    aCallback();
                });
            },
            function(err) {
                if(err === null || typeof err === 'undefined') {
                    callback(null, usersAdded + ' users invited');
                } else {
                    callback(err);
                }
            });
        });
    };
};

util.inherits(InviteUsers, ApiClass);
module.exports = InviteUsers;