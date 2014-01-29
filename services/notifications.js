var util = require("util");
var events = require("events");
var logger = require("./logger");


var Notifications = function Notifications() {
    "use strict";
	events.EventEmitter.call(this);  // inherit EventEmitter
	
	this.init = function(io){
		this.io = io;
		this.io.set('transports', ['websocket','xhr-polling']);
		this.io.sockets.on('connection', function (socket) {
		//this.io.set('transports', ['websocket']);
				this.emit("clientConnected",socket);
				var address = socket.handshake.address;
				console.log("New connection from " + address.address)
				logger.send("code=clientConnect address="+address.address);
		}.bind(this));
	}
	
	this.send = function(header,data,socket){
		if(socket !== undefined){
			socket.emit(header,data);
		}
		else{
			this.io.sockets.emit(header,data);
		}
	};
}
Notifications.instance = null;
Notifications.getInstance = function () {
    console.log("Notifications getInstance called");
    if (this.instance === null) {
        this.instance = new Notifications();
    }
    return this.instance;
};

util.inherits(Notifications, events.EventEmitter);
module.exports = Notifications.getInstance();