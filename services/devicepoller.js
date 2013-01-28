var logger = require("./logger");
var async = require('async');
var deviceManager = require('../devices/DeviceManager');
	 
var DevicePoller= function DevicePoller(){	 
	this.timerCallback = function (){
		console.log("DevicePoller.timerHigh");
		var result = deviceManager.readAll();
		console.log(result);
		var str="code=status";
		
		for(i in result){
			str=str+", "+i+"="+result[i];
		}
		logger.send(str);
		}.bind(this);
	
	 this.timerhigh=setInterval(this.timerCallback,1000*60*5);
	 //setthis.timerCallback();
};
DevicePoller.instance=null;	 
DevicePoller.getInstance = function(){
	console.log("DevicePoller getInstance called")
	if(this.instance === null){
		this.instance = new DevicePoller();
	}
	return this.instance;
}

module.exports = DevicePoller.getInstance();