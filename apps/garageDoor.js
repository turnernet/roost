var deviceManager = require("../services/DeviceManager/DeviceManager");



var GarageDoor = function GarageDoor(){

	this.isOpen = function(){
		return	deviceManager.isDeviceOn("Garage Door Sensor");
	};

 	this.controlDoor = function(open){
		return deviceManager.setDeviceOn("Garage Door Control",open);
	};


};

GarageDoor.instance=null;
   
GarageDoor.getInstance = function(){
      if(this.instance === null){
        this.instance = new GarageDoor();
      }
      return this.instance;
}
module.exports = GarageDoor.getInstance();

