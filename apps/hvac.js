var deviceManager = require("../devices/DeviceManager");
var util = require("util");
var appBase = require("./app");
var hvacHeatController = require("./hvacHeatController");

var FANHIGH="fanHigh";
var FANLOW="fanLow";
var HEAT="heatOn";

var HVAC = function HVAC(app){
    'use strict';
	appBase.call(this);
	this.app = app;

	this.fanLowDevice= app.fanLowDeviceKey;
	this.fanHighDevice=app.fanHighDeviceKey;
	this.heatDevice=app.heatDeviceKey;
	
	this.hvacHeatController = new hvacHeatController();
	
	console.log("HVAC app started: "+this.fanLowDevice);
	
	this.hvacHeatController.setHeatControlFunction( function (on){
		console.log("HVAC furnaceControl set to " + on);
		deviceManager.setDeviceOn(this.heatDevice,on);	
	}.bind(this));;
	

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
			console.log("is device.value: " + device.value + " a number: " + !isNaN(device.value));
			
			
			var hvacRules = device.hvacRules;
			if(hvacRules != undefined && hvacRules.occupied 
				&& hvacRules.occupied.heatOnPoint && hvacRules.occupied.heatOffPoint){			
					if(isNaN(device.value) || device.value == 85){
						console.log("Bad temperature");
						this.hvacHeatController.noCallForHeat(device);
					}
					else if(device.value <= hvacRules.occupied.heatOnPoint){
						this.hvacHeatController.callForHeat(device);
					}
					else if (device.value >= hvacRules.occupied.heatOffPoint){
						this.hvacHeatController.noCallForHeat(device);
					}
					else {
						console.log(device.name + " " + hvacRules.occupied.heatOnPoint + " < " + device.value
						+ " < " + hvacRules.occupied.heatOffPoint);
					}
			}
			else{
				console.log("No hvacRules for " + device.name);
			}
			this.emit("temperatureRead",device);
		}.bind(this));
	}	
	deviceManager.onDeviceEvent(FANHIGH,"device-state",function(state){
		console.log("deviceManager fanHigh event: ",state);
		this.emit("hvacState",state);
	}.bind(this));
	
	deviceManager.onDeviceEvent(HEAT,"device-state",function(state){
		console.log("deviceManager heat event: ",state);
		this.emit("hvacState",state);
	}.bind(this));
};

util.inherits(HVAC, appBase);
module.exports = HVAC;
