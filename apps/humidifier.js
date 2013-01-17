var deviceManager = require("../devices/DeviceManager");

var Humidifier = function Humidifier(app){
	this.app = app;
        console.log("Humidifer app started");
	this.device=app.device;
		
        /*
	this._timer = setInterval(function(){
		this.setActive(!this.isActive());
	}.bind(this),60000*60*3);
*/
	this.isActive = function(){
		return	deviceManager.isDeviceOn(this.device);
	};

	this.setActive = function(on){
		return deviceManager.setDeviceOn(this.device,on);
	};

	this.getRequest = function(resource,params){
		console.log("Humidifier.getRequest " +resource);
		if(resource=="enabled"){			
			enabled = this.isActive();
			result={"enabled":enabled};
			return result;
		}
		else{
			throw "bad resource";
		}
		
	};
	this.setActive(true);
};

module.exports = Humidifier

