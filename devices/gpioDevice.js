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
        return value;
    };


    if (this.device.direction === "in") {
        this.isOn = function () {
            var value = this._applySenseTransform(this.gpio1.readSync());
            if (value) {
                return true;
            }
            else {
                return false;
            }
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
                if (this._debounceTimer !== null) {
                    clearTimeout(this._debounceTimer);
                    this._debounceTimer = null;
                }
                this._debounceTimer = setTimeout(function () {
                    var value = this.isOn();
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
            this.cachedValue = on;
            if (this.device.sense === "active_low") {
                on = !on;
            }
            if (on) {
                value = 1;
            }
            else {
                value = 0;
            }
            console.log("setting  " + this.device.address + " to " + value);
            this.gpio1.write(value, function (err) { // Asynchronous write. Synchronous doesn't work?
                if (err) {
                    throw err;
                }
            });
        };
        this.isOn = function () {
            return this.cachedValue;
        };
        this.setOn(false);
    }

};
util.inherits(GpioDevice, events.EventEmitter);
module.exports = GpioDevice;
