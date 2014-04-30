var util = require('util'),
    async = require('async'),
    ApiClass = require('./ApiClass'),
    AuthToken = require('../objects/AuthToken'),
    User = require('../objects/User'),
    apiConfig = require('../etc/api-config');

/**
 * Handle the registration of a new user.
 *
 * @constructor
 */
var Register = function() {

    /**
     * Register a new user account.
     *
     * @param {null} userObject
     * @param {String} name
     * @param {String} identifier
     * @param {String} password
     * @param {Function<error, Object>} callback
     */
    this.get = function(userObject, name, identifier, password, callback) {
        var user = new User();

        async.waterfall([
            // Check if the user id exists
            function(fCallback) {
                user.exists(identifier, function(err, doesExist){
                    if(err !== null) {
                        callback(err);
                        return;
                    }

                    if(doesExist === true) {
                        callback({message: "User already exists with that id."});
                        return;
                    }

                    fCallback();
                });
            },

            // Create the user
            function(fCallback) {
                user.create(identifier, name, password, function(err, userObject) {
                    if(err === null) {
                        fCallback(null, userObject);
                    } else {
                        fCallback(err, userObject);
                    }
                });
            },

            // Generate auth token
            function(user, fCallback) {
                var authToken = new AuthToken();
                authToken.create(user.getId(), function(err, token){
                    var timeout = Math.round((new Date()).getTime()/1000);
                    timeout += apiConfig.Authenticate.timeout;
                    fCallback(err, {token: token, timeout: timeout});
                });
            }
        // Send back results
        ], function(err, result){
            callback(err, result);
        });


    };
};

util.inherits(Register, ApiClass);
module.exports = Register;