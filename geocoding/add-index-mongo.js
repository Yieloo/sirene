db.getCollection('companies').createIndex( { SIREN: 1 } )
db.getCollection('companies').createIndex( { L1_NORMALISEE: 1 } )
db.getCollection('companies').createIndex( { location : "2dsphere" },{ partialFilterExpression: { latitude: { $exists: true }, longitude: { $exists: true } } } )