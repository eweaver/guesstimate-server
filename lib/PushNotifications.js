var ApplePushNotifications = require('./ApplePushNotifications');

/**
 * Wrapper around different push notification implementations.
 *
 * @constructor
 */
var PushNotifications = function() {
    var apn = new ApplePushNotifications();

    /**
     * Send push notifications to devices
     *
     * @param {Array} devices
     * @param {String} message
     * @param {Object} payload
     * @param {Function} callback
     */
    this.send = function(devices, message, payload, callback) {
        // TODO: update this to use async
        for(var deviceId in devices) {
            if(! devices.hasOwnProperty(deviceId)) {
                continue;
            }

            var deviceType = devices[deviceId];

            switch(deviceType) {
                case "iphone":
                    apn.send(deviceId, message, payload, callback);
                    break;
            }
        }
    };
};

module.exports = PushNotifications;