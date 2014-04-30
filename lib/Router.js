var Authentication = require('./Authentication'),
    ApiError = require('./ApiError'),
    ApiSuccess = require('./ApiSuccess'),
    InputValidation = require('./InputValidation'),
    validation = new InputValidation();

/**
 * Provide the mechanism for routing request to the correct api classes.
 *
 * See routes.js for more information on available routes.
 *
 * @param {Object} routes
 * @param {Object} appConfig
 * @constructor
 */
var Router = function(routes, appConfig) {
    //private constants
    var PRIVATE_ROUTE = 'private';
    var PUBLIC_ROUTE = 'public';

    var _this = this;
    var _routes = routes;
    var _appConfig = appConfig;
    var _apis = {};
    var _auth = new Authentication(appConfig);

    /**
     * Decorate an express httpServer with the available routes.
     *
     * @param {httpServer} app
     * @return httpServer
     */
    this.setRoutes = function(app) {
        for(var route in _routes) {
            if(_routes.hasOwnProperty(route)) {
                // Prevent dev routes from being loaded
                if(_routes[route].devOnly === true && _appConfig.devMode === false) {
                    continue;
                }

                app[_routes[route].method]('/' + route, function(req, res) {
                    var routeInfo = req.route.path.substr(1);
                    routeInfo = _routes[routeInfo];
                    _this.handle(req, routeInfo, function(err, data) {
                        if(err !== null) {
                            var response = new ApiError(err);
                        } else {
                            var response = new ApiSuccess(data);
                        }

                        sendContent(res, response.getData(), response.getResponseCode());
                    });
                });
            }
        }

        return app;
    };

    /**
     * Handle an API request.
     *
     * @param {httpServer.Request} request
     * @param {Object} routeInfo
     * @param {Function<error, data>} callback
     * @throws Error
     */
    this.handle = function(request, routeInfo, callback) {
        authRequest(routeInfo.type, request, function(err, authStatus, userObject) {
            if(authStatus === true) {
                var api = loadApi(routeInfo.file);

                if(typeof api[routeInfo.method] !== typeof Function) {
                    throw new Error('Invalid Api endpoint.', 11);
                };

                var paramList = routeInfo.method === 'get' ? request.query : request.params;
                var args = [userObject];

                try {
                    var apiArgs = getParams(paramList, routeInfo.params);
                    validation.validateProfile(routeInfo.params.required, paramList);
                    args = args.concat(apiArgs);
                } catch(err) {
                    callback(err);
                    return;
                }

                // If we don't have an explicit sync request set, push the callback onto the arg array.
                if(routeInfo.sync !== true) {
                    args.push(callback);
                    api[routeInfo.method].apply(null, args);
                } else {
                    callback(null, api[routeInfo.method].apply(null, args));
                }
            } else {
                callback(err);
            }
        });
    };

    var authRequest = function(type, request, callback) {
        if(type === PRIVATE_ROUTE) {
            _auth.authenticate(request, function(err, userObject) {
                if(err !== null) {
                    // AuthStatus, UserObject
                    callback(err, false, null);
                } else {
                    callback(null, true, userObject);
                }
            });


        } else {
            // Error, AuthStatus, UserObject
            callback(null, true, null);
        }
    }

    /**
     * Load an API class.
     *
     * @param {String} apiName
     * @return {ApiClass}
     */
    var loadApi = function(apiName) {
        if(typeof _apis[apiName] === 'undefined') {
            _apis[apiName] = new (require('../api/' + apiName))();
        }

        return _apis[apiName];
    };

    /**
     * Return an array of parameter values, in the order defined by
     * params.required, followed by params.optional.
     *
     * @param {Object} paramList
     * @param {Object} paramsConfig
     * @return {Array}
     */
    var getParams = function(paramList, paramsConfig) {
        var params = [];

        // Handle required params; missing required params throw an Error
        if(typeof paramsConfig.required !== 'undefined') {
            for(var p in paramsConfig.required) {
                if(paramsConfig.required.hasOwnProperty(p)) {
                    if(typeof paramList[p] === 'undefined') {
                        throw new Error('Missing parameter: ' + p, 20);
                    } else {
                        // Add input type checking
                        params.push(paramList[p]);
                    }
                }
            }
        }

        // Handle optional params; missing optional params become null
        if(typeof paramsConfig.optional !== 'undefined') {
            for(var p in paramsConfig.optional) {
                if(paramsConfig.optional.hasOwnProperty(p)) {
                    if(typeof paramList[p] === 'undefined') {
                        params.push(null);
                    } else {
                        // Add input type checking
                        params.push(paramList[p]);
                    }
                }
            }
        }

        return params;
    };

    /**
     * Internal method for sending back response data.
     *
     * @param {httpServer.response} res
     * @param {Object} object
     * @param {Number} statusCode
     */
    var sendContent = function(res, object, statusCode) {
        res.send(object);
    };
};

module.exports = Router;
