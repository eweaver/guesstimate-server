var util = require('util'),
    ApiResponse = require('./ApiResponse');

/**
 * Take in any type of data and format it to a comment API success
 * response.
 *
 * @param {*} data
 * @constructor
 */
var ApiSuccess = function(data) {
    var _responseData = {
        success: true,
        response: null
    };

    if(data instanceof Array) {
        _responseData.response = { data: data};
    }
    else if(typeof data === 'object') {
         if(typeof data.success !== 'undefined') {
             delete data.success;
         }

         _responseData.response = data;
    } else {
        // Scalar
        _responseData.response = { result: data };
    }

    /**
     * Get the formatted API success response.
     *
     * @return {Object}
     */
    this.getData = function() {
        return _responseData;
    };

    /**
     * Return the response code for the error.
     *
     * @return {Number}
     */
    this.getResponseCode = function() {
        return 200;
    }
};

util.inherits(ApiSuccess, ApiResponse);
module.exports = ApiSuccess;