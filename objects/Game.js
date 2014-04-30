var config = require('../etc/implementations');

/**
 * Interface to the underlying Game store implementation.
 *
 * @constructor
 */
var Game = function() {

    /**
     * Implementation class name.
     *
     * @type {String}
     * @private
     */
    var _implementation = require('./implementations/' + config.Game.implementation);

    /**
     * Configuration to pass in to the implementation class.
     *
     * @type {Object}
     * @private
     */
    var _implementationConfig = config.Game.config;

    /**
     * Implementation class to forward User requests to.
     *
     * @type {implementation}
     * @private
     */
    var _implClass = new _implementation(_implementationConfig);

    /**
     * Create a new game
     *
     * @param {String} categoryId
     * @param {String} questionId
     * @param {String} identifier
     * @param {Function<error, Object>} callback
     */
    this.create = function(categoryId, questionId, identifier, callback) {
        return _implClass.create(categoryId, questionId, identifier, callback);
    };
};

module.exports = Game;