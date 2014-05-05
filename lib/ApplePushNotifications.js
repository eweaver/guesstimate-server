var apn = require('apn'),
    config = require('../etc/config');

/**
 * Push notifications
 *
 * @constructor
 */
var ApplePushNotifications = function() {
    process.env.certDir = process.cwd()
    var _cert = process.env.certDir + '/files/' + config.push.apple[ config.push.apple.mode ].cert;
    var _key = process.env.certDir + '/files/' + config.push.apple[ config.push.apple.mode ].key;

    var _apnConnection = new apn.Connection({
        cert: _cert,
        key: _key,
        production: (config.push.apple.mode === 'production') ? true : false
    });

    /**
     * Send a push notification to an ios device
     *
     * @param {String} deviceToken
     * @param {String} message
     * @param {Object} payload
     * @param {Function} callback
     */
    this.send = function(deviceToken, message, payload, callback) {
        var apnDevice = new apn.Device(deviceToken);
        var note = new apn.Notification();

        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 1;
        note.alert = message;
        note.payload = payload;

        _apnConnection.pushNotification(note, apnDevice);
        callback();
    };
};

module.exports = ApplePushNotifications;