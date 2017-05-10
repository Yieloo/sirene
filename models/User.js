var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    NOM: String,
    PRENOM: String,
    MAIL: String,
    PASSWORD: String,
    key_api: String,
    secret_api: String,
    nombre_token_genere: Number,
});

module.exports = mongoose.model('User', UserSchema);