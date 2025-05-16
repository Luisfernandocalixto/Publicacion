const express = require('express');
const { isAuthenticated } = require('../helpers/auth');
const router = express.Router();
const Publication = require('../models/publication.js');
const { LinkController } = require('../controllers/LinkController.js');


router.get('/', isAuthenticated, LinkController.index);



module.exports = router;