var config = require('../etc/implementations');

/**
 * Interface to the underlying User store implementation.
 *
 * @constructor
 */
var User = function(id) {

    /**
     * Implementation class name.
     *
     * @type {String}
     * @private
     */
    var _implementation = require('./implementations/' + config.User.implementation);

    /**
     * Configuration to pass in to the implementation class.
     *
     * @type {Object}
     * @private
     */
    var _implementationConfig = config.User.config;

    /**
     * Implementation class to forward User requests to.
     *
     * @type {implementation}
     * @private
     */
    var _implClass = new _implementation(_implementationConfig, id);

    /**
     * Create a new User.  Throws an error if the User object has already been initialized.
     * Returns User object in callback.
     *
     * @param {String} id
     * @param {String} name
     * @param {String} password
     * @param {Function<error, User>} callback
     * @throws Error
     */
    this.create = function(id, name, password, callback) {
        return _implClass.create(id, name, password, callback);
    };

    /**
     * Check if a user identifier already exists.
     *
     * @param {String} id
     * @param {Function<error, Boolean>} callback
     */
    this.exists = function(id, callback) {
        return _implClass.exists(id, callback);
    };

    /**
     * Initialize the User.
     *
     * @param {String} id
     * @param {Function} callback
     */
    this.init = function(id, callback) {
        return _implClass.init(id, callback);
    };

    /**
     * Return user's identifier.
     *
     * @return {String}
     */
    this.getId = function() {
        return _implClass.getId();
    };

    /**
     * Return user's name.  Requires User.init to be called.
     *
     * @return {String}
     * @throws Error
     */
    this.getName = function() {
        return _implClass.getName();
    };

    /**
     * Return user's password hash.  Requires User.init to be called.
     *
     * @return {String}
     * @throws Error
     */
    this.getPasswordHash = function() {
        return _implClass.getPasswordHash();
    };
};

module.exports = User;