var express = require('express');
var devices= require('./routes/devices');
var apps = require('./routes/apps');
var api = express();
//var logger = require('./services/logger');
var devicePoller=require('./services/devicepoller');
var server = require('http').createServer(api);
var io = require('socket.io').listen(server);
var notifications = require('./services/notifications').init(io);

process.on('uncaughtException', function(err) {
  "use strict";
  console.log(err);
});

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    "use strict";
  res.header('Access-Control-Allow-Origin', '*');
//      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE','OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
// intercept OPTIONS method
  if ('OPTIONS' == req.method) {  
    res.send(200);
  }
  else {
    next();
  }
};

api.configure(function () {
    "use strict";
	api.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
	api.use(require('connect').bodyParser());
	api.use(allowCrossDomain);
	api.use(api.router);
	api.use(express.static(__dirname + '/public'));
});

api.get('/devices/ow', devices.findAllRequest,devices.findAllResponse);
api.get('/devices/ow/:id',devices.findByIdRequest,devices.findByIdResponse);
api.get('/devices/ow/:id/:property',devices.readRequest,devices.readResponse);

api.get('/apps/:app',apps.getAppResource);
api.post('/apps/:app',apps.postAppResource);

server.listen(8000);
 
console.log('Listening on port 8000...');