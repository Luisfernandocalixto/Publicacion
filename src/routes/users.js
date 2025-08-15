const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../helpers/auth.js');
const { UserController } = require('../controllers/UserController.js');



router.get('/users/signin', UserController.getSignIn);

router.post('/users/signin', UserController.postSignIn);


router.get('/users/settings', isAuthenticated, UserController.getSettings);

router.post('/users/settings', isAuthenticated, UserController.postSettings);

router.post('/users/settingsGeneral', isAuthenticated, UserController.settingsGeneral);

router.get('/users/forgotEmail', UserController.forgotEmail);

router.post('/users/forgotCheckEmail', UserController.forgotCheckEmail);


router.get('/users/resetPassword/:token', UserController.getResetPassword);

router.post('/users/resetPassword/:token', UserController.postResetPassword);

router.get('/users/signup', UserController.getSignup);

router.post('/users/signup', UserController.postSignup);


router.get('/users/logout', UserController.logout);



module.exports = router;