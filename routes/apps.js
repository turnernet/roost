var appManager = require('../apps/AppManager');

exports.getAppResource = function (req, res, next) {
    "use strict";
    console.log("getAppResource " + req.params.app);
    try {
        var result = appManager.appGetRequest(req.params.app, req.params);
        res.json(result);
    }
    catch (err) {
        res.statusCode = 404;
        res.send(err);
    }
    /*
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
     */
};

exports.putAppResource = function (req, res) {
    "use strict";
    console.log(JSON.stringify(req.body));
    try {
        var result = appManager.appPutRequest(req.params.app, req.body);
        res.json(result);
    }
    catch (err) {
        res.statusCode = 404;
        console.log(err);
        res.send(err);
    }
};
