var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Company = require('../models/Company.js');
//var request = require('request');
//var limit = require("simple-rate-limiter");
//var request = limit(require("request")).to(10).per(1200);
var request = require("request");

var csvWriter = require('csv-write-stream');
var fs = require("fs");
var csv = require("fast-csv");


//var RateLimiter = require('limiter').RateLimiter;
//var request = require('sync-request');
var sleep = require('sleep');

/* GET /companies/id */
router.get('/id/:id', function (req, res, next) {
    Company.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /companies/id */
router.get('/zerf', function (req, res, next) {

    var bulk = Company.collection.initializeOrderedBulkOp();
    var counter = 0;

    Company.collection.find().forEach(function(doc) {
        bulk.find({ "_id": doc._id }).updateOne({
            "$set": {
                "location": {
                    "type": "Point",
                    "coordinates": [ doc.longitude, doc.latitude ]
                }
            },
            "$unset": {  "longitude": 1, "latitude": 1 }
        });

        counter++;
        if ( counter % 1000 == 0 ) {
            bulk.execute();
            bulk = Company.collection.initializeOrderedBulkOp();
        }

    })

    if ( counter % 1000 != 0)
        bulk.execute();

    // var bulk = Company.collection.initializeOrderedBulkOp();
    // var counter = 0;
    //
    // Company.collection.find().forEach(function(doc) {
    //     bulk.find({ "_id": doc._id }).updateOne({
    //         "$set": {
    //             "location": {
    //                 "type": "Point",
    //                 "coordinates": [ doc.longitude, doc.latitude ]
    //             }
    //         },
    //         "$unset": {  "longitude": 1, "latitude": 1 }
    //     });
    //
    //     counter++;
    //     //console.log(counter);
    //     if ( counter % 1000 == 0 ) {
    //         bulk.execute();
    //         bulk = Company.collection.initializeOrderedBulkOp();
    //     }
    //
    // });
    // if ( counter % 1000 == 0 ) {
    //     bulk.execute();
    //     console.log("finis")
    // }





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

/* GET /companies/name/autocomplete/:name */
router.get('/coordinates', function (req, res, next) {

    var latVille = req.query.latitude;
    var longVille = req.query.longitude;

    console.log(latVille);
    console.log(longVille);

    Company.find({loc: {
        $near: {
            $geometry: {
                type: "Point" ,
                coordinates: [longVille, latVille]
            },
            $maxDistance: 1000,
            $minDistance: 0
        }
    }}, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /companies/name/autocomplete/:name */
router.get('/geo', function (req, res, next) {

    console.log('lancement de la geolocalisation');
    var compteur = 0;

    Company.find({StatusGeo: { $exists: false }}, function (err, records) {

        records.forEach(function (record) {

            var options = {
                url: 'http://api-adresse.data.gouv.fr/search/?q=' + record.L3_NORMALISEE + ' ' + record.L4_NORMALISEE + ' ' + record.L5_NORMALISEE + '&postcode=' + record.CODPOS + '&citycode=' + record.DEPET + record.COMET,
                method: 'GET',
                json: true
            };
            request(options, function (error, response, body) {
                if (error) console.log(error);
                else {
                    console.log(response.statusCode);
                    if(response.statusCode == 509 || response.statusCode == 503) {
                        console.log('sleep 5 sec');
                        sleep.sleep(5);
                    }
                    else {
                        if (body.features.length != 0) {
                            var loc = body.features[0].geometry;
                            // var longitude = body.features[0].geometry.coordinates[0];
                            // var latitude = body.features[0].geometry.coordinates[1];
                            console.log(loc);
                            record.loc =  loc;
                            //{ type: "Point", coordinates: [ longitude, latitude ] };
                            record.StatusGeo = true;

                        }
                        else {
                            record.StatusGeo = false;
                        }
                        //record.save();
                        record.save(function (err) {
                            // we've updated the dog into the db here
                            if (err) throw err;
                        });
                        compteur++;
                        console.log(compteur);
                    }
                }
            });

            //
            // Exemple de recherche
            // db.getCollection('companies').find({
            //     loc: {
            //         $near: {
            //             $geometry: {
            //                 type: "Point" ,
            //                 coordinates: [5.36978,43.296482]
            //             },
            //             $maxDistance: 3000,
            //             $minDistance: 0
            //         }
            //     }
            // })



            //
            // var res = request('GET', 'http://api-adresse.data.gouv.fr/search/?q=' + record.L3_NORMALISEE + ' ' + record.L4_NORMALISEE + ' ' + record.L5_NORMALISEE + '&postcode=' + record.CODPOS + '&citycode=' + record.DEPET + record.COMET);
            // var body = JSON.parse(res.getBody('utf8'));
            // //console.log(body);
            //
            // if (body.features.length != 0) {
            //     var longitude = body.features[0].geometry.coordinates[0];
            //     var latitude = body.features[0].geometry.coordinates[1];
            //     record.latitude = latitude;
            //     record.longitude = longitude;
            //     record.StatusGeo = true;
            //     console.log(latitude);
            // }
            // else {
            //     record.StatusGeo = false;
            // }
            // //record.save();
            // record.save();
            // compteur++;
            // console.log(compteur);
            //

        });
    });

    //res.send('ok');

});


/* GET /companies/name/autocomplete/:name */
router.get('/writecsv', function (req, res, next) {
    var compteurModulo=1;
    var compteur=0;

    var writer = csvWriter({ headers: ["id","voie","postcode","citycode"]});
    writer.pipe(fs.createWriteStream('geocoding/csv/out1.csv',{defaultEncoding: 'utf8'}));



    Company.find({}).limit(150001).stream()
        .on('data', function(record){
            if(compteur!= 0 && compteur % 100000 == 0){
                compteurModulo++;
                console.log(compteurModulo);
                console.log(compteur);
                writer.end();
                writer = null;
                writer = csvWriter({ headers: ["id","voie","postcode","citycode"]});
                writer.pipe(fs.createWriteStream('geocoding/csv/out'+compteurModulo+'.csv',{defaultEncoding: 'utf8'}));
            }
            writer.write([record._id,record.L4_NORMALISEE, record.CODPOS, record.DEPET + record.COMET]);
            compteur++;
            // if(compteur == 49999){
            //     console.log(compteur+'id :'+record._id);
            // }
            // if(compteur == 50000){
            //     console.log(compteur+'id :'+record._id);
            // }
            // if(compteur == 50001){
            //     console.log(compteur+'id :'+record._id);
            // }
            // if(compteur == 50002){
            //     console.log(compteur+'id :'+record._id);
            // }
        })
        .on('error', function(err){
            console.log(err);
        })
        .on('end', function(){
            writer.end();
            console.log('fin');
        });

});

/* GET /companies/name/autocomplete/:name */
router.get('/geocsv', function (req, res, next) {

    var compteur=0;

    var formData = {
        colums: 'voie',
        postcode: 'postcode',
        citycode: 'citycode',
        data: fs.createReadStream('/u/apps/sirene/out.csv')
    };
    request.post({url:'http://api-adresse.data.gouv.fr/search/csv/', formData: formData}, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        csv
            .fromString(body, {headers: true})
            .on("data", function(data){
                compteur++;
                console.log(compteur);
            })
            .on("end", function(){
                console.log("done");
            });
    });

});

/* GET /companies/name/autocomplete/:name */
router.get('/testcharspec', function (req, res, next) {

    var TabSpec = {"à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","è":"e","é":"e","ê":"e","ë":"e","ç":"c","ì":"i","í":"i","î":"i","ï":"i","ù":"u","ú":"u","û":"u","ü":"u","ÿ":"y","ñ":"n","-":" ","_":" "};

    function replaceSpec(Texte){
        var reg=/[àáäâèéêëçìíîïòóôõöøùúûüÿñ_-]/gi;
        return Texte.replace(reg,function(){ return TabSpec[arguments[0].toLowerCase()];}).toLowerCase();
    };

    var TestTexte="àAAÀAAÁÂÒÓÔÕÖØòÒÓÔÕ-ÖØòó_ôõöøÈÉÊËèéêëÇçÒÓÔÕÖØòÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ";
    console.log(replaceSpec(TestTexte));

});






module.exports = router;