const express = require('express');
var Router = express.Router();
var sessionController  = require('../controllers/sessionController');
Router.post('/addsession/:formationId/:formateurId', sessionController.addSession);
Router.delete('/deleteFormation/:sessionId',sessionController.deleteSession)
Router.get('/getAllSession',sessionController.getAllSession)
Router.get('getbyIdSession/:sessionId',sessionController.getByIdSession)
module.exports = Router
