#! /usr/bin/node

var mongoose = require('mongoose');
mongoose.connect('localhost', 'test');

var fs = require('fs');

var lineList = fs.readFileSync('mytest.csv').toString().split('\n');

lineList.shift(); // Shift the headings off the list of records.

var schemaKeyList = ['RepName', 'OppID', 'OppName', 'PriorAmount', 'Amount'];

var RepOppSchema = new mongoose.Schema({
    RepName: String,
    OppID: String,
    OppName: String,
    PriorAmount: Number,
    Amount: Number
});
var RepOppDoc = mongoose.model('RepOpp', RepOppSchema);

function queryAllEntries () {
    RepOppDoc.aggregate(
        {$group: {_id: '$RepName', oppArray: {$push: {
            OppID: '$OppID',
            OppName: '$OppName',
            PriorAmount: '$PriorAmount',
            Amount: '$Amount'
        }}
        }}, function(err, qDocList) {
            console.log(util.inspect(qDocList, false, 10));
            process.exit(0);
        });
}

// Recursively go through list adding documents.
// (This will overload the stack when lots of entries
// are inserted.  In practice I make heavy use the NodeJS
// "async" module to avoid such situations.)
function createDocRecurse (err) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    if (lineList.length) {
        var line = lineList.shift();
        var doc = new RepOppDoc();
        line.split(',').forEach(function (entry, i) {
            doc[schemaKeyList[i]] = entry;
        });
        doc.save(createDocRecurse);
    } else {
        // After the last entry query to show the result.
        queryAllEntries();
    }
}

createDocRecurse(null);