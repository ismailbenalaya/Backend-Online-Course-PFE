var express = require ("express");
var Router = express.Router();
const uploads = require('../middleware/upload')  
const auth = require('../controllers/auth')
var formateurController = require('../controllers/formateurController');
//-------------------------  API -------------------------------
Router.post('/signup',uploads.single('cv'),formateurController.signup);
Router.put('/updateStatue/:email',auth.checkUserRole('admin'),formateurController.updateStatus);
Router.post('/affectation',formateurController.affectationFormationFormateur);
Router.delete('/deleteFormateur/:formateurId',formateurController.supprimerFormateurAccepter)
Router.get('/getFormateur',formateurController.getAllFormateur)
Router.post('/accepterFormateur/:formateurId',formateurController.accepterFormateur)
Router.post('/refuserFormateur/:formateurId',formateurController.refuserFormateur)
Router.post('/archiveForamteur/:formateurId',formateurController.archeveFormateur)
Router.get('/getAllArchiveFormateur',formateurController.getAllFormateurArhive)
Router.get('/getAllFormateurAccepter',formateurController.getAllFormateurAcceepte)
Router.post('/restoreFormateur/:formateurId',formateurController.restoreFromArchive)
Router.delete('/deleteFromArchive/:formateurId',formateurController.deleteFormateurArchive)
Router.put('/updateData/:formateurId',formateurController.editProfilFormateur)
Router.get('/downloadCv/:id',formateurController.downloadCvbyFormateur)
Router.put('/changePassword/:formateurId',formateurController.changerPassword)
Router.post('/UploadCVEdit/:formateurId', uploads.single('cv'), formateurController.updateCv)
Router.get('/getAllAffectedFormation/:formateurId',formateurController.getAllFormationAffected)


module.exports = Router
