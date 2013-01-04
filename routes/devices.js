var owservice = require("../services/owfs/owservice")
var gpio = require("pi-gpio");


/* To take advantage of express support for async middleware
 * export both the request and response handling
 */
	
/*******
 * findAll
 * 
 * Performs a dir of the bus
 */ 
exports.findAllRequest=function(req,res,next){
	owservice.dir("/",function(request,result){
		console.log("dir call back result: " + result);
		res.locals.data=result;
		next();  // 
	});	
};

exports.findAllResponse=function(req,res,next){
	console.log("findAllResponse: " + res.locals.data);
	res.json(res.locals.data)
}

/*******
 * findById
 * 
 * Performs a dir of the id
 */ 
exports.findByIdRequest = function(req, res,next) {	
    owservice.readAll("/"+req.params.id,function(request,result){		
		res.locals.data=result;
		next();  // 
	});
};
exports.findByIdResponse=function(req,res,next){	
	res.json(res.locals.data)
}

/********
 *  read
 *  
 *  performs a read of  /id/property
 */
exports.readRequest = function(req, res,next) {	
    owservice.read("/"+req.params.id+"/"+req.params.property,function(request,result){		
		res.locals.data=result;
		next();  
	});
};
exports.readResponse=function(req,res,next){
	result={id:req.params.id};
	result[req.params.property]=res.locals.data;
	res.json(result);
}

/*** gpio read 
 * 
 * 
 */
exports.gpioOpenRequest = function(req,res,next){
	gpio.open(req.params.id , "input", function(err) {
		next();	
});
};

exports.gpioReadRequest = function(req,res,next){
	gpio.read(req.params.id ,  function(err,value) {
		gpio.close(req.params.id)
		res.locals.data=value;
		next();
});
};
	
exports.gpioReadResponse = function(req,res,next){      
		result={id:req.params.id};
		result["value"]=res.locals.data;
		res.json(result);
};

exports.statusOpenRequest = function(req,res,next){
	gpio.open("16" , "input", function(err) {
		next();	
});
};

exports.statusReadRequest = function(req,res,next){
	gpio.read("16",  function(err,value) {
		gpio.close("16")
		res.locals.data=value;
		next();
});
};
	
exports.statusReadResponse = function(req,res,next){      
		result={id:"Garage Door"};
		
		
		if(res.locals.data=="0"){
			value="CLOSED";
		}
		else{
			value= "OPENED"
		}
		res.end("GARAGE DOOR: " + value);
};

