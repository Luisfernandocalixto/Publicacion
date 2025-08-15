const md5 = require("md5");
const Comment = require("../models/comment");
const Publication = require("../models/publication");
const { validateComment, validateDataByNote } = require("../repository/NoteRepository");
let success_msg = '';
let error_msg = '';

class NoteController {

    static async notes(req, res) {
        try {
            const currentSession = req.session;
            const { id, name } = currentSession.user;

            const myPublications = await Publication.find(
                { user_id: id }, { description:0 ,likes:0, user_id:0, __v:0 }).sort({ date: 'desc' }).lean();
            
            const publicationsAll = await Publication.find({},
                { description:0 , user_id:0, __v:0 }).sort({ date: 'desc' }).lean().exec();

            
                
            const { success_msg, error_msg } = req.query

           return res.render('components/notes', { 
            publications: myPublications, 
            userAuthenticated: id, 
            publicationsAll, 
            userName: name, 
            success_msg: success_msg,
            error_msg: error_msg });
        } catch (error) {
            
            res.status(500).json({ message: 'error show notes' });
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

            const verify = validateDataByNote({ id : req.params.id})
            if (!verify.success) {
                const message = JSON.parse(verify.error);
                const errors = message.map(err => err.message);
                return  res.redirect(`/notes/?success_msg=&error_msg=${errors}`);
            }
            const publication = await Publication.find({ _id: req.params.id },{ likes:0, user_id:0, date:0, __v:0}).lean();
            
            return  res.render('components/edit-publication', { publication: publication[0], userAuthenticated, success_msg, error_msg });
    
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
        
        const publication = await Publication.findById(req.params.id,{user_id: 0, __v:0}).lean();
        
        
        if (!publication) {
            error_msg = 'publication no found!';
            return  res.redirect(`/notes/?success_msg=&error_msg=${error_msg}`);
            
        }
        
        const comments = await Comment.find({ publication_id: req.params.id }, {_id:0,publication_id: 0,__v:0}).lean();

            const { success_msg, error_msg } = req.query;

           return res.render('components/comment-note', { 
            publication,
             userAuthenticated: id, 
             comments, 
             username: name, 
             userEmail : email, 
             success_msg, 
             error_msg });
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
