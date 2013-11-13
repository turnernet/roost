var util = require("util");
var events = require("events");


var Notifications = function Notifications() {
    "use strict";
	events.EventEmitter.call(this);  // inherit EventEmitter
	
	this.init = function(io){
		this.io = io;
		this.io.set('transports', ['websocket','xhr-polling']);
		//this.io.set('transports', ['websocket']);
		this.io.sockets.on('connection', function (socket) {
				this.emit("clientConnected",socket);
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