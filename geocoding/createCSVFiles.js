var config = require('../conf/conf.js');
// Chargement de la base MongoDB
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://'+config.mongo.host+'/'+config.mongo.database)
    .then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));

var Company = require('../models/Company.js');
var csvWriter = require('csv-write-stream');
var fs = require("fs");

var args = process.argv.slice(2);
var thepath = args[0];


var compteurModulo=1;
var compteur=0;

var writer = csvWriter({ headers: ["id","voie","postcode","citycode"]});
writer.pipe(fs.createWriteStream(thepath+'out1.csv',{defaultEncoding: 'utf8'}));



Company.find({}).limit(500001).cursor()
    .on('data', function(record){
        if(compteur!= 0 && compteur % 50000 == 0){
            compteurModulo++;
            console.log(compteurModulo);
            console.log(compteur);
            writer.end();
            writer = null;
            writer = csvWriter({ headers: ["id","voie","postcode","citycode"]});
            writer.pipe(fs.createWriteStream(thepath+'out'+compteurModulo+'.csv',{defaultEncoding: 'utf8'}));
        }
        writer.write([record._id,record.L4_NORMALISEE, record.CODPOS, record.DEPET + record.COMET]);
        compteur++;
    })
    .on('error', function(err){
        console.log(err);
    })
    .on('end', function(){
        writer.end();
        mongoose.connection.close();
    });