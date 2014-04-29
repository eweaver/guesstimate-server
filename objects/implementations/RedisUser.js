var createRedisClient = require('../../lib/RedisClient');

/**
 * Represents a single User object.  Contains three properties.
 *
 * id               Unique identifier
 * name             User's name
 * passwordHash     Hashed password
 *
 * @param {redis} redisClient
 * @param {String|null} id
 * @constructor
 */
var RedisUser = function(redisConfig, id) {
    var _redisClient = createRedisClient(redisConfig);
    var _passwordManager = new (require('../../lib/Password'))();
    var _isLoaded = false;
    var _this = this;

    // Private variables to be loaded from the redis store.
    var _id = typeof id !== 'undefined' ? id : null;
    var _name = null;
    var _passwordHash = null;

    /**
     * Create a new User.  Throws an error if the User object has already been initialized.
     * Returns User object in callback.
     *
     * @param {String} id
     * @param {String} name
     * @param {String} password
     * @param {Function<error, User>} callback
     * @throws Error
     */
    this.create = function(id, name, password, callback) {
        if(_isLoaded === true) {
            throw new Error('Cannot create user, user already initialized.', 2);
        }

        _passwordManager.generate(password, function(err, hashedPassword){
            if(err !== null) {
                callback(err);
                return;
            }

            _id = id;
            _name = name;
            _passwordHash = hashedPassword;

            _redisClient.hset(id, 'n', name);
            _redisClient.hset(id, 'p', _passwordHash);
            _redisClient.expire(id, 86400);

            callback(null, _this);
        });
    };

    /**
     * Check if a user identifier already exists.
     *
     * @param {String} id
     * @param {Function<error, Boolean>} callback
     */
    this.exists = function(id, callback) {
        _redisClient.exists(id, function(err, doesKeyExist) {
            callback(err, doesKeyExist == 1);
        });
    };

    /**
     * Initialize the User.
     *
     * @param {String} id
     * @param {Function} callback
     */
    this.init = function(id, callback) {
        console.log(id);
        _redisClient.hgetall(id, function(err, userObject) {
            console.log(userObject);
            if(err === null) {
                _isLoaded = true;
                _id = id;
                _name = userObject.n;
                _passwordHash = userObject.p;
            }

            callback(err, userObject);
        });
    };

    /**
     * Return user's identifier.
     *
     * @return {String}
     */
    this.getId = function() {
        return _id;
    };

    /**
     * Return user's name.  Requires User.init to be called.
     *
     * @return {String}
     * @throws Error
     */
    this.getName = function() {
        if(_isLoaded === false) {
            throw new Error('User not loaded!', 1);
        }

        return _name;
    };

    /**
     * Return user's password hash.  Requires User.init to be called.
     *
     * @return {String}
     * @throws Error
     */
    this.getPasswordHash = function() {
        if(_isLoaded === false) {
            throw new Error('User not loaded!', 1);
        }

        return _passwordHash;
    };
};

module.exports = RedisUser;