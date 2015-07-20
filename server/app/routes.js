var Device = require('./models/device.js');
var path = require('path');
var db = require(__dirname + '/../config/db');
var mongoose = require('mongoose');

module.exports = function(app) {
    // Server Routes ==================
    app.get('/devices', function(req, res) {
        Device.find(function(err, devices) {
            if (err) res.send(err);
            res.json(devices);
            res.status(200).end();
        });
    });

    app.get('/devices/:address', function(req, res) {
        Device.find({ address: req.params.address }, function (err, device) {
            if (err) res.send(err);
            res.json(device.brightness);
            res.status(200).end();
        });
    });

    app.post('/devices', function(req, res) {
        if (req.body === null) {
            res.send('No device list.').status(400).end();
        } else {
            var json = req.body;
            Object.keys(json).forEach(function(k) {
                console.log(json[k]);
                Device(json[k]).save(function(err, device) {
                    if (err) res.send(err);
                });
            });
            res.json(json);
            res.status(200).end();
        }
    });

    app.post('/devices/:address', function(req, res) {
        /* Did we receive content? If not, fill in an object with address */
        var json = (Object.keys(req.body).length)
                    ? req.body
                    : { address: req.params.address };
        if (!Device.addressMatchesObj(req.params.address, json)) {
            res.send('URL address and JSON do not match')
                     .status(400).end();
        } else if (Device.addressAlreadyInUse(req.params.address)) {
            res.send('Address already in use')
                     .status(400).end();
        } else {
            Device(json)
                .save(function(err, device) {
                    if (err) res.send(err);
                    console.log('Skabede DEVICE med adresse: '                                                         + req.params.address);
                    res.json(device);
                    res.status(200).end();
            });
        }
    });

    app.put('/devices/:address', function(req, res) {
        if (Device.addressAlreadyInUse(req.body.address)) {
            res.send('Address already in use')
                    .status(400).end();
        } else {
            Device.findOne({address: req.params.address}, function(err, device) {
                if (err) res.send(err);
                if (!device) {
                    res.send('No device with address: '
                                + req.params.address).status(400).end();
                } else {
                    device.update(req.body);
                    device.save();
                    res.json(device);
                    res.status(200).end();
                }
            });
        }
    });

    app.delete('/devices/:address', function(req, res) {
        Device.findOne({address: req.params.address}, function(err, device) {
            if (!device) res.send('No device with address: '
                            + req.params.address).status(400).end()
            device.remove(function(err) {
                if (err) res.send(err);
                console.log('Slettede DEVICE med adresse: ' + req.params.address);
                res.status(200).end();
            });
        });
    });

    app.delete('/devices/', function(req, res) {
        mongoose.connection.db.dropCollection('devices', function(err) {
            if (err) res.send(err);
            res.status(200).end();
        });
    });

    // Frontend Routes ===============
    app.get('*', function (req, res) {
        res.sendfile(path.join(__dirname + '/../public/index.html'));
    });
}

