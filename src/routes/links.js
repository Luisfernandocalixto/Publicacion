const express = require('express');
const { isAuthenticated } = require('../helpers/auth');
const router = express.Router();
const Publication = require('../models/publication.js');


router.get('/', isAuthenticated, async (req, res) => {
    try {
        const publicationsAll = await Publication.find().sort({ date: 'desc' }).lean();
        const userAuthenticated = req.user.id;
        res.render('./components/home', { userAuthenticated, publicationsAll });
    } catch (error) {
        console.error('Error', error);

    }
});


module.exports = router;