const express = require('express')
var Router = express.Router()
const image = require('../middleware/image')
var condidatController = require('../controllers/condiadatController')
Router.post('/signup',condidatController.signup)
Router.post('/inscription/:condidatId/formation/:formationId/enroll',condidatController.InscriptioFormation)
Router.get("/getAllInscriptedFomrmation/:condidatId",condidatController.getAllInscriptedFormation)
Router.post('/desinscription/:condidatId/formation/:formationId/enroll',condidatController.DesnscriptioFormation)
Router.post('/forgetpassword',condidatController.forgetPassword)
//Router.get('/confirmation/:token', condidatController.confirmacount);
Router.get('/confirmatoken/:token',condidatController.confirmtoken)
Router.get('/getAllApprenant',condidatController.getAllApprenant);
Router.delete('/deleteApprenant/:condidatId', condidatController.supprimerApprenant);
Router.put('/UpdateProfil/:condidatId',condidatController.editProfilCondiat)
Router.put('changePassword/:condidatId',condidatController.changerPassword)

//------------------------------Authentification------------------------
module.exports = Router