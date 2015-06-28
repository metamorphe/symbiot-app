var SerialPort = require('serialport').SerialPort;
var SERIAL_PORT = '/dev/tty.usbmodem1451';
var BAUDRATE = 19200;
var serialPort = new SerialPort(SERIAL_PORT, {
    baudrate: BAUDRATE
});
serialPort.openSerialPort = function() {
    serialPort.on('open', function() {
        console.log('Serielforbindelse lavet via ' + SERIAL_PORT);
        /* Listen for incoming data */
        // serialPort.on('data', function(data) {
        //    console.log('' + data);
        // });
    });
}

module.exports = serialPort;
