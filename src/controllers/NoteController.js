const md5 = require("md5");
const Comment = require("../models/comment");
const Publication = require("../models/publication");
const { validateUpdateNote, validateNote, validateComment } = require("../repository/NoteRepository");
let success_msg = '';
let error_msg = '';

class NoteController {

    static async notes(req, res) {
        try {
            const currentSession = req.session;
            const { id, name } = currentSession.user;

            const userAuthenticated = id;
            const userName = name;

            const publications = await Publication.find({ user: id }).sort({ date: 'desc' }).lean();
            const publicationsAll = await Publication.find().sort({ date: 'desc' }).lean();

            const { success_msg, error_msg } = req.query

            res.render('components/allnotes', { publications: publications, userAuthenticated, publicationsAll, userName, success_msg: success_msg, error_msg: error_msg });
        } catch (error) {
            res.status(500).json({ message: 'error' });
        }

    }

    static async newNote(req, res) {
        try {
            const currentSession = req.session;
            const { id } = currentSession.user;
            const { title, description } = req.body;

            const verify = validateNote({ title, description });
            if (!verify.success) {
                const message = JSON.parse(verify.error);
                const errors = message.map(err => err.message);
                return res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${errors}`)
            }

            const newPublication = new Publication({ title, description });
            newPublication.user = id;
            await newPublication.save();
            success_msg = 'publication created';
            return res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${error_msg}`)
        } catch (error) {
            res.status(500).json({ message: 'Ocurrió un error' });
        }
    }

    static async editNote(req, res) {
        try {
            const currentSession = req.session;
            const { id } = currentSession.user;
            const userAuthenticated = id;
            const publication = await Publication.find({ _id: req.params.id }).lean();

            const { success_msg, error_msg } = req.params;


            res.render('components/edit-publication', { publication: publication[0], userAuthenticated, success_msg, error_msg });
        } catch (error) {
            res.status(500).json({ message: 'Ocurrió un error' });
        }
    }

    static async publicNote(req, res) {
        try {
            const currentSession = req.session;
            const { id, name, email } = currentSession.user;
            const userAuthenticated = id;
            const username = name;
            const userEmail = email;

            const publication = await Publication.findById(req.params.id).lean();
            if (!publication) {
                return res.status(400).send('Publicacion no encontrada')
            }

            const comments = await Comment.find({ publication_id: req.params.id }).populate().lean();

            const { success_msg, error_msg } = req.query;

            res.render('components/note-public', { publication, userAuthenticated, comments, username, userEmail , success_msg, error_msg });
        } catch (error) {
            res.status(500).json({ message: 'Ocurrió un error' });
        }
    }

    static async postEditNote(req, res) {
        try {
            if (!req.params.id) {
                error_msg = 'identifier is required';
                return res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${error_msg}`);
            }


            const { title, description } = req.body;
            const verify = validateUpdateNote({ title, description });
            if (!verify.success) {
                const message = JSON.parse(verify.error);
                const errors = message.map(err => err.message);
                return res.redirect(`/notes/edit/${req.params.id}/?success_msg=${success_msg}&error_msg=${errors}`);
            }


            await Publication.findByIdAndUpdate(req.params.id, { title, description });
            success_msg = 'publication updated';
            res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${error_msg}`);
        } catch (error) {
            res.status(500).json({ message: 'error' });
        }
    }




    static async liked(req, res) {
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
    }

    static async commented(req, res) {
        try {
            if (!req.params.id) {
                error_msg = 'identifier is required';
                return res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${error_msg}`);
            }

            const { name, email, comment } = req.body;
            const id = req.params.id;

            const verify = validateComment({ name, email, comment });
            if (!verify.success) {
                const message = JSON.parse(verify.error);
                const errors = message.map(err => err.message);
                return res.redirect(`/notes/public/${id}/?success_msg=${success_msg}&error_msg=${errors}`);
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

                success_msg = 'comment saved';
                return res.redirect(`/notes/public/${publication._id}/?success_msg=${success_msg}&error_msg=${error_msg}`);
            }
            else {
                error_msg = 'publication not saved';
                return res.redirect(`/notes/public/${publication._id}/?success_msg=${success_msg}&error_msg=${error_msg}`);
            }
        } catch (error) {            
            res.status(500).json({ message: 'Ocurrió un error' });
        }
    }

    static async delete(req, res) {
        try {

            if (!req.params.id) {
                error_msg = 'identifier is required';
                res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${error_msg}`)
                return;
            }

            await Publication.findByIdAndDelete(req.params.id);
            await Comment.deleteMany({ publication_id: req.params.id });
            success_msg = 'publication deleted';
            res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${error_msg}`);
        } catch (error) {
            res.status(500).json({ message: 'Ocurrió un error' });
        }
    }

}

module.exports = {
    NoteController
};
