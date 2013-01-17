var deviceManager = require("../devices/DeviceManager");

var GarageDoor = function GarageDoor(app){
         console.log("GarageDoor app started");
	this.app = app;
	this.device=app.device;
	this.isOpen = function(){
		return	deviceManager.isDeviceOn(this.device);
	};

 	this.controlDoor = function(open){
		return deviceManager.setDeviceOn("Garage Door Control",open);
	};

	this.getRequest = function(resource,params){	
		console.log("garagedoor getRequest " + resource);
		if(resource=="door"){
			return {"open":this.isOpen()};
		}
		else{
			throw "Bad Resource"
		}

	};
	
	deviceManager.onDeviceEvent(this.device,"stateChange", function(state){
		console.log(new Date() +" Garage Door state change: " + state);
		// TODO: generate on event

			
	}.bind(this));

};

module.exports = GarageDoor

