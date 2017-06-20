var mongoose = require('mongoose');
var CompanySchema = new mongoose.Schema({
    SIREN: String,
    NIC: String,
    L1_NORMALISEE: String,
    L2_NORMALISEE: String,
    L3_NORMALISEE: String,
    L4_NORMALISEE: String,
    L5_NORMALISEE: String,
    L6_NORMALISEE: String,
    CODPOS: String,
    DEPET: String,
    COMET: String,
    latitude: String,
    longitude: String,
    StatusGeo: Boolean,
    location: {},
});

module.exports = mongoose.model('Company', CompanySchema);