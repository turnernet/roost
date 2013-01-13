var deviceManager = require("../devices/DeviceManager");



var MotionDetector = function MotionDetector(){
	this.alias = "Motion Detector";
	this.motionDetected = function(){
		return	deviceManager.isDeviceOn(this.alias);
	};

	deviceManager.onDeviceEvent(this.alias,"stateChange", function(state){
		console.log("motion detector state change: " + state);
	}.bind(this));


};

MotionDetector.instance=null;
   
MotionDetector.getInstance = function(){
      if(this.instance === null){
        this.instance = new MotionDetector();
      }
      return this.instance;
}
module.exports = MotionDetector.getInstance();
