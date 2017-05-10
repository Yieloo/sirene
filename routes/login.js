var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
config = require('../conf/conf.js');
var User = require('../models/User.js');


/* GET login/generateToken */
router.post('/generateToken', function(req, res, next) {
    User.findOneAndUpdate({'key_api':req.body.key_api, 'secret_api':req.body.secret_api},{$inc: { nombre_token_genere: 1} }, function(err, user) {
        if (err) return next(err);
        else if (!user) {
            res.status(405).json({status: 'error', msg: 'Key and secret are incorrects'});
        } else {
            var profile = { username: user.PRENOM, fullName: user.NOM, email: user.MAIL };
            var token = jwt.sign(profile, { key: config.jwt.privateKey, passphrase: config.jwt.passphrase }, { algorithm: config.jwt.algorithm, expiresIn: config.jwt.expiresInSeconds});
            return res.json( {status: 'OK', token: token} );
        }
    });
});

/* GET login/createUser */
router.post('/createUser', function(req, res, next) {
    User.findOne({'MAIL':req.body.MAIL},function(err, user) {
        if (err) return next(err);
        else if (user) {
            res.status(409).json({status: 'error', msg: 'Un utilisateur est déjà inscrit avec cette adresse mail'});
        } else {
            var key_api = genererUneChaineAleatoire(10);
            var secret_api = genererUneChaineAleatoire(10);
            User.create({'NOM':req.body.NOM, 'PRENOM':req.body.PRENOM, 'PASSWORD':req.body.PASSWORD, 'MAIL':req.body.MAIL, 'key_api':key_api, 'secret_api':secret_api}, function (err, post) {
                if (err) return next(err);
                res.status(200).json({status: 'OK', key_api: key_api, secret_api: secret_api});
            });
        }
    });
});

/* GET login/keys-lost */
router.post('/keys-lost', function(req, res, next) {
    User.findOne({'MAIL':req.body.MAIL, 'PASSWORD':req.body.PASSWORD},function(err, user) {
        if (err) return next(err);
        else if (!user) {
            res.status(404).json({status: 'error', msg: 'Identifiants incorrects'});
        } else {
            res.status(200).json({status: 'OK', key_api: user.key_api, secret_api: user.secret_api});
        }
    });
});

/**
 * Méthode de génération d'une chaine aléatoire suivant une taille
 * @param size la taille de la chaine
 * @returns {string} la chaine générée
 */
function genererUneChaineAleatoire(size) {
    var liste = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9"];
    var result = '';
    for (i = 0; i < size; i++) {
        result += liste[Math.floor(Math.random() * liste.length)];
    }
    return result;
}

module.exports = router;
