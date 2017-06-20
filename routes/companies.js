var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Company = require('../models/Company.js');
var Naf = require('../models/Naf.js');


/* GET /companies/id */
router.get('/id/:id', function (req, res, next) {

    if(mongoose.Types.ObjectId.isValid(req.params.id)){
        Company.findById(req.params.id, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    }
    else{
        res.status(400).json({status: 'error', msg: 'id mal formé (id doit être du type ObjectId'});
    }

});

/* GET /companies/siren/:siren */
router.get('/siren/:siren', function (req, res, next) {
    if (req.params.siren.length == 9) {
        Company.find({SIREN: req.params.siren}, function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    }
    else {
        res.status(400).json({status: 'error', msg: 'Siren mal formé'});
    }

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
router.get('/name-with-autocomplete', function (req, res, next) {

    var name = req.query.name;
    var ville = req.query.ville;
    var page=req.query.page;
    var pagesize = 10;
    var query = {};


    if(!page){
        page = 1;
    }
    if(name){
        name = name.toUpperCase();
        var regexNomEntreprise = new RegExp("^" + name);
        query['L1_NORMALISEE'] = regexNomEntreprise;

    }
    if(ville){
        ville = ville.toUpperCase();
        var regexVille = new RegExp(ville);
        query['L6_NORMALISEE'] = regexVille;
    }

    console.log(query);

    Company.find(query, function (err, post) {
        if (err) return next(err);
        res.json(post);
    }).skip(pagesize*(page-1)).limit(pagesize);
});


/* GET /companies/coordinates */
router.get('/coordinates', function (req, res, next) {

    var latCenter = parseFloat(req.query.latitude);
    var longCenter = parseFloat(req.query.longitude);
    var distance = parseFloat(req.query.distance);

    var employees = req.query.employe;
    var siren = req.query.siren;
    var siret = req.query.siret;
    var nom = req.query.nom;
    var naf = req.query.naf;

    var query = {};

    if (nom) query['L1_NORMALISEE'] = nom;
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
    if (employees) {
        var listeTrancheEmployee = employees.split(',');
        query['TEFEN'] = { $in: listeTrancheEmployee }
    }

    console.log('*****');
    console.log(query);
    console.log('long'+longCenter);
    console.log('lat'+latCenter);
    console.log('distance'+distance);
    console.log('*****');

    Company.find(query
        , function (err, post) {
            if (err) {
                console.log(err);
                return next(err);
            }
            else {
                console.log('Taille resultat :'+post.length);
                res.json(post);
            }
    }).limit(10000).select({ "location": 1, "L1_NORMALISEE": 1, "L4_NORMALISEE": 1, "L6_NORMALISEE": 1, "SIREN": 1, "NIC": 1});
});

/* GET /companies/listeOfIds */
router.post('/listeOfIds', function (req, res, next) {

    var list = req.body.listIds;
    list = JSON.parse(list);

    var obj_ids = list.ids.map(function(id) { return mongoose.Types.ObjectId(id); });

    Company.find({_id: {$in: obj_ids}}, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});


module.exports = router;