var express = require('express');
var devices= require('./routes/devices');
var DeviceManager = require('./services/DeviceManager/DeviceManager');
var config = require('./config.json');
var app = express();

DeviceManager.setDevices(config.devices);

 

app.get('/devices/ow', devices.findAllRequest,devices.findAllResponse);
app.get('/devices/ow/:id',devices.findByIdRequest,devices.findByIdResponse);
app.get('/devices/ow/:id/:property',devices.readRequest,devices.readResponse);

app.get('/devices/gpio/:id',devices.gpioOpenRequest,devices.gpioReadRequest,devices.gpioReadResponse);

app.get('/status',devices.statusOpenRequest,devices.statusReadRequest,devices.statusReadResponse);  // this is a temp hack for a status page, should be in own module

app.listen(8000);

console.log('Listening on port 8000...');


setTimeout( function(){
	DeviceManager.setDeviceOn("Humidifier",false);
}, 6000);


setInterval( function(){
		console.log("Timer");
		garage = DeviceManager.isDeviceOn("Garage Door");
		motion = DeviceManager.isDeviceOn("Presence");		
		console.log("Garage Open: " + garage +" Motion " +motion);
		
		},15000);