

var OwDevice = function (device){
	this.device = device;
	this.read = null;
	this.write = null;
	console.log("1wire device")
}
module.exports = OwDevice;

