var fs = require("fs");
var privateKey = fs.readFileSync('/home/vagrant/.ssh/my-certificate.pem');
module.exports = {
    jwt: {
        expiresInSeconds: 60*10,
        privateKey: privateKey,
        passphrase: '12345',
        algorithm: 'RS256'
    }
}