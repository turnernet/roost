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





/* 
// DeviceManager
//
*/
var DeviceManager = function DeviceManager(){
  
  this.devices =[];
  EventEmitter.call(this);
/*
  this._temperaturePoller = setInterval( function(){
		console.log("DeviceManager temperaturePoller!!");
		console.log(this.devices.length)
		for(i in this.devices){
			if(this.devices[i].isOn){
				console.log(this.devices[i].device.alias + " " + this.devices[i].isOn());
			}
		}
		}.bind(this)
		,3000);
  */
  // setDevices	
  this._setDevices = function (deviceList){
	  var deviceFactory = new DeviceFactory();
	  for(var i in deviceList){
		  this.devices.push(deviceFactory.createDevice(deviceList[i]));
	  }	  
	  console.log("setDevices: " + this.devices.length)
	  
	};

  this.onDeviceEvent = function(alias,event,callback){
	device = this._findDevice(alias);

	if(device == null || device.on ==null){
		throw "Device error: " + device + " " + device.on;
	}
	console.log("DeviceManager.onDeviceEvent " + alias + " " +event);
	device.on(event,callback);
  }	
	

  this._findDevice = function(alias){
	  var device =null;
	  for(var i in this.devices){
		  if(this.devices[i].device.alias == alias){
			  device = this.devices[i];
		  }
	  }
	  return device;
	  };
	  
   this.setDeviceOn = function (alias,on){
	  var device = this._findDevice(alias);
	  if(device == null || device.setOn == null){
		  throw "Device error: " + device;
		  
	  }
	  return device.setOn(on);	  
	  };

  
   this.isDeviceOn = function (alias){
	  var device = this._findDevice(alias);
	  if(device == null || device.isOn == null){
		  throw "Device error: " + device;
		  
	  }
	  return device.isOn();	  
	  };

  this._setDevices(config.devices);
	  
  };
  
DeviceManager.prototype.__proto__ = EventEmitter.prototype;
DeviceManager.instance=null;
   
DeviceManager.getInstance = function(){
      console.log("DeviceManager getInstance called");
      if(this.instance === null){
        this.instance = new DeviceManager();
      }
      return this.instance;
}
               
module.exports = DeviceManager.getInstance();
