var config = require('../conf/conf.js');
// Chargement de la base MongoDB
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://'+config.mongo.host+'/'+config.mongo.database)
    .then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));
var Company = require('../models/Company.js');
var fs = require("fs");
var csv = require("fast-csv");



var compteur=0;
var args = process.argv.slice(2);
var theFile = args[0];

var stream = fs.createReadStream(theFile);

csv
    .fromStream(stream, {headers : true, delimiter :','})
    .on("data", function(data){
        if (data.latitude != '' && data.longitude != '') {
            Company.findByIdAndUpdate(data.id, {
                StatusGeo: true,
                location: {type: 'Point', coordinates: [data.longitude, data.latitude]}
            }, function (err, post) {
                if (err) return console.log(err);
            });
        }
        else {
            Company.findByIdAndUpdate(data.id, {StatusGeo: false}, function (err, post) {
                if (err) return console.log(err);
            });
        }
        compteur++;
        if(compteur%10000 == 0){
            console.log("compteur : "+compteur);
            console.log("id : "+data.id);
        }
    })
    .on("end", function(){
        console.log("done");
        mongoose.connection.close();
    });