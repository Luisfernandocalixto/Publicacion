const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../helpers/auth.js');
const { NoteController } = require('../controllers/NoteController.js');



router.get('/notes', isAuthenticated, NoteController.notes);

router.get('/notes/publication', isAuthenticated, NoteController.notesOfProfile);

router.get('/notes/publication/all', isAuthenticated, NoteController.notesAllPublication);

router.get('/notes/:id', isAuthenticated, NoteController.editNote);

router.post('/notes', isAuthenticated, NoteController.newNote);

router.put('/notes/:id', isAuthenticated, NoteController.postEditNote);

router.delete('/notes/:id', isAuthenticated, NoteController.delete);

router.get('/notes/comment/:id', isAuthenticated, NoteController.publicNote);

router.post('/notes/comment/:id', isAuthenticated, NoteController.commented);

router.post('/notes/like/:id', isAuthenticated, NoteController.liked);









module.exports = router;