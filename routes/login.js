var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
config = require('../conf/conf.js');

/* GET login/generateToken */
router.get('/generateToken', function(req, res, next) {

    var authentification = true;



    if(!authentification){
        res.status(401);
        return res.json( {status: 'error', msg: 'Identification failed'} );
    }
    var profile = { username: 'clem', fullName: 'clement.lehuerou', email: 'clem@gmail.com' };
    var token = jwt.sign(profile, { key: config.jwt.privateKey, passphrase: config.jwt.passphrase }, { algorithm: config.jwt.algorithm, expiresIn: config.jwt.expiresInSeconds});
    return res.json( {status: 'ok', token: token} );
});

module.exports = router;
