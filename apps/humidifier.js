var deviceManager = require("../services/DeviceManager/DeviceManager");

var Humidifier = function Humidifier(){
	this._timer = setInterval(function(){
		this.setActive(!this.isActive());
	}.bind(this),60000*60*3);

	this.isActive = function(){
		return	deviceManager.isDeviceOn("Humidifier");
	};

	this.setActive = function(on){
		return deviceManager.setDeviceOn("Humidifier",on);
	};


};

Humidifier.instance=null;
   
Humidifier.getInstance = function(){
      if(this.instance === null){
        this.instance = new Humidifier();
      }
      return this.instance;
}
module.exports = Humidifier.getInstance();

