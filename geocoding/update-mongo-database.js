var ops = [];
db.getCollection('new-companies').find({latitude: { $exists: true }, longitude: { $exists: true }}).forEach(function (doc) {
    ops.push({
        "updateOne": {
            "update": {
                $set:{"location" : {type: "Point", coordinates: [doc.longitude, doc.latitude]}},
                $unset:{"latitude":1, "longitude":1}
            }
        }
    });

    if (ops.length === 1000 ) {
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