var owservice = require("../services/owservice");
var util = require("util");

var OwDevice = function (device) {
    "use strict";
    this.device = device;
    this._value = null;
	events.EventEmitter.call(this);  // inherit EventEmitter
	
    this._read = function () {
        owservice.read(this.device.address + this.device.readpath, function (path, value) {
            this._value = value;
			this.device.value = value;
			this.device.updateTime= new Date();
			this.emit("device-value", this.device);
        }.bind(this));
    }.bind(this);

    var interval;
    if (this.device.polling_interval) {
        interval = this.device.polling_interval;
    }
    else {
        interval = 5 * 60 * 1000;
    }
    this._pollingInterval = setInterval(this._read, interval);

    this.read = function () {
        return this._value;
    };
	
    this.write = null;
    this._read();
    console.log("1wire device");

};

util.inherits(OwDevice, events.EventEmitter);
module.exports = OwDevice;

