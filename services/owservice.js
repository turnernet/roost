var Client = require("owfs").Client;
var con = new Client("127.0.0.1", "4304");
var async = require('async');

var OWService = function OWService() {
    "use strict";
    this.hello = function (msg) {
        console.log("Hello " + msg);
    };

    this.dir = function (path, callback) {
        var oRequest = new OwfsRequest(con, path, callback);
        oRequest.dir();
    };

    this.read = function (path, callback) {
        var oRequest = new OwfsRequest(con, path, callback);
        oRequest.read();
    };
    this.readAll = function (path, callback) {
        var oRequest = new OwfsRequest(con, path, callback);
        //oRequest.readAll();
        oRequest.dir();   // right now owfs module crashes if no alias when reading alias.  so just do a dir
    };

};

OWService.instance = null;

OWService.getInstance = function () {
    "use strict";
    console.log("OWService getInstance called");
    if (this.instance === null) {
        this.instance = new OWService();
    }
    return this.instance;
};

module.exports = OWService.getInstance();

function OwfsRequest(con, path, callback) {
    "use strict";
    this.path = path;
    this.con = con;
    this.callback = callback;

}

OwfsRequest.prototype.dir = function () {
    "use strict";
    this.con.dir(this.path, function (result) {
        // filter out any garbage device returned
        var saneResult = [];
        for (var i = 0; i < result.length; i++) {
            if (result[i].match("^\/") !== null) {
                saneResult.push(result[i]);
            }
        }
        //console.log("\n" +this.path +": " + saneResult);
        this.callback(this.path, saneResult);
    }.bind(this));
};

OwfsRequest.prototype.read = function () {
    "use strict";
    console.log("\nOwfsRequest.read " + this.path);
    this.con.read(this.path, function (result) {
        console.log("\n" + this.path + ": " + result);
        this.callback(this.path, result);
    }.bind(this));
};


/* this function is experimental - was working but owfs module crashes of owserver sends back nothing (ie if alias is empty) 
 * for now make sure all devices are aliased
 * */
OwfsRequest.prototype.readAll = function () {
    "use strict";
    this.con.dir(this.path, function (result) {
        //console.log("\n" +this.path +"length: " + result.length +" result:" +result);
        var seriesObj = {};

        var makeFunc = function (path) {
            return function (callback) {
                OWService.getInstance().read(path, function (request, result) {
                    console.log("read callback: + result " + result);
                    callback(null, result);
                });
            };
        };

        for (var i = 0; i < result.length; i++) {
            seriesObj[result[i]] = makeFunc(result[i]);
        }
        console.log(seriesObj);
        async.series(seriesObj, function (err, results) {
            console.log("async series callback results: ");
            for (var key in results) {
                if (results.hasOwnProperty(results)) {
                    var obj = results[key];
                    for (var prop in obj) {
                        if (obj.hasOwnProperty(prop)) {
                            console.log(prop + " = " + obj[prop]);
                        }
                    }
                }
            }
        });
        this.callback(this.path, result);


    }.bind(this));
};


	 
	 
	
	 
