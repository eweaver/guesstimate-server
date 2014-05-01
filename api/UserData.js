/**
 * Handle the registration of a new user.
 *
 * @constructor
 */
var UserData = function() {

    /**
     * Register a new user account.
     *
     * @param {null} userObject
     * @param {String} name
     * @param {String} identifier
     * @param {String} password
     * @param {Function<error, Object>} callback
     */
    this.get = function(userObject, callback) {
        callback(userObject);
    };
};

util.inherits(UserData, ApiClass);
module.exports = UserData;