function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
}

function isRole(allowedRoles) {
    return (req, res, next) => {
        if (allowedRoles.includes(req.session.user.peran)) {
            return next();
        }
        res.status(403).send('Akses ditolak');
    };
}

module.exports = { isAuthenticated, isRole };