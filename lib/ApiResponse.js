/**
 * Base API response class.
 *
 * @constructor
 */
var ApiResponse = function() {
    /**
     * Get the formatted API error response.
     *
     * @return {Object}
     */
    this.getData = function() {
        throw new Error('Child class must implement getData()!');
    };

    /**
     * Return the response code for the error.
     *
     * @return {Number}
     */
    this.getResponseCode = function() {
        throw new Error('Child class must implement getResponseCode()!');
    };
};

module.exports = ApiResponse;