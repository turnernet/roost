var deviceManager = require("../devices/DeviceManager");
var util = require("util");
var appBase = require("./app");

var FANHIGH="fanHigh";
var FANLOW="fanLow";
var HEAT="heat";

var HVAC = function HVAC(app){
    'use strict';
	appBase.call(this);
	this.app = app;

	this.fanLowDevice= app.fanLowDeviceKey;
	this.fanHighDevice=app.fanHighDeviceKey;
	this.heatDevice=app.heatDeviceKey;
	
	console.log("HVAC app started: "+this.fanLowDevice);

	this.getRequest = function(params){
		console.log("HVAC.getRequest");
	
		var result={};
		result[FANLOW]=deviceManager.isDeviceOn(this.fanLowDevice); 
		result[FANHIGH]=deviceManager.isDeviceOn(this.fanHighDevice);
		result[HEAT]=deviceManager.isDeviceOn(this.heatDevice);
		
		var temperatures={}
		for(var key in app.temperatureDeviceKeys){
			temperatures[app.temperatureDeviceKeys[key]]=deviceManager.getDevice(app.temperatureDeviceKeys[key]).device;
		}	
		result["currentTemperatures"]=temperatures;
		return result;
	};
	
	this.postRequest = function(body){
		console.log("HVAC.postRequest " +  JSON.stringify(body))	;		
        var on;
		if(body[FANLOW] !== undefined){
			on = body[FANLOW];
			console.log("HVAC: post Request Low speed fan: "+ on);
			deviceManager.setDeviceOn(this.fanLowDevice,on);
		}
		else if(body[FANHIGH] !== undefined){
			on = body[FANHIGH];
			console.log("HVAC: post Request High speed fan: "+ on);
			deviceManager.setDeviceOn(this.fanHighDevice,on);
		} 
		return "ok";
	};
	
	for(var key in app.temperatureDeviceKeys){
		deviceManager.onDeviceEvent(app.temperatureDeviceKeys[key],"device-value", function(device){
			console.log("hvac rx "+ device.name+" device-value " + device.value + " " + device.updateTime);
			this.emit("temperatureRead",device);
		}.bind(this));
	}	
	deviceManager.onDeviceEvent(FANHIGH,"device-state",function(state){
		console.log("deviceManager fanHigh event: ",state);
		this.emit("hvacState",state);
	}.bind(this));
};

util.inherits(HVAC, appBase);
module.exports = HVAC;
