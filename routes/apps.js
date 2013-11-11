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
};

exports.postAppResource = function (req, res) {
    "use strict";
    console.log(JSON.stringify(req.body));
    try {
        var result = appManager.appPostRequest(req.params.app, req.body);
        res.json(result);
    }
    catch (err) {
        res.statusCode = 404;
        console.log(err);
        res.send(err);
    }
};
