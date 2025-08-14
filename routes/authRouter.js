const express = require('express');
var Router = express.Router();
var authController = require('../controllers/auth')
Router.post('/signIn',authController.signIn);
Router.post('/siginAdmin',authController.signInAdmin)
Router.post('/forget-password',authController.forgetPassword)
Router.post('/reset-password/:token',authController.resetPassword)
module.exports = Router