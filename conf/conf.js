var fs = require("fs");
var privateKey = fs.readFileSync('/home/vagrant/.ssh/my-certificate.pem');
module.exports = {
    jwt: {
        expiresInSeconds: 60*10,
        privateKey: privateKey,
        passphrase: '12345',
        algorithm: 'RS256'
    },
    mongo: {
        database: 'mydb',
        host: 'localhost',
        user: '',
        password: '',
    },
    geocoding:{
        urlApiGouvCSV: 'http://api-adresse.data.gouv.fr/search/csv/'
    }
}