var mongoose = require('mongoose');
var CompanySchema = new mongoose.Schema({
    SIREN: String,
    NIC: String,
    L1_NORMALISEE: String,
});

module.exports = mongoose.model('Company', CompanySchema);