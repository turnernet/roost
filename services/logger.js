var storm = require('splunkstorm/storm');


var Logger = function Logger() {
    "use strict";
    this._api_key = 'dUiOscDsPsPxMbF2lxwF-p7HCbRubHgLse0xgtkkbFsHR5O_ekt6-K8jnYBRzaRn0Dx9QpuKtxA=';
    this._project_id = 'b83380565f3b11e2a5a71231390e9c34';
    this._log = new storm.Log(this._api_key, this._project_id);

    this.sendDict = function (dict) {

        console.log(dict);
        this._log.send(dict);
    };

    this.send = function (str) {
        var tmp = new Date() + " " + str;
        console.log(tmp);
        this._log.send(tmp);
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