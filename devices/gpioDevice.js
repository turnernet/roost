var Gpio = require("onoff").Gpio;
var util = require("util");
var events = require("events");


var GpioDevice = function (device) {
    //console.log("gpio: " + device.name+" Pin: " + device.address + " Direction: " + device.direction);
    events.EventEmitter.call(this);  // inherit EventEmitter
    this.device = device;
    this.gpio1 = new Gpio(this.device.address, this.device.direction, 'both');

    this.isOn = null;
    this.setOn = null;
    this.cachedState = null;
    this._debounceTimer = null;

    this._applySenseTransform = function (value) {
        if (this.device.sense === "active_low") {
            value = !value;
        }
        if (value) {
            return true;
        }
        else {
            return false;
        } 
    };


    if (this.device.direction === "in") {
        this.isOn = function () {
            return this._applySenseTransform(this.gpio1.readSync());
        };
        // asynchronous change detection
        this.interrupt = function (err, value) {
            if (err) {
                throw err;
            }
            console.log(new Date() + " GPIO Change: " + this.device.name + "  value is " + value);
            this.cachedState = this._applySenseTransform(value);

            // implement debounce feature if required
            if (this.device.debounce) {
				console.log("implement debounce timer");
                if (this._debounceTimer !== null) {
					console.log("cancelling debounce timer");
                    clearTimeout(this._debounceTimer);
                    this._debounceTimer = null;
                }
				console.log("setting debounce timer cachedState: ",this.cachedState);
                this._debounceTimer = setTimeout(function () {
                    var value = this.isOn();
					console.log("debounceTimer fired, value is: " + value + "cachedState: " + this.cachedState);
                    if (this.cachedState === value) {
                        console.log(new Date() + " " + this.device.alias + "  debounced: value is " + value);
                        this.emit("stateChange", value);
                    }
                }.bind(this), this.device.debounce);
            } else {
                this.emit("stateChange", this.cachedState);
            }
            this.gpio1.watch(this.interrupt);
        }.bind(this);

        this.gpio1.watch(this.interrupt);

    }
    else if (this.device.direction === "out") {
        this.setOn = function (on) {
            console.log("on is: " + on);
            var value;
			var temp=on;
			
            if (this.device.sense === "active_low") {
                temp = !on;
            }
			if (temp) {
                value = 1;
            }
            else {
                value = 0;
            }

            console.log("setting  " + this.device.address + " to " + value);
		
			if(this.cachedValue !== on){
				this.cachedValue = on;
				console.log("device.setOn: "+this.device.name+" on: " + this.cachedValue);
				this.emit("device-state",on);	
			}
            this.gpio1.write(value, function (err) { // Asynchronous write. Synchronous doesn't work?
                if (err) {
                    throw err;
                }
            }.bind(this));

        };
        this.isOn = function () {
			console.log("device.isOn: "+this.device.name+" on: " + this.cachedValue);
            return this.cachedValue;
        };
		this.cachedValue=false;
        this.setOn(false);
    }

};
util.inherits(GpioDevice, events.EventEmitter);
module.exports = GpioDevice;
