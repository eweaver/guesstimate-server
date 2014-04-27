var config = require('../etc/implementations');

/**
 * Interface to the underlying User store implementation.
 *
 * @constructor
 */
var Category = function() {

    /**
     * Implementation class name.
     *
     * @type {String}
     * @private
     */
    var _implementation = require('./implementations/' + config.Category.implementation);

    /**
     * Configuration to pass in to the implementation class.
     *
     * @type {Object}
     * @private
     */
    var _implementationConfig = config.Category.config;

    /**
     * Implementation class to forward User requests to.
     *
     * @type {implementation}
     * @private
     */
    var _implClass = new _implementation(_implementationConfig);

    /**
     * Get a single category by id
     *
     * @param {String} id
     * @param {Function<error, Object>} callback
     * @throws Error
     */
    this.load = function(id, callback) {
        return _implClass.load(id, callback);
    };

    /**
     * Get all categories
     *
     * @param {Function<error, Array>} callback
     * @throws Error
     */
    this.loadAll = function(callback) {
        return _implClass.loadAll(callback);
    };
};

module.exports = Category;