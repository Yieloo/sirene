var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Company = require('../models/Company.js');


/* GET /companies/id */
router.get('/id/:id', function(req, res, next) {
    Company.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});


/* GET /companies/siren/:siren */
router.get('/siren/:siren', function(req, res, next) {
    Company.find({SIREN: req.params.siren}, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /companies/siret/:siret */
router.get('/siret/:siret', function(req, res, next) {
  if(req.params.siret.length == 14) {
      var siretsplit = req.params.siret;
      siretsplit = siretsplit.split('');
      var siren = siretsplit[0]+siretsplit[1]+siretsplit[2]+siretsplit[3]+
          siretsplit[4]+siretsplit[5]+siretsplit[6]+siretsplit[7]+siretsplit[8];
      var nic = siretsplit[9]+siretsplit[10]+siretsplit[11]+siretsplit[12]+siretsplit[13];
      Company.find({SIREN: siren, NIC: nic}, function (err, post) {
          if (err) return next(err);
          res.json(post);
      });
  }
   else{
        res.status(400).json({status: 'error', msg: 'Siret mal formé'});
    }
});

/* GET /companies/listofsiren */
router.get('/listofsiren/', function(req, res, next) {
    Company.find({SIREN: {$in: req.query.siren}}, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /companies/name/:name */
router.get('/name/:name', function(req, res, next) {

    var name = req.params.name;
    name = name.toUpperCase();

    Company.find({ L1_NORMALISEE: name }, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /companies/name/autocomplete/:name */
router.get('/name/autocomplete/:name', function(req, res, next) {

     var name = req.params.name;
     name = name.toUpperCase();
     console.log("debut:"+name+":fin");

    Company.find({ L1_NORMALISEE: {$regex: '^'+name}}, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;