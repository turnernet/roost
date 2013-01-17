var owservice = require("../services/owservice");


var OwDevice = function (device){
	this.device = device;
	this._value=null;
	
	
	this._read = function(){
		owservice.read(this.device.address+this.device.readpath,function(path,value){
			console.log(path+" " + value);
			this._value=value;
		}.bind(this));
	};
	
	if(this.device.polling_interval){
		interval = this.device.polling_interval;
	}
	else{
		interval = 5*60*1000;
	}
	this._pollingInterval = setInterval(this._read,interval);
	
	
	
	
	this.read = function(){
		return this._value;
	}
	
	this.write = null;
	this._read();
	console.log("1wire device");
	
	
	
	
}
module.exports = OwDevice;

