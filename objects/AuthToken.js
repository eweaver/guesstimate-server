var config = require('../etc/implementations');

/**
 * Interface to the underlying User store implementation.
 *
 * @constructor
 */
var AuthToken = function() {

    /**
     * Implementation class name.
     *
     * @type {String}
     * @private
     */
    var _implementation = require('./implementations/' + config.AuthToken.implementation);

    /**
     * Configuration to pass in to the implementation class.
     *
     * @type {Object}
     * @private
     */
    var _implementationConfig = config.AuthToken.config;

    /**
     * Implementation class to forward User requests to.
     *
     * @type {implementation}
     * @private
     */
    var _implClass = new _implementation(_implementationConfig);

    /**
     * Create a new User.  Throws an error if the User object has already been initialized.
     * Returns User object in callback.
     *
     * @param {String} id
     * @param {Function<error, User>} callback
     * @throws Error
     */
    this.create = function(id, callback) {
        return _implClass.create(id, callback);
    };

    /**
     * Check if a user identifier already exists.
     *
     * @param {String} token
     * @param {Function<error, Boolean>} callback
     */
    this.load = function(token, callback) {
        return _implClass.load(token, callback);
    };
};

module.exports = AuthToken;