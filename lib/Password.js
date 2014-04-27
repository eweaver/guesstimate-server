var bcrypt = require('bcrypt');

/**
 * Password manager.  Aids in generating a checking hashed passwords.
 *
 * @constructor
 */
var Password = function() {

    /**
     * Hash a password
     *
     * @param {String} password
     * @param {Function<error, String>} callback
     */
    this.generate = function(password, callback) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                if(err !== null && typeof error !== 'undefined') {
                    callback(err, hash);
                } else {
                    callback(null, hash);
                }
            });
        });
    };

    /**
     * Check an entered password.
     *
     * @param {String} password User entered password
     * @param {String} hash Stored password
     * @param {Function<error, Boolean>} callback
     */
    this.check = function(password, hash, callback) {
        bcrypt.compare(password, hash, function(err, res) {
            if(err !== null && typeof err !== 'undefined') {
                callback(err, res);
            } else {
                callback(null, res);
            }
        });
    };
};

module.exports = Password;