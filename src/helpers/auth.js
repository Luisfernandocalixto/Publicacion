const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    try {
        const user = req.session
        if (user.user) {
            return next();
        }
        return res.redirect('/users/signin');
    } catch (error) {        
        return res.redirect('/users/signin');
        
    }
}

helpers.isNotAuthenticated = (req, res, next) => {
    try {
        const user = req.session
        if (!user.user) {
            return next();
        }
        return res.redirect('/notes');
    } catch (error) {
        return res.redirect('/users/signin');

    }
}



module.exports = helpers;