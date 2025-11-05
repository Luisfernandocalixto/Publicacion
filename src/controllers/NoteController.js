const md5 = require("md5");
const Comment = require("../models/comment.js");
const Publication = require("../models/publication.js");
const { validateComment, validateDataByNote } = require("../repository/NoteRepository.js");
const { showDate, timeAgoOfMoment } = require("../helpers/helpers.js");
const { default: mongoose } = require("mongoose");

let success_msg = '';
let error_msg = '';
const ITEMS_PER_PAGE = 15;

class NoteController {

    static async notes(req, res) {
        try {
            const currentSession = req.session;
            const { id, name } = currentSession.user;


            const { success_msg, error_msg } = req.query

            return res.render('components/notes', {
                userAuthenticated: id,
                userName: name,
                success_msg: success_msg,
                error_msg: error_msg,
            });
        } catch (error) {
            
            res.status(500).json({ message: 'error show notes' });
        }

    }

    static async notesOfProfile(req, res) {
        try {
            const currentSession = req.session;
            const { id } = currentSession.user;
            let { page } = req.query;
            if (!page) page = 1;
            const offset = (page - 1) * ITEMS_PER_PAGE;


            const queryMyPublications = await Publication.aggregate([
                {
                    $project: {
                        id: "$_id", date: "$createdAt", title: 1, description: 1, likes: 1, _id: 0, user_id: 1
                    }
                },
                {
                    $match: {
                        user_id: new mongoose.Types.ObjectId(id)
                    }
                }
            ]).skip(offset).limit(ITEMS_PER_PAGE);
            
            const myPublications = queryMyPublications.map(publication => {
                return {
                    id: publication.id,
                    title: publication.title,
                    description: publication.description,
                    likes: publication.likes,
                    date: showDate(publication.date),
                    isDate: timeAgoOfMoment( publication.date)
                }
            });
            
            const queryPages = await Publication.find({user_id: new mongoose.Types.ObjectId(id)}).countDocuments();
            
            const totalPages = Math.ceil(Number(queryPages) / ITEMS_PER_PAGE)

            res.status(200).json({ myPublications, totalPages })
        } catch (error) {
            res.status(500).json({ message: 'error show notes' });
        }

    }
    static async notesAllPublication(req, res) {
        try {
            let { page } = req.query;
            if (!page) page = 1;
            const offset = (page - 1) * ITEMS_PER_PAGE;
            
            
            const queryPublications = await Publication.aggregate([
                {
                    $project: {
                        id: "$_id", date:"$createdAt", title: 1, description: 1, likes: 1,  _id: 0, user_id: 1
                    }
                }
            ]).sort({date: -1}).skip(offset).limit(ITEMS_PER_PAGE);
            
            const publications = queryPublications.map(publication => {
                return {
                    id: publication.id,
                    title: publication.title,
                    description: publication.description,
                    likes: publication.likes,
                    date: showDate(publication.date),
                    isDate: timeAgoOfMoment( publication.date),
                    user_id: publication.user_id
                }
            });
            
            const queryPages = await Publication.countDocuments();
            const totalPages = Math.ceil(Number(queryPages) / ITEMS_PER_PAGE)
            
            res.status(200).json({ publications, totalPages })
        } catch (error) {
            res.status(500).json({ message: 'error show all notes' });
        }
        
    }

    
    
    
    
    
    static async newNote(req, res) {
        try {
            const currentSession = req.session;
            const { id } = currentSession.user;
            const { title, description } = req.body;
            
            const verify = validateDataByNote({ title, description });
            if (!verify.success) {
                const message = JSON.parse(verify.error);
                const errors = message.map(err => err.message);
                return res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${errors}`)
            }
                const newPublication = new Publication({ title, description });
                newPublication.user_id = id;
                await newPublication.save();
                success_msg = 'publication created';
                return res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${error_msg}`)

        } catch (error) {
            res.status(500).json({ message: 'error create note' });
        }
    }

    static async editNote(req, res) {
        try {
            const currentSession = req.session;
            const { id } = currentSession.user;
            const userAuthenticated = id;
            const { success_msg, error_msg } = req.query;

            const verify = validateDataByNote({ id: req.params.id })
            if (!verify.success) {
                const message = JSON.parse(verify.error);
                const errors = message.map(err => err.message);
                return res.redirect(`/notes/?success_msg=&error_msg=${errors}`);
            }
            const publication = await Publication.aggregate([
                {
                    $project: {
                        id: "$_id", title: 1, description: 1

                    }
                },
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(req.params.id)

                    }
                }
            ])

            return res.render('components/edit-publication', {
                publication: { id: publication[0].id, title: publication[0].title, description: publication[0].description },
                userAuthenticated, success_msg, error_msg
            });

        } catch (error) {
            res.status(500).json({ message: 'error edit note' });
        }
    }
    
    static async publicNote(req, res) {
        try {
            const currentSession = req.session;
            const { id, name, email } = currentSession.user;
            
            const verify = validateDataByNote({id : req.params.id})
            if (!verify.success) {
                const message = JSON.parse(verify.error);
                const errors = message.map(err => err.message);
            return  res.redirect(`/notes/?success_msg=&error_msg=${errors}`);
        }           
        
            const publication = await Publication.aggregate([
                {
                    $project: {
                        id: "$_id", title: 1, description: 1, likes: 1
                    }
                }, {
                    $match: {
                        _id: new mongoose.Types.ObjectId(req.params.id)
                    }
                }
            ]);
        
        
        if (!publication) {
            error_msg = 'publication no found!';
            return  res.redirect(`/notes/?success_msg=&error_msg=${error_msg}`);
            
        }
        
            const queryComments = await Comment.aggregate([
                {
                    $project: {
                        _id: 0,
                        publication_id: 1,
                        email: 1,
                        name: 1,
                        gravatar: 1,
                        comment: 1,
                        date: "$createdAt",
                    }
                },
                {
                    $match: {
                        publication_id: new mongoose.Types.ObjectId(req.params.id)
                    }
                }
            ]);
        
            const comments = queryComments.map(comment => {
                return {
                    email: comment.email,
                    name: comment.name,
                    gravatar: comment.gravatar,
                    comment: comment.comment,
                    date: showDate(comment.date),
                    isDate: timeAgoOfMoment(comment.date)
                }
            });
        

            const { success_msg, error_msg } = req.query;

           return res.render('components/comment-note', { 
               publication: {
                   id: publication[0].id,
                   title: publication[0].title,
                   description: publication[0].description,
                   likes: publication[0].likes,
               },
               userAuthenticated: id,
               comments,
               username: name,
               userEmail: email,
               success_msg,
               error_msg
           });
        } catch (error) {
            res.status(500).json({ message: 'error show note' });
        }
    }
    
    static async postEditNote(req, res) {
        try {
            
            const { title, description } = req.body;
            const verify = validateDataByNote({ id : req.params.id, title, description });
            if (!verify.success) {
                const message = JSON.parse(verify.error);
                const errors = message.map(err => err.message);
                return res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${errors}`);
            }
            
            
            await Publication.findByIdAndUpdate(req.params.id, { title, description });
            success_msg = 'publication updated';
            return  res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${error_msg}`);
        } catch (error) {
            res.status(500).json({ message: 'error edit note' });
            
        }
    }
    
    

    
    static async liked(req, res) {
        try {
            
            const verify = validateDataByNote({ id : req.params.id});
            if (!verify.success) {
                const message = JSON.parse(verify.error);
                const errors = message.map(err => err.message);
                return res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${errors}`);
            }            
            
            const publication = await Publication.findOne({ _id: req.params.id });
            
            if (publication) {
                publication.likes = publication.likes + 1;
                await publication.save();
               return res.status(200).json({ likes: publication.likes });
            }
            else {
               return res.status(500).json({ message: 'error liked to note' });
            }
        } catch (error) {                        
           return res.status(500).json({ message: 'error error liked to note' });
        }
    }
    
    static async commented(req, res) {
        try {
            const verifyPublication = validateDataByNote({ id: req.params.id });
            if (!verifyPublication.success) {
                
                const message = JSON.parse(verifyPublication.error);
                const errors = message.map(err => err.message);
                return res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${errors}`);
            }
            
            const { name, email, comment } = req.body;
            
            const verify = validateComment({ name, email, comment });
            if (!verify.success) {
                const message = JSON.parse(verify.error);
                const errors = message.map(err => err.message);
                return res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${errors}`);
            }
            
            
            
            const publication = await Publication.findById(req.params.id);
            
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
                return res.redirect(`/notes/comment/${publication._id}/?success_msg=${success_msg}&error_msg=${error_msg}`);
            }
            else {
                error_msg = 'publication not saved';
                return res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${error_msg}`);
            }
        } catch (error) {   
                     
            res.status(500).json({ message: 'error commented note' });
        }
    }

    static async delete(req, res) {
        try {
            const verify = validateDataByNote({id : req.params.id})
            if (!verify.success) {
                const message = JSON.parse(verify.error);
                const errors = message.map(err => err.message);
                return  res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${errors}`);
            }
                  
            await Publication.findByIdAndDelete(req.params.id);
            await Comment.deleteMany({ publication_id: req.params.id });
            success_msg = 'publication deleted';
           return res.redirect(`/notes/?success_msg=${success_msg}&error_msg=${error_msg}`);
        } catch (error) {
            res.status(500).json({ message: 'Ocurrió un error' });
        }
    }

}

module.exports = {
    NoteController
};
