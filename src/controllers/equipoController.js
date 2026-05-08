const Equipo = require('../models/equipoModel');
const { demoEquipos } = require('../config/demoData');

const isDemo = (req) => req.session && req.session.demoMode;

exports.index = async (req, res) => {
    if (isDemo(req)) return res.render('equipos/index', { equipos: demoEquipos, user: req.user });
    try {
        const equipos = await Equipo.findAll();
        res.render('equipos/index', { equipos, user: req.user });
    } catch (err) {
        console.error(err);
        res.render('equipos/index', { equipos: [], user: req.user });
    }
};

exports.getCreate = (req, res) => {
    res.render('equipos/create', { user: req.user });
};

exports.postCreate = async (req, res) => {
    if (isDemo(req)) return res.redirect('/equipos');
    try {
        const { nombre_equipo, descripcion } = req.body;
        const equipoId = await Equipo.create({ nombre_equipo, descripcion });
        await Equipo.addUser(equipoId, req.user.id);
        res.redirect('/equipos');
    } catch (err) {
        console.error(err);
        res.redirect('/equipos/create');
    }
};

exports.detail = async (req, res) => {
    if (isDemo(req)) {
        const equipo = demoEquipos.find(e => e.id === parseInt(req.params.id)) || demoEquipos[0];
        return res.render('equipos/detalle', { equipo, usuarios: [], user: req.user });
    }
    try {
        const equipo = await Equipo.findById(req.params.id);
        const usuarios = await Equipo.getUsersByTeam(req.params.id);
        res.render('equipos/detalle', { equipo, usuarios, user: req.user });
    } catch (err) {
        console.error(err);
        res.redirect('/equipos');
    }
};

exports.delete = async (req, res) => {
    if (isDemo(req)) return res.redirect('/equipos');
    try {
        await Equipo.delete(req.params.id);
        res.redirect('/equipos');
    } catch (err) {
        console.error(err);
        res.redirect('/equipos');
    }
};
