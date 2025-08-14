const express = require('express');
var Router = express.Router();
var stat = require('../controllers/statController');

Router.get('/getNumberFormation',stat.calculFormation)
Router.get('/getNombreCondidat',stat.calculNombreCondidat)
Router.get('/getNombreFormateur',stat.calculNombreFormateur)
Router.get('/getNombreCategorie',stat.calculNombreCategorie)
Router.get('/getNombreFormateurAccepte',stat.calculNombreFormateurAceepter)
Router.get('/getNombreCondidatFormation/:formationId',stat.calculCondidatForFormation)
module.exports=Router