var deviceManager = require("../devices/DeviceManager");



var MotionDetector = function MotionDetector(app){
	console.log("motion detector app started");
	this.app = app;
	this.device=app.devicekey;
	
	if(app.holddown_timer){
		this.holddown=app.holddown_timer;
	}
	this._timer=null;
	this.motionDetected = function(){
		return	deviceManager.isDeviceOn(this.device);
	};
	
	this._holdDownTimerFn = function(){
					console.log(new Date() +" motion detector, hold down timer expired");
					
					this._timer=null;
					if(this.motionDetected()){
						this._timer=setTimeout(this._holdDownTimerFn,this.holddown);
						console.log("motion still detected, resetting timer");
					}
					else{
						console.log("motion not detected, send off event");
					// TODO: generate off event	
					}
					
				}.bind(this)
	
	
	deviceManager.onDeviceEvent(this.device,"stateChange", function(state){
		console.log(new Date() +" A motion detector state change: " + state);
		if(state==1){
			console.log(new Date() +" motion detector on"); // TODO: generate on event
			if(this.holddown){
				if(this._timer){
					clearTimeout(this._timer);
					console.log("resetting hold down timer");
				}	
				this._timer=setTimeout(this._holdDownTimerFn,this.holddown);
			}
		}
		else if(state == 0){
			if(!this._timer){  
				console.log(new Date() +" motion detector, state transition to off");
			}
		}
			
	}.bind(this));

	this.getRequest = function(params){
			result={"motionDetected":this.motionDetected()};
			return result;		
	};

};

module.exports = MotionDetector;
