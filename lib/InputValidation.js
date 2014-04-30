/**
 * Class for validating inputs of different types.  Passed in profile
 * equates to a route's parameters.
 *
 * Rules:
 *  string
 *      - notempty: true|false (for use when no min/max length is desired)
 *      - minlen: integer
 *      - maxlen: integer
 *
 *
 * @constructor
 */
var InputValidation = function() {
    var KEY_TYPE = "type";

    var TYPE_STRING = "string";
    var RULE_NOT_EMPTY = "notempty";
    var RULE_MIN_LENGTH = "minlen";
    var RULE_MAX_LENGTH = "maxlen";

    /**
     * Validation a request profile.
     *
     * @param {Object} profile
     * @param {Object} params
     */
    this.validateProfile = function(profile, params) {
        var errors = [];
console.log(params);
        for(var paramName in profile) {
            if(profile.hasOwnProperty(paramName)) {
                var paramProfile = profile[paramName];

                switch(paramProfile[KEY_TYPE]) {
                    case TYPE_STRING:
                        errors = errors.concat(validateString(paramProfile, paramName, params[paramName]));
                        break;
                }
            }
        }

        if(errors.length > 0) {
            throw new Error("Validation Errors: [" + errors.join(',') + "]");
        }
    };

    /**
     * Validate a string parameter
     *
     * @param {Object} paramProfile
     * @param {String} paramName
     * @param {String} param
     * @returns {Array}
     */
    var validateString = function(paramProfile, paramName, param) {
        var errors = [];

        for(var ruleType in paramProfile) {
            if(paramProfile.hasOwnProperty(ruleType)) {
                switch(ruleType) {
                    case RULE_NOT_EMPTY:
                        if(param.length < 1) {
                            errors.push(paramName + ' cannot be empty');
                        }
                        break;
                    case RULE_MIN_LENGTH:
                        if(param.length < paramProfile[ruleType]) {
                            errors.push(paramName + ' cannot be shorter than ' + paramProfile[ruleType] + ' characters');
                        }
                        break;
                    case RULE_MAX_LENGTH:
                        if(param.length > paramProfile[ruleType]) {
                            errors.push(paramName + ' cannot be longer than ' + paramProfile[ruleType] + ' characters');
                        }
                        break;
                }
            }
        }

        return errors;
    };

    /**
     * "name": {
                    "type": "string",
                    "minlen": 4,
                    "maxlen": 40
                },
     "identifier": "string",
     "password": {
                    "type": "string",
                    "minlen": 8,
                    "maxlen": 40
                }
     */
};

module.exports = InputValidation;