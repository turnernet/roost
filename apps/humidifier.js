var deviceManager = require("../devices/DeviceManager");
var events = require("events");
var util = require("util");
var appBase = require("./app");

var Humidifier = function Humidifier(app){
    "use strict";
	//events.EventEmitter.call(this);  // inherit EventEmitter
	appBase.call(this);
	
	this.app = app;
    console.log("Humidifier app started");
	this.device=app.devicekey;
		
	this.isActive = function(){
		return	deviceManager.isDeviceOn(this.device);
	};

	this.setActive = function(on){
		return deviceManager.setDeviceOn(this.device,on);
	};

	this.getRequest = function(params){
		console.log("Humidifier.getRequest ");
		return {"enabled":this.isActive()};
	};
	
	this.postRequest = function(body){
		var enabled = body.enabled
		if(enabled !== undefined){
			console.log("Setting Humidifier: " + enabled);
			this.setActive(enabled);
		}
		return "ok";
	};
	
	deviceManager.onDeviceEvent(app.devicekey,"device-state", function(state){
		console.log("humidiferOnDeviceEvent",state);
		this.emit("humidifierState",state);
	}.bind(this));
	
	this.setActive(false);
};
//util.inherits(Humidifier, events.EventEmitter);
util.inherits(Humidifier, appBase);
module.exports = Humidifier;

