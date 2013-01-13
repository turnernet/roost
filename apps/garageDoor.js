var deviceManager = require("../devices/DeviceManager");



var GarageDoor = function GarageDoor(app){
         console.log("GarageDoor app started");
	this.app = app;
	this.isOpen = function(){
		return	deviceManager.isDeviceOn("Garage Door Sensor");
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


};

module.exports = GarageDoor

