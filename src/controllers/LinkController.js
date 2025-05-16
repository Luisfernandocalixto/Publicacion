const publication = require("../models/publication");


class LinkController {
    static async index(req, res) {
        try {
            const currentSession = req.session;
            const { id } = currentSession.user;
            const publicationsAll = await publication.find().sort({ date: 'desc' }).lean();
            const userAuthenticated = id;
            res.render('./components/home', { userAuthenticated, publicationsAll });
        } catch (error) {
            res.status(500).json({ error: 'Ocurrió un error' });
        }
    }
}

module.exports = {
    LinkController
};
