var cradle = require('cradle');
var db = new(cradle.Connection)().database('roost');


var DataStore = function
db.get('humidifier', function (err, doc) {

    console.log(doc);
    var newState="on";
    if(doc.state ==="on"){
        newState="off";
    }

    db.save('humidifier', {
        state: newState
    }, function (err, res) {
        if (err) {
            // Handle error
            console.log(err);
        } else {
            // Handle success
            console.log("success");
        }
    });

});

DeviceManager.instance = null;

DeviceManager.getInstance = function () {
    "use strict";
    console.log("DeviceManager getInstance called");
    if (this.instance === null) {
        this.instance = new DeviceManager();
    }
    return this.instance;
};
util.inherits(DeviceManager, EventEmitter);
module.exports = DeviceManager.getInstance();






