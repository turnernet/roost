/*
// DeviceFactory 
//
*/

var GpioDevice = require('./gpioDevice');
var OwDevice = require('./owDevice');

var DeviceFactory = function(){}
DeviceFactory.prototype.deviceClass = OwDevice;
DeviceFactory.prototype.createDevice = function(device){
	if(device.bus == "1wire"){
		this.deviceClass = OwDevice;
	}
	else if (device.bus == "gpio"){
		this.deviceClass = GpioDevice;
	}
	else{
		return null;
	}
	
	return new this.deviceClass( device );	
};

module.exports = DeviceFactory;
