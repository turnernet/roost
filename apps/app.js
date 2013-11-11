var events = require("events");
var util = require("util");

var App = function App(){
	"use strict"
	events.EventEmitter.call(this); // inherit EventEmitter
};

util.inherits(App, events.EventEmitter);	
module.exports = App;