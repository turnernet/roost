var express = require('express');
    devices= require('./routes/devices')
 

var app = express();

 

app.get('/devices/ow', devices.findAllRequest,devices.findAllResponse);
app.get('/devices/ow/:id',devices.findByIdRequest,devices.findByIdResponse);
app.get('/devices/ow/:id/:property',devices.readRequest,devices.readResponse);

app.get('/devices/gpio/:id',devices.gpioOpenRequest,devices.gpioReadRequest,devices.gpioReadResponse);

app.get('/status',devices.statusOpenRequest,devices.statusReadRequest,devices.statusReadResponse);  // this is a temp hack for a status page, should be in own module

app.listen(8000);

console.log('Listening on port 8000...');