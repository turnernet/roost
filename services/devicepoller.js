var logger = require("./logger");
var async = require('async');
var deviceManager = require('../devices/DeviceManager');
var appManager = require('../apps/AppManager');
var notifications = require('./notifications')

var DevicePoller = function DevicePoller() {
    "use strict";
	
	notifications.on("clientConnected",function(clientSocket){
		var statusObj = appManager.appGetAppsStatus();
		notifications.send("connected",statusObj);
	})

    appManager.onAppEvent("motion", "motionDetectChange", function (value) {
        console.log("DevicePoller motionDetectChange " + value);
       // var str = "code=motionDetectChange sourcetype=app app=MotionDetector state=" + value;
        //logger.send(str);
		notifications.send("motionUpdate",JSON.stringify(appManager.appGetRequest("motion")));
    });
	
	 appManager.onAppEvent("hvac", "temperatureRead", function (device) {
		console.log("DevicePoller hvac temperatureRead " + device.name + " " + device.value);
		notifications.send("temperatureUpdate",JSON.stringify(device));
		});
		
	appManager.onAppEvent("garage","garageDoorState", function(state){
		console.log("DevicePoller garage garageDoorState " + state);
		notifications.send("garageDoorUpdate",JSON.stringify(appManager.appGetRequest("garage")));
	});
		
	appManager.onAppEvent("hvac","hvacState", function(state){
		console.log("DevicePoller hvac hvacState " + state);
		notifications.send("hvacUpdate",JSON.stringify(appManager.appGetRequest("hvac")));
	});
		
	appManager.onAppEvent("humidifier","humidifierState",function(state){
		console.log("DevicePoller humidifier humidifierState " + state);
		notifications.send("humidifierUpdate",JSON.stringify(appManager.appGetRequest("humidifier")));
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