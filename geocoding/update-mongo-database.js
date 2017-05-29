console.log('Modification de la localisation');

var bulk = db.getCollection('new-companies').initializeUnorderedBulkOp(),
    counter = 0;

db.getCollection('new-companies').find({latitude: { $exists: true }, longitude: { $exists: true }}).forEach(function (doc) {
    bulk.find({ "_id": doc._id }).updateOne({
        $set:{"location" : {type: "Point", coordinates: [doc.longitude, doc.latitude]}},
        $unset:{"latitude":1, "longitude":1}
    });
    counter++;
    if (counter % 1000 === 0) {
        // Execute per 1000 operations
        bulk.execute();
        // re-initialize every 500 update statements
        bulk = db.getCollection('new-companies').initializeUnorderedBulkOp();
    }
});
// Clean up remaining queue
if (counter % 1000 !== 0) { bulk.execute(); }


console.log('Ajout des 3 index');
db.getCollection('new-companies').createIndex( { SIREN: 1 } )
db.getCollection('new-companies').createIndex( { L1_NORMALISEE: 1 } )
db.getCollection('new-companies').createIndex( { location : "2dsphere" } )


//db.getCollection('new-companies').renameCollection("companies",true)