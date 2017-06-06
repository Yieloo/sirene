var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Company = require('../models/Company.js');
var Naf = require('../models/Naf.js');


/* GET /companies/id */
router.get('/id/:id', function (req, res, next) {
    Company.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /companies/siren/:siren */
router.get('/siren/:siren', function (req, res, next) {
    Company.find({SIREN: req.params.siren}, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /companies/siret/:siret */
router.get('/siret/:siret', function (req, res, next) {
    if (req.params.siret.length == 14) {
        var siretsplit = req.params.siret;
        siretsplit = siretsplit.split('');
        var siren = siretsplit[0] + siretsplit[1] + siretsplit[2] + siretsplit[3] +
            siretsplit[4] + siretsplit[5] + siretsplit[6] + siretsplit[7] + siretsplit[8];
        var nic = siretsplit[9] + siretsplit[10] + siretsplit[11] + siretsplit[12] + siretsplit[13];
        Company.find({SIREN: siren, NIC: nic}, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    }
    else {
        res.status(400).json({status: 'error', msg: 'Siret mal formé'});
    }
});

/* GET /companies/listofsiren */
router.get('/listofsiren/', function (req, res, next) {
    Company.find({SIREN: {$in: req.query.siren}}, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /companies/name/:name */
router.get('/name/:name', function (req, res, next) {

    var name = req.params.name;
    name = name.toUpperCase();

    Company.find({L1_NORMALISEE: name}, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /companies/name/autocomplete/:name */
router.get('/name/autocomplete/:name', function (req, res, next) {

    var name = req.params.name;
    name = name.toUpperCase();

    var regexp = new RegExp("^" + name);
    //var regexTown = new RegExp("RENNES$");
    //Company.find({ $or: [{L1_NORMALISEE: regexp, L6_NORMALISEE: regexTown }, {L1_NORMALISEE: regexp}] }, function (err, post) {

    Company.find({L1_NORMALISEE: regexp}, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /companies/name/autocomplete/:name */
router.get('/name/autocomplete/:name', function (req, res, next) {

    var name = req.params.name;
    name = name.toUpperCase();

    var regexp = new RegExp("^" + name);
    Company.find({L1_NORMALISEE: regexp}, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /companies/coordinates */
router.get('/coordinates', function (req, res, next) {

    var latCenter = parseFloat(req.query.latitude);
    var longCenter = parseFloat(req.query.longitude);
    var distance = parseFloat(req.query.distance);

    var employees = req.query.employe;
    var categorie = req.query.categorie;
    var origine = req.query.origine;
    var siren = req.query.siren;
    var siret = req.query.siret;
    var naf = req.query.naf;
    var siege = req.query.siege;

    var query = {};

    if (siren) query['SIREN'] = siren;
    if (siret){
        query['SIREN'] = '';
        query['NIC'] = '';
        siret = siret.split('');
        for(var i=0; i<siret.length;i++){
            if(i<9){
                query['SIREN']+=siret[i];
            }
            else{
                query['NIC']+=siret[i];
            }
        }

    }

    query['location'] = {
        $near: {
            $geometry: {type: "Point", coordinates: [longCenter, latCenter]},
            $maxDistance: distance,
            $minDistance: 0
        }
    };



    if (naf){
        var listeNaf = naf.split(',');
        query['APEN700'] = { $in: listeNaf };
    }
    if (employees) query['TEFEN'] = employees;
    if (categorie) query['CATEGORIE'] = categorie;
    if (origine) query['ORIGINE'] = origine;
    if (siege) query['SIEGE'] = siege;

    console.log(query);

    Company.find(query
        , function (err, post) {
            if (err) {
                console.log(err);
                return next(err);
            }

            //if(post.length > 1000) res.json('tooLong');
            else {
                console.log('Taille resultat :'+post.length);
                res.json(post);
            }
    }).select({ "location": 1, "L1_NORMALISEE": 1, "L4_NORMALISEE": 1});
});

/* GET /companies/name/autocomplete/:name */
router.post('/listeOfIds', function (req, res, next) {

    var list = req.body.test;
    list = JSON.parse(list);

    var obj_ids = list.key1.map(function(id) { return mongoose.Types.ObjectId(id); });

    Company.find({_id: {$in: obj_ids}}, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});


/* GET /companies/name/autocomplete/:name */
router.get('/codes-naf/autocomplete', function (req, res, next) {

    var libelleNaf = req.query.libelle;
     var regexp = new RegExp(libelleNaf, 'i');

    Naf.find({ $or: [{CodeNAF: regexp}, {Intitule:regexp }]}, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});



module.exports = router;