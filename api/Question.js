var util = require('util'),
    ApiClass = require('./ApiClass'),
    Question = require('../objects/Question');

/**
 * Handle the registration of a new user.
 *
 * RENAME QUESTION-API
 *
 * @constructor
 */
var QuestionList = function() {

    /**
     * Retrieve a single question
     *
     * @param {userObject} userObject
     * @param {String} categoryId
     * @param {String} id
     * @param {Function<error, Object>} callback
     */
    this.get = function(userObject, categoryId, id, callback) {
        var question = new Question();

        question.load(categoryId, id, function(err, question) {
            if(err !== null) {
                callback(err);
                return;
            }

            callback(null, question);
        });
    };
};

util.inherits(QuestionList, ApiClass);
module.exports = QuestionList;