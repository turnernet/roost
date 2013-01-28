var express = require('express');
var devices= require('./routes/devices');
var apps = require('./routes/apps');
var api = express();
//var logger = require('./services/logger');
var devicePoller=require('./services/devicepoller');


process.on('uncaughtException', function(err) {
  console.log(err);
});

api.configure(function () {
	api.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
	api.use(require('connect').bodyParser());
	api.use(express.static(__dirname + '/public'));
	api.use(api.router);
});

api.get('/devices/ow', devices.findAllRequest,devices.findAllResponse);
api.get('/devices/ow/:id',devices.findByIdRequest,devices.findByIdResponse);
api.get('/devices/ow/:id/:property',devices.readRequest,devices.readResponse);

api.get('/apps/:app',apps.getAppResource);
api.put('/apps/:app',apps.putAppResource);

api.listen(8000);
 
 
console.log('Listening on port 8000...');

