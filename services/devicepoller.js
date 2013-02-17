var logger = require("./logger");
var async = require('async');
var deviceManager = require('../devices/DeviceManager');
var appManager = require('../apps/AppManager');

var DevicePoller = function DevicePoller() {
    "use strict";

    appManager.onAppEvent("motion", "motionDetectChange", function (value) {
        console.log("DevicePoller motionDetectChange " + value);
        var str = "code=motionDetectChange sourcetype=app app=MotionDetector state=" + value;
        logger.send(str);
    });

    this.timerCallback = function () {
        console.log("DevicePoller.timerHigh");
        var result = deviceManager.readAll();
        console.log(result);
        var str = "code=status sourcetype=device";

        for (var i = 0; i < result.length; i++) {
            str = str + ", " + i + "=" + result[i];
        }
        logger.send(str);
    }.bind(this);

    this.timerhigh = setInterval(this.timerCallback, 1000 * 60 * 5);
};
DevicePoller.instance = null;
DevicePoller.getInstance = function () {
    console.log("DevicePoller getInstance called");
    if (this.instance === null) {
        this.instance = new DevicePoller();
    }
    return this.instance;
};

module.exports = DevicePoller.getInstance();