var mongoose = require('mongoose');
var path = require('path');
var serialPort = require(__dirname + '/../../config/serial.js');

var deviceSchema = new mongoose.Schema({
    _id : {type: Number },
    address : { type: Number, default : 0 },
    brightness : { type : Number, default : 0 },
    x : { type: Number, default : 0 },
    y : { type: Number, default : 0 },
    behavior : { type: String, default : 'toggle' }
});

deviceSchema.methods.update = function(newJson) {
    var oldBrightness = this.brightness;
    if (typeof newJson.address != 'undefined')
        this.address = newJson.address;
    if (typeof newJson.brightness != 'undefined')
        this.brightness = newJson.brightness;
    if (typeof newJson.x != 'undefined')
        this.x = newJson.x || this.x;
    if (typeof newJson.y != 'undefined')
        this.y = newJson.y || this.y;
    /* Finally, send new brightness to physical device */
    if (oldBrightness != this.brightness) {
        this.serialSetBrightness(this.brightness);
    }
    console.log(this.address + ': ' + oldBrightness + ' -> ' + this.brightness);
};

deviceSchema.methods.serialSetBrightness = function(brightness) {
    if (typeof serialPort != 'undefined') {
        serialPort.write('s' + this.address + ',' + this.brightness
                            + '\n');
    }
};

deviceSchema.methods.serialSendVector = function() {
    // Not yet implemented
};

deviceSchema.statics.addressMatchesObj = function (address, json) {
    return json.address == address;
};

deviceSchema.statics.addressAlreadyInUse = function(address) {
    this.findOne({address: address}, function(err, device) {
        return device !== null;
    });
};

module.exports = mongoose.model('Device', deviceSchema);
