const express = require('express')
const Router= express.Router();
const auth =  require("../controllers/auth")
const adminController  = require('../controllers/adminController')

Router.post('/addAdmin',adminController.addAdmin)
Router.put('/editProfilAdmin/:adminId',adminController.editProfilAmdin)
Router.put('/changePassword/:adminId',adminController.changerPassword)
module.exports = Router