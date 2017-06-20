var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');

/* GET / : Page d'accueil effectuant une recherche rapide. */
router.get('/', function (req, res, next) {
    res.render('index', {title: "API de recherche d'entreprise", active: 'recherche'});
});

/* GET / : Page d'accueil effectuant une recherche rapide. */
router.get('/carto', function (req, res, next) {
    res.render('carto', {title: "API de recherche d'entreprise", active: 'recherche'});
});

/* GET /use-api : Page de description de l'API */
router.get('/use-api', function (req, res, next) {
    res.render('api', {title: "Utiliser l'API", active: 'api'});
});

/* GET /qui-sommes-nous : Page de description de l'entreprise Yieloo et de sa solution Intra'Know. */
router.get('/qui-sommes-nous', function (req, res, next) {
    res.render('nous', {title: "Qui sommes-nous ?", active: 'qui-sommes-nous'});
});

/* POST /request-api : Effectue la recherche d'une/plusieurs entreprise(s) en interrogeant l'API */
router.post('/request-api', function (req, res, next) {

    var selectionOfUser = req.body.selectionOfUser;
    var select = req.body.select;
    var jokervalue = req.body.joker;

    var autocomplete =false;

    if(select == 'name' && jokervalue == 'true') autocomplete=true;

    if(autocomplete) var url = 'http://192.168.35.80:3000/companies/' + select + '/autocomplete/' + selectionOfUser;
    else var url = 'http://192.168.35.80:3000/companies/' + select + '/' + selectionOfUser;

    var options = {
        url: url,
        port: 3000,
        method: 'GET',
        json:true
    };

    request(options, function(error, response, body){
        if(error) console.log(error);
        else{
            if(body.length == 1){
                res.redirect('/afficher-une-entreprise/'+body[0]._id);
            }
            else{
                res.render('afficher-entreprises', {
                    title: "Resultat de la recherche",
                    active: 'qui-sommes-nous',
                    companies: body
                });
            }
        }
    });
});

/* GET afficher-une-entreprise/:id : Interroge l'API avec l'id d'une société en paramètre pour obtenir ses informations */
router.get('/afficher-une-entreprise/:id', function (req, res, next) {
    var options = {
        url: 'http://192.168.35.80:3000/companies/id/'+req.params.id,
        port: 3000,
        method: 'GET',
        json:true
    };
    request(options, function(error, response, body){
        if(error) console.log(error);
        if(response.statusCode == 500) res.redirect('/');
        else{
            res.render('afficher-une-entreprise', {
                title: "Resultat de la recherche",
                active: 'qui-sommes-nous',
                company: body
            });
        }
    });
});


module.exports = router;
