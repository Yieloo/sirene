db.getCollection('companies').aggregate(
    [
        { "$addFields": {
            "location" : { type: "Point", coordinates: [ "$longitude", "$latitude" ] }
        }
        },
        { "$out": "companies" }
    ]
)