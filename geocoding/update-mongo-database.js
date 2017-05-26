var ops = [];
db.getCollection('new-companies').find({latitude: { $exists: true }, longitude: { $exists: true }}).forEach(function (doc) {
    ops.push({
        "updateOne": {
            "filter": { "_id": doc._id},
            "update": {
                $set:{"location" : {type: "Point", coordinates: [doc.latitude, doc.longitude]}},
                $unset:{"latitude":1, "longitude":1}
            }
        }
    });

    if (ops.length === 500 ) {
        db.getCollection('new-companies').bulkWrite(ops);
        ops = [];
    }
})

if (ops.length > 0)
    db.getCollection('new-companies').bulkWrite(ops);


db.getCollection('new-companies').createIndex( { SIREN: 1 } )
db.getCollection('new-companies').createIndex( { L1_NORMALISEE: 1 } )
db.getCollection('new-companies').createIndex( { location : "2dsphere" } )


db.getCollection('new-companies').renameCollection("companies",true)