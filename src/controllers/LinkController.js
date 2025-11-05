const publication = require("../models/publication");

class LinkController {
    static async index(req, res) {
        try {
            const currentSession = req.session;
            const { id } = currentSession.user;


            res.render('./components/home', { userAuthenticated: id });
        } catch (error) {
            return res.status(500).json({ error: 'error show view principal' });
        }
    }
}

module.exports = {
    LinkController
};
