var owservice = require("../services/owservice");
var util = require("util");
var events = require("events");

var OwDevice = function (device) {
    "use strict";
    this.device = device;
    this._value = null;
	events.EventEmitter.call(this);  // inherit EventEmitter

	this._handleValue= function(value){
		if(value === ""){
			value = undefined;
		};
		this._value = value;
		this.device.value = value;
		this.device.updateTime= new Date();
		this.emit("device-value", this.device);
	}.bind(this);
	
    this._read = function () {
        owservice.read(this.device.address + this.device.readpath, function (path, value) {
			this._handleValue(value);
        }.bind(this));
    }.bind(this);

    var interval;
    if (!this.device.polling_interval) {
        this.device.polling_interval = 5 * 60 * 1000;
    }
    this._pollingInterval = setInterval(this._read, this.device.polling_interval);

	this._missingDeviceInterval = setInterval(function(){
		var now = new Date();
		if(now - this.device.updateTime > 3*this.device.polling_interval){
			console.log(this.device.name + " device is missing!");
			this._handleValue(undefined);
		}
	
	}.bind(this),this.device.polling_interval*3);
	
	
	
	
    this.read = function () {
        return this._value;
    };
	
    this.write = null;
    this._read();
    console.log("1wire device");

};

util.inherits(OwDevice, events.EventEmitter);
module.exports = OwDevice;

