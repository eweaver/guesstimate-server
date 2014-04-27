var AuthToken = require('../objects/AuthToken'),
    User = require('../objects/User');
/**
 * Class responsible for authenticating requests.
 *
 * @constructor
 */
var Authentication = function(config) {
    // private constants
    var AUTH_HEADER = 'x-auth-header';
    var AUTH_PARAM = '_authHeader';

    var _config = config;

    /**
     * Authenticate a request object.
     *
     * @param {httpServer.Request} request
     * @param {Function} callback
     * @return {Boolean}
     */
    this.authenticate = function(request, callback) {
        var token = typeof request.headers[AUTH_HEADER] !== 'undefined'
                          ? request.headers[AUTH_HEADER]
                          : (_config.devMode === true && typeof request.query[AUTH_PARAM] !== 'undefined'
                              ? request.query[AUTH_PARAM]
                              : null
                            );
        if(token !== null) {
            var authToken = new AuthToken();
            authToken.load(token, function(err, identifier) {
                if(err !== null) {
                    callback(err, {sucess: false});
                    return;
                }

                if(identifier === null) {
                    callback({error:{message:"Auth token invalid or expired."}});
                    return;
                }


                var user = new User();
                user.init(identifier, function(err, userObject){
                    if(err !== null) {
                        callback(err, {success: false});
                        return;
                    }

                    callback(null, userObject);
                });
            });
        } else {
            callback({success: false, error: {message: "No auth token available."}}, null);
        }
    };
};

module.exports = Authentication;