// singleton, maintains a cache of last read values
// lists 1wire devices and reads temperature 1x per minute
// polls gpio inputs every second

/*
 var NodeCache = require("nodecache");
 var cache = new NodeCache( { stdTTL: 600, checkperiod: 300 });*/

//
var config = require('../config.json');

var EventEmitter = require('events').EventEmitter;
var DeviceFactory = require('./DeviceFactory.js');
var util = require("util");
/* 
 // DeviceManager
 //
 */
var DeviceManager = function DeviceManager() {
    "use strict";
    this.devices = [];
    EventEmitter.call(this);

    this.readAll = function () {
        console.log("ReadAll");

        var result = [];
        var key;
        for (var i=0; i < this.devices.length; i++) {
            key = this.devices[i].device.key;
            if (this.devices[i].isOn) {
                console.log(key + " " + this.devices[i].isOn());
                result[key] = this.devices[i].isOn();
            }
            else if (this.devices[i].read) {
                console.log(key + " " + this.devices[i].read());
                result[key] = this.devices[i].read();
            }
        }
        return result;
    };

    // setDevices
    this._setDevices = function (deviceList) {
        var deviceFactory = new DeviceFactory();
        for (var i=0; i < deviceList.length; i++) {
            this.devices.push(deviceFactory.createDevice(deviceList[i]));
        }
        console.log("setDevices: " + this.devices.length);

    };

    this.onDeviceEvent = function (key, event, callback) {
        console.log("ondevice event key: " + key);
        var device = this._findDevice(key);

        if ((device === null) || (device.on === null)) {
            throw "Device error: " + device + " " + device.on;
        }
        console.log("DeviceManager.onDeviceEvent " + key + " " + event);
        device.on(event, callback);
    };

	this.getDevice = function (key){
		return this._findDevice(key);
	}

    this._findDevice = function (key) {
        var device = null;
        for (var i in this.devices) {
            if (this.devices[i].device.key === key) {
                device = this.devices[i];
            }
        }
        return device;
    };

    this.setDeviceOn = function (key, on) {
        var device = this._findDevice(key);
        if ((device === null) || (device.setOn === null)) {
            throw "Device error: " + device;

        }
        return device.setOn(on);
    };


    this.isDeviceOn = function (key) {
        var device = this._findDevice(key);
        if ((device === null) || (device.isOn === null)) {
            throw "Device error: " + device;

        }
        return device.isOn();
    };

    this._setDevices(config.devices);

};

DeviceManager.instance = null;

DeviceManager.getInstance = function () {
    "use strict";
    console.log("DeviceManager getInstance called");
    if (this.instance === null) {
        this.instance = new DeviceManager();
    }
    return this.instance;
};
util.inherits(DeviceManager, EventEmitter);
module.exports = DeviceManager.getInstance();
