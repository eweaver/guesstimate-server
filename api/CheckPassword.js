var util = require('util'),
    async = require('async'),
    ApiClass = require('./ApiClass'),
    User = require('../objects/User'),
    passwordManager = new (require('../lib/Password'))();


/**
 * Dev API for checking a password
 *
 * @dev
 * @constructor
 */
var CheckPassword = function() {

    /**
     * Check a user id's password
     *
     * @param {null} userObject
     * @param {String} name
     * @param {String} identifier
     * @param {String} password
     * @param {Function<error, Object>} callback
     */
    this.get = function(userObject, identifier, password, callback) {
        var user = new User(identifier);

        user.init(identifier, function(err) {
            if(err !== null) {
                callback(err);
                return;
            }
            passwordManager.check(password, user.getPasswordHash(), function(err, result) {
                callback(err, {success: true, passwordMatches:result});
            });
        });
    };
};

util.inherits(CheckPassword, ApiClass);
module.exports = CheckPassword;