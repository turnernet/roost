var deviceManager = require("../devices/DeviceManager");
var util = require("util");
var events = require("events");


var MotionDetector = function (app) {
    "use strict";
    events.EventEmitter.call(this);  // inherit EventEmitter
    console.log("motion detector app started, inherit events");
    this.app = app;
    this.device = app.devicekey;

    if (app.holddown_timer) {
        this.holddown = app.holddown_timer;
    }
    this._timer = null;


    this.motionDetected = function () {
        if (this._timer === null) {  // if null either no holddown timer and device is on, or device is off
            return    deviceManager.isDeviceOn(this.device);
        }
        else { // if a timer is active, then device is on and value is held at on till timer expires
            return true;
        }
    };

    this._holdDownTimerFn = function () {
        console.log(new Date() + " motion detector, hold down timer function");

        this._timer = null;
        if (this.motionDetected()) {
            this._timer = setTimeout(this._holdDownTimerFn, this.holddown);
            console.log("motion still detected, (re)setting timer");
        }
        else {
            console.log("motion not detected, send off event");
            this._timer = null;
            this.emit("motionDetectChange", 0);
        }

    }.bind(this);


    deviceManager.onDeviceEvent(this.device, "stateChange", function (state) {
        console.log(new Date() + " A motion detector state change: " + state);
        if (state === 1) {
            console.log(new Date() + " motion detector on"); // TODO: generate on event
            if (this.holddown) {
                if (this._timer) {
                    clearTimeout(this._timer);
                    console.log("resetting hold down timer");
                }
                this.emit("motionDetectChange", 1);
                this._holdDownTimerFn();
            }
            else {
                this.emit("motionDetectChange", 1);
            }
        }
        else if (state === 0) {
            if (!this._timer) {
                console.log(new Date() + " motion detector, state transition to off");
                this.emit("motionDetectChange", 0);
            }
        }

    }.bind(this));

    this.getRequest = function (params) {
        return {"motionDetected":this.motionDetected()};
    };

};
util.inherits(MotionDetector, events.EventEmitter);
module.exports = MotionDetector;
