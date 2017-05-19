var config = require('../conf/conf.js');
// Chargement de la base MongoDB
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://'+config.mongo.user+':'+config.mongo.password+'@'+config.mongo.host+'/'+config.mongo.database)
    .then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));

var Company = require('../models/Company.js');
var csvWriter = require('csv-write-stream');
var fs = require("fs");

var args = process.argv.slice(2);
var thepath = args[0];



var TabSpec = {"à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","è":"e","é":"e","ê":"e","ë":"e","ç":"c","ì":"i","í":"i","î":"i","ï":"i","ù":"u","ú":"u","û":"u","ü":"u","ÿ":"y","ñ":"n","-":" ","_":" "};

function replaceSpec(Texte){
    var reg=/[àáäâèéêëçìíîïòóôõöøùúûüÿñ_-]/gi;
    return Texte.replace(reg,function(){ return TabSpec[arguments[0].toLowerCase()];}).toLowerCase();
};



var compteurModulo=1;
var compteur=0;

var writer = csvWriter({ headers: ["id","voie","postcode","citycode"]});
writer.pipe(fs.createWriteStream(thepath+'out1.csv'));


Company.find({}).limit(500001).cursor()
    .on('data', function(record){
        if(compteur!= 0 && compteur % 50000 == 0){
            compteurModulo++;
            console.log(compteurModulo);
            console.log(compteur);
            writer.end();
            writer = null;
            writer = csvWriter({ headers: ["id","voie","postcode","citycode"]});
            writer.pipe(fs.createWriteStream(thepath+'out'+compteurModulo+'.csv'));
        }
        if(record._id != '' && record.L4_NORMALISEE != '' && record.CODPOS != '' && record.DEPET!='' && record.COMET != ''){

            var name = replaceSpec(record.L4_NORMALISEE);
            var postcode = replaceSpec(record.CODPOS);
            var depet = replaceSpec(record.DEPET);
            var comet = replaceSpec(record.COMET);

            writer.write([record._id,name,postcode,depet+comet]);
        }
        compteur++;
    })
    .on('error', function(err){
        console.log(err);
    })
    .on('end', function(){
        writer.end();
        mongoose.connection.close();
    });