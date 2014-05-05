var util = require('util'),
    async = require('async'),
    ApiClass = require('./ApiClass'),
    Game = require('../objects/Game'),
    User = require('../objects/User'),
    Question = require('../objects/Question'),
    PushNotifications = require('../lib/PushNotifications');

/**
 * Send an answer
 *
 * @constructor
 */
var Answer = function() {

    /**
     * Register a new user account.
     *
     * @param {null} userObject
     * @param {String} gameId
     * @param {String} answer
     * @param {Function<error, Object>} callback
     */
    this.get = function(userObject, gameId, answer, callback) {
        answer = answer.toString();
        var game = new Game();
        game.recordAnswer(gameId, userObject.getId(), answer, function(err) {
            if(err !== null) {
                callback(err);
                return;
            }

            game.getScores(gameId, function(err, scoresData){
                if(game.isComplete(scoresData)) {
                    game.getGameData(gameId, function(err, gameData) {
                        if(err !== null) {
                            callback(err);
                            return;
                        }

                        var question = new Question();
                        question.load(gameData.categoryId, gameData.questionId, function(err, questionData){
                            if(err !== null) {
                                callback(err);
                                return;
                            }

                            var answer = parseFloat(questionData.answer);
                            var winner = game.calculateWinner(answer, scoresData);
                            var returnData = {
                                scores: scoresData,
                                winner: winner,
                                answer: answer
                            };

                            var users = [];
                            for(var id in scoresData) {
                                if(scoresData.hasOwnProperty(id)) {
                                    users.push(id);
                                }
                            }

                            var pushNotifications = new PushNotifications();
                            var message = 'All answers are in, who won?';
                            var payload = {gameId: gameId, answer:answer, winner:winner, scores:scoresData, type:"gameComplete"};
                            async.each(users, function(userIdentifier, aCallback) {
                                    var user = new User();
                                    user.init(userIdentifier, function(err, userObject) {
                                        user.getPushTokens(function(err, devices) {
                                            if(devices !== null) {
                                                pushNotifications.send(devices, message, payload, function(){});
                                            }
                                            aCallback();
                                        });
                                    });

                                },
                                function(err) {
                                    if(err === null || typeof err === 'undefined') {
                                        callback(null, returnData);
                                    } else {
                                        callback(err);
                                    }
                                });
                        });
                    });
                } else {
                    callback(err);
                }
            });
        });
    };
};

util.inherits(Answer, ApiClass);
module.exports = Answer;