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