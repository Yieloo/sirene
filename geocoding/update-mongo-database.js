db.getCollection('new-companies').aggregate(
    [
        { "$addFields": {
            "location" : { type: "Point", coordinates: [ "$longitude", "$latitude" ] }
        }
        },
        { "$out": "new-companies" }
    ]
)

db.getCollection('new-companies').createIndex( { SIREN: 1 } )
db.getCollection('new-companies').createIndex( { L1_NORMALISEE: 1 } )
db.getCollection('new-companies').createIndex( { location : "2dsphere" },{ partialFilterExpression: { latitude: { $exists: true }, longitude: { $exists: true } } } )


db.getCollection('new-companies').renameCollection("companies",true)