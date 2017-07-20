var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Vehicle = require('./app/models/vehicle');

//configure app for bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Setup port for server to listen on
var port = process.env.PORT || 3000;

//Connect to DB
mongoose.connect('mongodb://test:test@ds159180.mlab.com:59180/creating-node-api');

//Setting up the routes
var router = express.Router();
app.use('/api', router);

//MIDDLEWARE -
router.use(function(req, res, next) {
  console.log('Middleware is Running .... ');
  next();
});

router.route('/vehicles')
  .post(function(req, res) {

    var vehicle = new Vehicle();

    vehicle.make = req.body.make;
    vehicle.model = req.body.model;
    vehicle.color = req.body.color;

    vehicle.save(function(err) {
      if(err){
        res.send(err)
      }
      res.json({message: 'vehicle is successfully saved in the DB'});
    })
  })

  .get(function(req, res) {
    Vehicle.find(function(err, vehicles) {
      if(err)
        res.send(err);
      res.json(vehicles);
    })
  });

router.route('/vehicle/:vehicle_id')
  .get(function(req, res) {
    Vehicle.findById(req.params.vehicle_id, function(err, vehicle) {
      if(err)
        res.send(err);
      res.json(vehicle);
    })
  });

router.route('/vehicle/make/:make')
    .get(function(req, res) {
      Vehicle.find({make: req.params.make}, function(err, vehicle) {
        if(err)
          res.send(err);
        res.json(vehicle);
      })
    });

router.route('/vehicle/color/:color')
    .get(function(req, res) {
      Vehicle.find({color: req.params.color}, function(err, vehicle) {
        if(err)
          res.send(err);
        res.json(vehicle);
      })
    });

//Fire up the server
app.listen(port);
console.log('Server listening to the port : ',port);
