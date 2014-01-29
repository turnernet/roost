var logger = require("../services/logger");

var hvacHeatController = function hvacHeatController(){
	"use strict";
	 console.log("hvacHeatController start");
	this.minTimeBetweenCycles = 5*60*1000;	
	this.devicesCallingForHeat = [];
	this.deviceNames = "";
	this.heatStartTime = undefined;

	this.setHeatControlFunction= function(heatControlFunction){
		this.callForHeatFn = heatControlFunction;
		console.log("hvacHeatController setHeatControlFunction");
	}.bind(this);
	
	this.callForHeat = function (device){
		console.log("Call for heat " + device.name + " num devices: " + this.devicesCallingForHeat.length);
		for(var i=0; i<this.devicesCallingForHeat.length; i++) {
				if(this.devicesCallingForHeat[i].name == device.name){
					console.log("already calling for heat");
					return;
				}
		}
		console.log("pushing device calling for heat into list");
		this.devicesCallingForHeat.push(device);
		device.callingForHeat = true;
		this.deviceNames= this.deviceNames + device.name + ",";
		if(!this.heatStartTime){
				this.heatStartTime = new Date();
		} 
		this.callForHeatFn(true);
	}.bind(this);

	this.noCallForHeat = function (device){
		
		console.log("Number of devices Calling for heat " +this.devicesCallingForHeat.length);
		console.log("No Call for heat " + device.name);
		for(var i=0; i<this.devicesCallingForHeat.length; i++) {
				if(this.devicesCallingForHeat[i].name == device.name){
				    device.callingForHeat = false;
					this.devicesCallingForHeat.splice(i, 1)[0];
					console.log("hvacHeatController remove for devices calling for heat " + device.name);
					break; 
				}
			
		}
		if(this.devicesCallingForHeat.length ===0){
			this.callForHeatFn(false);
			if(this.heatStartTime){
				var runTime = (new Date()) - this.heatStartTime;
				var str= "code=furnaceRun requestingDevices="+this.deviceNames+ " runtimeSecs="+Math.round(runTime/1000);
				console.log(str);
				logger.send(str);
				this.heatStartTime=undefined;
				this.deviceNames="";
			}
		}
	}.bind(this);
	
	
}


module.exports =  hvacHeatController;