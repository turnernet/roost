var humidifier = require('../apps/humidifier');
var garageDoor = require('../apps/garageDoor');
var motionDetector = require('../apps/motionDetector');


exports.getAppResource=function(req,res,next){
	if(req.params.app == "humidifier" && req.params.resource == "enabled"){
		enabled = humidifier.isActive();
		result={"enabled":enabled};
		res.json(result);
	}

	else if(req.params.app == "garage" && req.params.resource == "door"){
		opened = garageDoor.isOpen();
		result={"opened":opened};
		res.json(result);
	}
	else if(req.params.app == "motion" && req.params.resource == "detector"){
		motion = motionDetector.motionDetected();
		result={"motionDetected":motion};
		res.json(result);
	}
	else{
		res.statusCode=404;
		res.send("bad app");
		
	}
};


exports.putAppResource=function(req,res,next){
	if(req.params.app == "humidifier" && req.params.resource == "enabled"){
		humidifier.setActive(req.body.enabled);
		res.send("set humidifer enabled: " + req.body.enabled);
	}
	else{
		res.statusCode=404;
		res.send("bad request");	
	}
};
