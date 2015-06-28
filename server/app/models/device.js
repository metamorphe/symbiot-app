var mongoose = require('mongoose');
var path = require('path');
var serialPort = require(__dirname + '/../../config/serial.js');

var deviceSchema = new mongoose.Schema({
    address : { type: Number, default : 0 },
    brightness : { type : Number, default: 0 }
});

deviceSchema.methods.updateBrightness = function(brightness) {
    serialPort.write('s' + this.address + ',' + brightness + '\n');
    this.brightness = brightness;
}

module.exports = mongoose.model('Device', deviceSchema);
