var logger = require("./logger");
var async = require('async');
var deviceManager = require('../devices/DeviceManager');
var appManager = require('../apps/AppManager');
var notifications = require('./notifications');
var datastore = require('../datastore/datastore');

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
		datastore.TempReading.create([
		{
			timeStamp : device.updateTime,
			label : device.name,
			value : device.value
		}
		], function (err, items) {
			if(err){
				console.log(err);
			}
	// err - description of the error or null
	// items - array of inserted items
	// Pass back both err and address at this point.
	});
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
        var str = "code=status";		
		for(var prop in result) {
			if(result.hasOwnProperty(prop)){
				str = str+ " " + prop +"="+result[prop];
			}
		}				
		console.log(str);
        logger.send(str);
    }.bind(this);

    this.timerhigh = setInterval(this.timerCallback, 1000 * 60 * 1);
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