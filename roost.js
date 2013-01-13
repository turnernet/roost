var express = require('express');
var devices= require('./routes/devices');
var apps = require('./routes/apps');
var DeviceManager = require('./services/DeviceManager/DeviceManager');
var api = express();

api.configure(function () {
	api.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
	api.use(express.bodyParser());
});

api.get('/devices/ow', devices.findAllRequest,devices.findAllResponse);
api.get('/devices/ow/:id',devices.findByIdRequest,devices.findByIdResponse);
api.get('/devices/ow/:id/:property',devices.readRequest,devices.readResponse);

api.get('/apps/:app/:resource',apps.getAppResource);
api.put('/apps/:app/:resource',apps.putAppResource);

api.listen(8000);
 
console.log('Listening on port 8000...');


setTimeout( function(){
	DeviceManager.setDeviceOn("Humidifier",true);
}, 6000);

/*
setInterval( function(){
		console.log("Timer");
		garage = DeviceManager.isDeviceOn("Garage Door");
		motion = DeviceManager.isDeviceOn("Presence");		
		console.log("Garage Open: " + garage +" Motion " +motion);
		
		},15000);

*/
