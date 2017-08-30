/**
 * Fichier de configuration de la base MongoDB ainsi que de l'authentification de l'API via jeton JWT.
 */

//Autentification par jeton JWT pas encore mis en place, donc deux lignes suivantes en commentaire
//var fs = require("fs");
//var privateKey = fs.readFileSync('/home/vagrant/.ssh/my-certificate.pem');

module.exports = {
    jwt: {
        expiresInSeconds: 60*10,
        //privateKey: privateKey,
        passphrase: '12345',
        algorithm: 'RS256'
    },
    mongo: {
        database: 'sirene',
        host: 'localhost',
        user: '',
        password: ''
    }
};
