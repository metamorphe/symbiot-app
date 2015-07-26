var SerialPort = require('serialport').SerialPort;
var SERIAL_PORT = '/dev/tty.usbmodem1451';
var BAUDRATE = 19200;
var serialPort = new SerialPort(SERIAL_PORT, {
        baudrate: BAUDRATE
    }, false)

    .on('error', function(err) {
        console.log(err);
    })

    .on('open', function(err) {
        console.log('Serielforbindelse lavet via ' + SERIAL_PORT);
        /* Listen for incoming data */
        // serialPort.on('data', function(data) {
        //    console.log('' + data);
        // });
    });

serialPort.openSerialPort = function() {
    serialPort.open();
};

module.exports = serialPort;
