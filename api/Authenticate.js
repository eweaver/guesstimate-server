var util = require('util'),
    async = require('async'),
    ApiClass = require('./ApiClass'),
    User = require('../objects/User'),
    AuthToken = require('../objects/AuthToken'),
    passwordManager = new (require('../lib/Password'))();


/**
 * Authenticate a user.  Successfully authenticating will return a token
 * that can be used to authenticate future requests.
 *
 * @dev
 * @constructor
 */
var Authenticate = function() {

    /**
     * Get an authentication token.
     *
     * @param {null} userObject
     * @param {String} identifier
     * @param {String} password
     * @param {Function<error, String>} callback
     */
    this.get = function(userObject, identifier, password, callback) {
        var user = new User(identifier);
        user.init(identifier, function(err) {
            if(err !== null) {
                callback(err);
                return;
            }

            passwordManager.check(password, user.getPasswordHash(), function(err, result) {
                if(err !== null) {
                    callback(err);
                    return;
                }

                if(result === false) {
                    callback(null, {success: false, error: {message:"Password mismatch."}});
                    return;
                }

                var authToken = new AuthToken();
                authToken.create(identifier, function(err, token){
                    console.log(err);
                    console.log(token);
                    callback(err, {success: true, token: token});
                });
            });
        });
    };
};

util.inherits(Authenticate, ApiClass);
module.exports = Authenticate;