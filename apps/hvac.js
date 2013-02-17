var deviceManager = require("../devices/DeviceManager");


var FANHIGH="fanHigh";
var FANLOW="fanLow";
var HEAT="heat";
var HVAC = function HVAC(app){
    'use strict';
	this.app = app;

	this.fanLowDevice= app.fanLowDeviceKey;
	this.fanHighDevice=app.fanHighDeviceKey;
	this.heatDevice=app.heatDeviceKey;
	
	console.log("HVAC app started: "+this.fanLowDevice);

	this.getRequest = function(params){
		console.log("HVAC.getRequest");
	
		var result={};
		result[FANHIGH]=deviceManager.isDeviceOn(this.fanLowDevice); 
		result[FANLOW]=deviceManager.isDeviceOn(this.fanHighDevice);
		result[HEAT]=deviceManager.isDeviceOn(this.heatDevice);
		return result;
	};
	
	this.putRequest = function(body){
		console.log("HVAC.putRequest " +  JSON.stringify(body))	;		
        var on;
		if(body[FANLOW] !== undefined){
			on = body[FANLOW];
			console.log("HVAC: Put Request Low speed fan: "+ on);
			deviceManager.setDeviceOn(this.fanLowDevice,on);
		}
		else if(body[FANHIGH] !== undefined){
			on = body[FANHIGH];
			console.log("HVAC: Put Request High speed fan: "+ on);
			deviceManager.setDeviceOn(this.fanHighDevice,on);
		} 
		return "ok";
	};
};

module.exports = HVAC;

