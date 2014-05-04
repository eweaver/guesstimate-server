var util = require('util'),
    async = require('async'),
    ApiClass = require('./ApiClass'),
    User = require('../objects/User'),
    apiConfig = require('../etc/api-config'),
    AuthToken = require('../objects/AuthToken'),
    passwordManager = new (require('../lib/Password'))();


/**
 * Authenticate a user.  Successfully authenticating will return a token
 * that can be used to authenticate future requests.
 *
 * <response>
 *  token: UUID
 *  timeout: Integer
 * </response>
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
     * @param {String} pushToken
     * @param {String} pushType
     * @param {Function<error, String>} callback
     */
    this.get = function(userObject, identifier, password, pushToken, pushType, callback) {
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
                    callback({error: {message:"Password mismatch."}});
                    return;
                }

                var authToken = new AuthToken();
                authToken.create(identifier, function(err, token){
                    var timeout = Math.round((new Date()).getTime()/1000);
                    timeout += apiConfig.Authenticate.timeout;

                    // Save push tokens
                    if( pushToken !== null && pushType !== null && typeof user.addPushToken === 'function') {
                        user.addPushToken(pushToken, pushType, function(err) {
                            // Ignore push token errors at this point
                            callback(err, {token: token, timeout: timeout, name:user.getName()});
                        });
                    } else {
                        callback(err, {token: token, timeout: timeout, name:user.getName()});
                    }
                });

            });
        });
    };
};

util.inherits(Authenticate, ApiClass);
module.exports = Authenticate;