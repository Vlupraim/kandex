const { demoUser } = require('../config/demoData');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    if (req.session && req.session.demoMode) {
        req.user = demoUser;
        res.locals.user = demoUser;
        return next();
    }
    res.redirect('/auth/login');
}

module.exports = { ensureAuthenticated };