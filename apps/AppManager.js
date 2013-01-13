var config = require('../config.json');

var EventEmitter = require('events').EventEmitter;
var AppFactory = require('./AppFactory.js');




var AppManager = function AppManager(){
  
  this.apps =[];
  EventEmitter.call(this);

  this._setApps = function (appList){
	  var appFactory = new AppFactory();
	  for(var i in appList){
		  this.apps.push(appFactory.createApp(appList[i]));
	  }	  
	  console.log("setApps: " + this.apps.length)
	  
	};

  this.onAppEvent = function(alias,event,callback){
	app = this._findApp(alias);

	if(app == null || app.on ==null){
		throw "App error: " + app + " " + app.on;
	}
	console.log("AppManager.onAppEvent " + alias + " " +event);
	app.on(event,callback);
  }	
	

  this._findApp = function(appname){
	  console.log("find app " + appname);
	  console.log(this.apps);
	  var app =null;
	  for(var i in this.apps){
		  if(this.apps[i].app.appname && this.apps[i].app.appname == appname){
			  app = this.apps[i];
		  }
	  }
	  console.log(app);
	  return app;
	  };

  this.appGetRequest=function(appname,resource,params){

	console.log("AppManager getRequest " + appname);
	var app = this._findApp(appname);
	console.log("AppManager getRequest app: " + app);
	if(app==null){
		throw "Appname error";
	}
	return app.getRequest(resource,params);

  };

  this.appPutRequest=function(appname,resource,body){

  };

  this._setApps(config.applications);
	  
  };
  
AppManager.prototype.__proto__ = EventEmitter.prototype;
AppManager.instance=null;
   
AppManager.getInstance = function(){
      console.log("AppManager getInstance called");
      if(this.instance === null){
        this.instance = new AppManager();
      }
      return this.instance;
}
               
module.exports = AppManager.getInstance();
