var deviceManager = require("../devices/DeviceManager");

var GarageDoor = function GarageDoor(app){
    "use strict";
    console.log("GarageDoor app started device: " +app.device);
	this.app = app;
	this.device=app.devicekey;
	this._openTimer=null;
	this.isOpen = function(){
		return	deviceManager.isDeviceOn(this.device);
	};

    this.controlDoor = function(open){
		return deviceManager.setDeviceOn("Garage Door Control",open);
	};

	this.getRequest = function(params){	
		console.log("garagedoor getRequest ");
		return {"doorOpen":this.isOpen()};

	};
	deviceManager.onDeviceEvent(this.device,"stateChange", function(state){
		console.log(new Date() +" GarageDoor: state change: " + state);
		if(state===1){
			if(app.open_alert_timer){
				this._openTimer=setTimeout(function(){
						console.log("GarageDoor Open Alert!");
						// To do send event, email
				}.bind(this),app.open_alert_timer);
			}
		}
		else if(state===0){
			if(this._openTimer){
				clearTimeout(this._openTimer);
				this._openTimer=null;
				console.log("Clear GarageDoor Open Alert");
			}
		}
			
	}.bind(this));

};

module.exports = GarageDoor;

