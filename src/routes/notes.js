const express = require('express');
const router = express.Router();
const Publication = require('../models/publication.js');
const Comment = require('../models/comment.js');
const md5 = require('md5');
const { isAuthenticated } = require('../helpers/auth.js');
const { NoteController } = require('../controllers/NoteController.js');



router.get('/notes', isAuthenticated, NoteController.notes);

router.post('/notes/new-note', isAuthenticated, NoteController.newNote);

router.get('/notes/edit/:id', isAuthenticated, NoteController.editNote);

router.get('/notes/public/:id', isAuthenticated, NoteController.publicNote);

router.post('/notes/edit-note/:id', isAuthenticated, NoteController.postEditNote);

router.post('/notes/:_id/like', isAuthenticated, NoteController.liked);




router.post('/notes/:id/comment', isAuthenticated, NoteController.commented);



router.post('/notes/delete/:id', isAuthenticated, NoteController.delete);



module.exports = router;