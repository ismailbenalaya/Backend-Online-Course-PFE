const express = require('express');
var Router = express.Router();
var categorieController = require('../controllers/categorieController')
Router.post('/addCategorie',categorieController.add)
Router.get('/getCategories',categorieController.getAll)
Router.delete('/supprimerCatgorie/:categorieId',categorieController.supprimerCategorie)
Router.put('/updateCategorie/:categorieId',categorieController.UpdateCategorie)
Router.get('/getByIdCategorie/:categorieId',categorieController.getByidCategorie)
module.exports = Router