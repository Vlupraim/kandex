const Usuario = require('../models/usuarioModel');
const passport = require('../config/passport');

exports.getLogin = (req, res) => {
    res.render('auth/login', { layout: 'layouts/auth' });
};

exports.postLogin = passport.authenticate('local', {
    successRedirect: '/tareas',
    failureRedirect: '/auth/login',
});

exports.getRegister = (req, res) => {
    res.render('auth/register', { layout: 'layouts/auth' });
};

exports.postRegister = async (req, res) => {
    try {
        const { nombre_usuario, email, password } = req.body;
        await Usuario.create({ nombre_usuario, email, password, rol: 'usuario' });
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.redirect('/auth/register');
    }
};

exports.logout = (req, res) => {
    req.logout(() => res.redirect('/auth/login'));
};
