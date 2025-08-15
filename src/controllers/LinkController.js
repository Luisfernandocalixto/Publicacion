const publication = require("../models/publication");


class LinkController {
    static async index(req, res) {
        try {
            const currentSession = req.session;
            const { id } = currentSession.user;
            const publicationsAll = await publication.find({},{ description: 0, user:0, __v:0}).sort({ date: 'desc' }).lean();
            

            return res.render('./components/home', { userAuthenticated: id, publicationsAll });
        } catch (error) {            
           return res.status(500).json({ error: 'error show view principal' });
        }
    }
}

module.exports = {
    LinkController
};
