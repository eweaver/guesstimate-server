var util = require('util'),
    ApiClass = require('./ApiClass'),
    Question = require('../objects/Question');

/**
 * Handle the registration of a new user.
 *
 * @constructor
 */
var QuestionList = function() {

    /**
     * Retrieve a list of categories.
     *
     * @param {userObject} userObject
     * @param {String} categoryId
     * @param {Function<error, Object>} callback
     */
    this.get = function(userObject, categoryId, callback) {
        var question = new Question();

        question.loadAll(categoryId, function(err, questions) {
            if(err !== null) {
                callback(err);
                return;
            }

            callback(null, questions);
        });
    };
};

util.inherits(QuestionList, ApiClass);
module.exports = QuestionList;