var deviceManager = require("../devices/DeviceManager");

var Humidifier = function Humidifier(app){
	this.app = app;
    console.log("Humidifer app started");
	this.device=app.devicekey;
		
	this.isActive = function(){
		return	deviceManager.isDeviceOn(this.device);
	};

	this.setActive = function(on){
		return deviceManager.setDeviceOn(this.device,on);
	};

	this.getRequest = function(params){
		console.log("Humidifier.getRequest ");
		result={"enabled":this.isActive()};
		return result;
	
	};
	
	this.putRequest = function(body){
		console.log("Humidifier.putRequest " +  JSON.stringify(body))	;		
		enabled = body.enabled;
		
		if(enabled != undefined){
			console.log("Setting Humidifier: " + enabled);
			this.setActive(enabled);
		}
		return "ok";
	};
	
	this.setActive(false);
};

module.exports = Humidifier

