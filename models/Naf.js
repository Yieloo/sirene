var mongoose = require('mongoose');
var NafSchema = new mongoose.Schema({
    CodeNAF: String,
    Intitule: String
}, { collection: 'codesNaf' });

module.exports = mongoose.model('Naf', NafSchema);