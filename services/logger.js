var storm = require('splunkstorm/storm');


var Logger = function Logger() {
    "use strict";
    this._api_key = 'dUiOscDsPsPxMbF2lxwF-p7HCbRubHgLse0xgtkkbFsHR5O_ekt6-K8jnYBRzaRn0Dx9QpuKtxA=';
    this._project_id = 'b83380565f3b11e2a5a71231390e9c34';
    this._log = new storm.Log(this._api_key, this._project_id);
	this._seqNum=0;

	
	this._splunkPostInterval = setInterval(function(){
		console.log("splunkPostInterval messages to post: " + this._msgQ.length);
		while(this._msgQ.length>0){
			var msg = this._msgQ.shift();
			msg = msg + " " + "msgQLen="+this._msgQ.length
			this._log.send(msg,"generic_single_line",undefined,undefined,function(error, response, body){
				var logger = Logger.getInstance();
				console.log("splunkPost: " + this);
				if(response && response.statusCode && response.statusCode === 200){
					console.log('splunkstorm msg posted successfully: HTTP Status code '+ response.statusCode)
				} else if(response && response.statusCode){
					console.log('splunkstorm msg post error: '+ response.statusCode)
					logger.addMsg(this);
					logger.send("code=error module=logger statusCode="+response.statusCode);		
				} else{
					logger.addMsg(this);
					console.log('splunkstorm msg error ' + error);
					logger.send("code=error module=logger statusCode=-1 error="+error);
				}				  
			}.bind(msg));
		}
	}.bind(this),1*60*1000);
	
	this._msgQ = [];
	this.addMsg = function (msg){
		this._msgQ.push(msg);
	};	
	
    this.send = function (str) {
		var date = new Date();
        var tmp = date.toISOString() + " " + str + " seqNum="+this._seqNum;
		this._seqNum=this._seqNum+1;
        console.log(tmp);
		this.addMsg(tmp);
    };
};
Logger.instance = null;
Logger.getInstance = function () {
    console.log("Logger getInstance called");
    if (this.instance === null) {
        this.instance = new Logger();
    }
    return this.instance;
};

module.exports = Logger.getInstance();

	
	
