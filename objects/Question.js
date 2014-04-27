var config = require('../etc/implementations');

/**
 * Interface to the underlying User store implementation.
 *
 * @constructor
 */
var Question = function() {

    /**
     * Implementation class name.
     *
     * @type {String}
     * @private
     */
    var _implementation = require('./implementations/' + config.Question.implementation);

    /**
     * Configuration to pass in to the implementation class.
     *
     * @type {Object}
     * @private
     */
    var _implementationConfig = config.Question.config;

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
     * @param {String} categoryId
     * @param {String} id
     * @param {Function<error, Object>} callback
     * @throws Error
     */
    this.load = function(categoryId, id, callback) {
        return _implClass.load(categoryId, id, callback);
    };

    /**
     * Get all categories
     *
     * @param {String} categoryId
     * @param {Function<error, Array>} callback
     * @throws Error
     */
    this.loadAll = function(categoryId, callback) {
        return _implClass.loadAll(categoryId, callback);
    };
};

module.exports = Question;