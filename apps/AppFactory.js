/*
// AppFactory 
//
*/
var Humidifier = require('./humidifier');
var GarageDoor = require('./garageDoor');
var MotionDetector = require('./motionDetector');

var AppFactory = function(){}
AppFactory.prototype.createApp = function(app){
	console.log("createApp "+app.appname);
	if(app.appname == "garage"){
		this.appClass = GarageDoor;
	}
	else if(app.appname=="motion"){
		this.appClass = MotionDetector;
	}
	else if(app.appname=="humidifier"){
		this.appClass=Humidifier;
	}
	else{
	
		return null;
	}
	return new this.appClass( app );	
};

module.exports = AppFactory;
