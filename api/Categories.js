var util = require('util'),
    ApiClass = require('./ApiClass'),
    Category = require('../objects/Category');

/**
 * Handle the registration of a new user.
 *
 * @constructor
 */
var Categories = function() {

    /**
     * Retrieve a list of categories.
     *
     * @param {userObject} userObject
     * @param {Function<error, Array>} callback
     */
    this.get = function(userObject, callback) {
        var category = new Category();

        category.loadAll(function(err, categories) {
            if(err !== null) {
                callback(err);
                return;
            }

            callback(null, categories);
        });
    };
};

util.inherits(Categories, ApiClass);
module.exports = Categories;