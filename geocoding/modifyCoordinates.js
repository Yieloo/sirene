// Chargement de la base MongoDB
var mongoose = require('mongoose');
var config = require('../conf/conf.js');
mongoose.Promise = global.Promise;

if(config.mongo.user != '' && config.mongo.password != '' ){
    mongoose.connect('mongodb://'+config.mongo.user+':'+config.mongo.password+'@'+config.mongo.host+'/'+config.mongo.database)
        .then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));
}
else{
    mongoose.connect('mongodb://'+config.mongo.host+'/'+config.mongo.database)
        .then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));
}

var Company = require('../models/Company.js');

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
    //console.log(counter);
    if ( counter % 1000 == 0 ) {
        bulk.execute();
        bulk = Company.collection.initializeOrderedBulkOp();
    }

});

bulk.execute();