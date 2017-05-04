var http = require('http');
var csv = require("fast-csv");
var fs = require("fs");
var mongoose = require('mongoose');
var Todo = require('./models/Todo.js');
var Compagny = require('./models/Company.js');


mongoose.connect('mongodb://localhost/dbtest');


var server = http.createServer(function(req, res) {
    res.writeHead(200);
    res.end('Salut tout le monde !');
});


var compteur =0;

var stream = fs.createReadStream("/u/apps/ikzend2/current/todo-app/csv/my1.csv");


csv
    .fromStream(stream, {headers : true, delimiter :';'})
    .on("data", function(data){


        if(data.VMAJ == 'C' ){

        }

        else if(data.VMAJ == 'E'){

        }

        var newCompany = { SIREN: data.SIREN, NIC: data.NIC, L1_NORMALISEE: data.L1_NORMALISEE};

        Compagny.create(newCompany, function (err, post) {
            if (err) return next(err);
            compteur++;
            console.log(compteur);
        });

        //console.log(data);

    })
    .on("end", function(){
        console.log("done");
    });

server.listen(8080); // Démarre le serveur