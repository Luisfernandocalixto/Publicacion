const express = require('express');
const router = express.Router();
const Publication = require('../models/publication.js');
const Comment = require('../models/comment.js');
const md5 = require('md5');
const { isAuthenticated } = require('../helpers/auth.js');



router.get('/notes', isAuthenticated, async (req, res) => {
    try {

        const publications = await Publication.find({ user: req.user.id }).sort({ date: 'desc' }).lean();
        const publicationsAll = await Publication.find().sort({ date: 'desc' }).lean();

        const userAuthenticated = req.user.id;
        const userName = req.user.name;

        // possibles errors
        if (!req.user.id || !userAuthenticated || !userName) {
            req.flash('error_msg', 'Ops! Ocurrió un error');
            res.render('components/allnotes', { publications: publications, userAuthenticated, publicationsAll, userName });
        }
        //

        res.render('components/allnotes', { publications: publications, userAuthenticated, publicationsAll, userName });
    } catch (error) {
        console.error('Error', error);

    }
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    try {

        const { title, description } = req.body;

        const errors = [];
        if (!title) {
            errors.push({ text: 'Por favor escribe un título' })
        }
        if (!description) {
            errors.push({ text: 'Por favor escribe una descripción' })
        }
        if (errors.length > 0) {
            res.render('components/new-publication', { errors, title, description });
        }

        const newPublication = new Publication({ title, description });
        newPublication.user = req.user.id;
        await newPublication.save();
        req.flash('success_msg', 'Publicación realizada');
        res.redirect('/notes');
    } catch (error) {
        console.error('Error', error);

    }
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const userAuthenticated = req.user.id;
        const publication = await Publication.find({ _id: req.params.id }).lean();

        // possibles errors 
        // 

        req.flash('success_msg', 'Publicación actualizada');
        res.render('components/edit-publication', { publication: publication[0], userAuthenticated });
    } catch (error) {
        console.error('Error', error);

    }
});

router.get('/notes/public/:id', isAuthenticated, async (req, res) => {
    try {
        const userAuthenticated = req.user.id;
        const username = req.user.name;
        const userEmail = req.user.email;

        const publication = await Publication.findById(req.params.id).lean();
        if (!publication) {
            return res.status(400).send('Publicacion no encontrada')
        }

        const comments = await Comment.find({ publication_id: req.params.id }).populate().lean();

        req.flash('success_msg', 'Publicación actualizada');
        res.render('components/note-public', { publication, userAuthenticated, comments, username, userEmail });
    } catch (error) {
        console.error('Error', error);

    }
});

router.post('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    try {

        const { title, description } = req.body;
        await Publication.findByIdAndUpdate(req.params.id, { title, description });

        req.flash('success_msg', 'Publicación actualizada con éxito')
        res.redirect('/notes');
    } catch (error) {
        console.error('Error', error);

    }
});

router.post('/notes/:_id/like', isAuthenticated, async (req, res) => {
    try {
        const _id = req.params._id;

        const publication = await Publication.findOne({ _id });

        if (publication) {
            publication.likes = publication.likes + 1;
            await publication.save();
            res.status(200).json({ likes: publication.likes });

        }
        else {
            res.status(500).json({ error: 'Ocurrió un error' });

        }
    } catch (error) {
        console.error('Error', error);

    }

});

router.post('/notes/:id/comment', isAuthenticated, async (req, res) => {
    try {

        const { name, email, comment } = req.body;
        const id = req.params.id;




        const publication = await Publication.findById(id);

        if (publication) {

            const newComment = new Comment(
                {
                    publication_id: publication._id,
                    email: email,
                    name: name,
                    gravatar: md5(email),
                    comment: comment,
                }
            );
            await newComment.save();

            req.flash('success_msg', 'Comentario realizado')
            res.redirect(`/notes/public/${publication._id}`);

        }
        else {
            res.redirect('/');

        }
    } catch (error) {
        console.error('Error', error);

    }

});


router.post('/notes/delete/:id', isAuthenticated, async (req, res) => {
    try {
        req.flash('success_msg', 'Publicación eliminada');
        await Publication.findByIdAndDelete(req.params.id);
        await Comment.deleteMany({ publication_id: req.params.id });
        res.redirect('/notes');

    } catch (error) {
        console.error('Error', error);

    }
});



module.exports = router;