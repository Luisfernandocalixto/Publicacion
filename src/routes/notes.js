const express = require('express');
const router = express.Router();
const Publication = require('../models/publication.js');
const Comment = require('../models/comment.js');
const md5 = require('md5');
const { isAuthenticated } = require('../helpers/auth.js');



router.get('/notes', isAuthenticated, async (req, res) => {
    try {
        const userAuthenticated = req.user.id;
        const userName = req.user.name;

        // possibles errors
        if (!req.user.id || !userAuthenticated || !userName) {
            res.redirect('/users/signin');
            return;
        }

        const publications = await Publication.find({ user: req.user.id }).sort({ date: 'desc' }).lean();
        const publicationsAll = await Publication.find().sort({ date: 'desc' }).lean();

        res.render('components/allnotes', { publications: publications, userAuthenticated, publicationsAll, userName });
    } catch (error) {
        res.status(500).json({ message: 'Ocurrió un error' });
    }

});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || title.trim() === "") {
            req.flash('error_msg', 'Por favor escribe un título')
            res.redirect('/notes')
            return
        }
        if (!description || description.trim() === "") {
            req.flash('error_msg', 'Por favor escribe una descripción')
            res.redirect('/notes')
            return
        }

        const newPublication = new Publication({ title, description });
        newPublication.user = req.user.id;
        await newPublication.save();
        req.flash('success_msg', 'Publicación realizada');
        res.redirect('/notes');
    } catch (error) {
        res.status(500).json({ message: 'Ocurrió un error' });
    }
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const userAuthenticated = req.user.id;
        const publication = await Publication.find({ _id: req.params.id }).lean();

        res.render('components/edit-publication', { publication: publication[0], userAuthenticated });
    } catch (error) {
        res.status(500).json({ message: 'Ocurrió un error' });
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

        res.render('components/note-public', { publication, userAuthenticated, comments, username, userEmail });
    } catch (error) {
        res.status(500).json({ message: 'Ocurrió un error' });
    }
});

router.post('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    try {
        if (!req.params.id) {
            res.redirect('/notes')
            return;
        }


        const { title, description } = req.body;
        if (!title || title.trim() === "") {
            req.flash('error_msg', 'Por favor escribe un título');
            res.redirect(`/notes/edit/${req.params.id}`);
            return
        }
        if (!description || description.trim() === "") {
            req.flash('error_msg', 'Por favor escribe una descripción');
            res.redirect(`/notes/edit/${req.params.id}`);
            return
        }

        await Publication.findByIdAndUpdate(req.params.id, { title, description });
        req.flash('success_msg', 'Publicación actualizada con éxito')
        res.redirect('/notes');
    } catch (error) {
        res.status(500).json({ message: 'Ocurrió un error' });

    }
});

router.post('/notes/:_id/like', isAuthenticated, async (req, res) => {
    try {
        if (!req.params._id) {
            res.redirect('/notes')
            return;
        }


        const _id = req.params._id;
        const publication = await Publication.findOne({ _id });

        if (publication) {
            publication.likes = publication.likes + 1;
            await publication.save();
            res.status(200).json({ likes: publication.likes });
        }
        else {
            res.status(500).json({ message: 'Ocurrió un error' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Ocurrió un error' });
    }
});




router.post('/notes/:id/comment', isAuthenticated, async (req, res) => {
    try {
        if (!req.params.id) {
            res.redirect('/notes')
            return;
        }

        const { name, email, comment } = req.body;
        const id = req.params.id;

        if (!name || !email || !comment || name.trim() === "" || email.trim() === "" || comment.trim() === "") {
            req.flash('error_msg', 'Debes agregar un comentario');
            res.redirect(`/notes/public/${id}`);
            return;
        }



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

            req.flash('success_msg', 'Comentario realizado');
            res.redirect(`/notes/public/${publication._id}`);
            return;
        }
        else {
            res.redirect('/');
            return;
        }
    } catch (error) {
        res.status(500).json({ message: 'Ocurrió un error' });
    }
});



router.post('/notes/delete/:id', isAuthenticated, async (req, res) => {
    try {

        if (!req.params.id) {
            res.redirect('/notes')
            return;
        }

        await Publication.findByIdAndDelete(req.params.id);
        await Comment.deleteMany({ publication_id: req.params.id });
        req.flash('success_msg', 'Publicación eliminada');
        res.redirect('/notes');
    } catch (error) {
        res.status(500).json({ message: 'Ocurrió un error' });
    }
});



module.exports = router;