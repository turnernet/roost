var deviceManager = require("../devices/DeviceManager");



var MotionDetector = function MotionDetector(app){
	console.log("motion detector app started");
	this.app = app;
	this.alias = "Motion Detector";
	this.motionDetected = function(){
		return	deviceManager.isDeviceOn(this.alias);
	};

	deviceManager.onDeviceEvent(this.alias,"stateChange", function(state){
		console.log("motion detector state change: " + state);
	}.bind(this));

	this.getRequest = function(resource,params){
		if(resource=="detected"){
			enabled = this.motionDetected();
			result={"motion":enabled};
			return result;
		}
		else{
			throw 'bad resource'
		}
		
	};

};

module.exports = MotionDetector;
