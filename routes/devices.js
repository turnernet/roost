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
};
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
};

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
};

