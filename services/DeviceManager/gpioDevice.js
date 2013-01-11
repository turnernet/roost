//


var Gpio = require("onoff").Gpio;

var GpioDevice = function (device){	
	console.log("gpio device");
	this.device = device;
	this.gpio = new Gpio(this.device.address, this.device.direction);
	
	this.isOn = null;
	this.setOn = null;
	this.cachedValue = null;
	
	if(this.device.direction == "in"){
		this.isOn = function(){		
			value = this.gpio.readSync();
			if(this.device.sense == "active_low"){
				value = !value;
			}
			return value == true;		
		};
	}
	else if(this.device.direction == "out"){
		this.setOn = function(on) {
			this.cachedValue = on;
			if(this.device.sense == "active_low"){
				on = !on;
			}
			if(on){
				value = 1;
			}
			else{
				value = 0;
			}		
			console.log("setting  " + this.device.address + " to " + value);
			this.gpio.write(value, function(err) { // Asynchronous write. Synchronous doesn't work?
				if (err) throw err;
        });	
		};
		this.isOn = function(on){
			return this.cachedValue;
		};		
	}
	
}

module.exports = GpioDevice
