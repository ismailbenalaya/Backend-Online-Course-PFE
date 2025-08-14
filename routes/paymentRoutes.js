const express = require('express');
var Router = express.Router(); 
const PaymentController = require('../controllers/PaymentController')
 
Router.post('/addPayment/:condidatId/:formationId', PaymentController.addPayment);    // Add a new payment method to the user

Router.get('/getApprenantById/:condidatId',PaymentController.getByIdApprenant) // get Apprenant by id

Router.get('/getAllPaiment',PaymentController.getAllPayment)

module.exports = Router