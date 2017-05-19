var config = require('../conf/conf.js');
// Chargement de la base MongoDB
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://'+config.mongo.user+':'+config.mongo.password+'@'+config.mongo.host+'/'+config.mongo.database)
    .then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));

var Company = require('../models/Company.js');
var csv = require("fast-csv");

var fs = require("fs");

var args = process.argv.slice(2);
var thepath = args[0];


var compteurModulo=1;
var compteur=0;


var csvStream = csv.createWriteStream({headers: true}),
    writableStream = fs.createWriteStream(thepath+'out1.csv');

csvStream.pipe(writableStream);

var query = {};
var count=0;
var compteurModulo=1;

new Promise(function (resolve, reject) {
    Company.find(query).limit(500000).cursor()
        .on('data', function(doc) {
            csvStream.write({id: doc._id, voie: doc.L4_NORMALISEE, citycode: doc.DEPET+doc.COMET});
            count++;
            if(count%30000 == 0){
                compteurModulo++;
                console.log(count);
                csvStream=null;
                writableStream=null;
                csvStream = csv.createWriteStream({headers: true});
                writableStream = fs.createWriteStream(thepath+'out'+compteurModulo+'.csv');
                csvStream.pipe(writableStream);
            }
        })
        .on('error', reject)
        .on('end', resolve);
}).then(function () {
       console.log('finis');
       csvStream.end();
       mongoose.connection.close();
    });