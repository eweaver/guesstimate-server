var util = require('util'),
    ApiResponse = require('./ApiResponse');

/**
 * Take in any type of data and format it to a comment API error
 * response.
 *
 * @param {*} data
 * @constructor
 */
var ApiError = function(data) {
    var _errorData = {
        success: false,
        error: null
    };

    var _errorCode = 500;

    if(data instanceof Error) {
        _errorData.error = {
            message: data.message
        };

        _errorCode = typeof data.code !== 'undefined' ? data.code : _errorCode;
    } else if(typeof data === 'undefined') {
        _errorData.error = {
            message: "Unknown error."
        };
    } else if(typeof data === 'string') {
        _errorData.error = {
            message: data
        };
    } else if(typeof data === 'object' && typeof data.error === 'string') {
        _errorData.error = {
            message: data.message
        };
    } else if(typeof data === 'object' && typeof data.error === 'object') {
        if(typeof data.code !== 'undefined') {
            _errorCode = typeof data.code !== 'undefined' ? data.code : _errorCode;
            delete data.code;
        }

        _errorData = data;
        _errorData.success = false;
    } else {
        _errorData.error = data;
    }

    /**
     * Get the formatted API error response.
     *
     * @return {Object}
     */
    this.getData = function() {
        return _errorData;
    };

    /**
     * Return the response code for the error.
     *
     * @return {Number}
     */
    this.getResponseCode = function() {
        return _errorCode;
    }
};

util.inherits(ApiError, ApiResponse);
module.exports = ApiError;