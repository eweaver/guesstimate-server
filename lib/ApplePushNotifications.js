var apn = require('apn'),
    config = require('../etc/config');

/**
 * Push notifications
 *
 * @constructor
 */
var ApplePushNotifications = function() {
    var _cert = config.push.apple[ config.push.apple.mode ].cert;
    var _key = config.push.apple[ config.push.apple.mode ].key;
    var _apnConnection = new apn.Connection({
        cert: _cert,
        key: _key,
        production: (config.push.apple.mode === 'production') ? true : false
    });

    /**
     *
     * @param {String} device
     * @param {String} message
     * @param {Object} payload
     * @param {Function} callback
     */
    this.send = function(device, message, payload, callback) {
        var note = new apn.Notification();

        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 3;
        note.alert = message;
        note.payload = payload;

        console.log(_apnConnection.pushNotification(note, device));
        callback();
    };
};

module.exports = ApplePushNotifications;