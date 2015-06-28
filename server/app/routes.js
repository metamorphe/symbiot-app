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

    app.post('/devices/:address', function(req, res) {
        Device({ address: req.params.address, brightness: 0 })
                .save(function(err) {
                    if (err) res.send(err);
                    console.log("Skabede DEVICE med adresse: "
                                    + req.params.address);
                    res.status(200).end();
                });
    });

    app.post('/devices/:address/:brightness', function(req, res) {
        Device.findOne({address: req.params.address}, function(err, device) {
            device.updateBrightness(req.params.brightness);
            device.save();
            console.log("Lysstyrke ændret til: " + req.params.brightness);
            res.status(200).end();
        })
    });

    app.delete('/devices/:address', function(req, res) {
        Device.findOne({address: req.params.address}, function(err, device) {
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

