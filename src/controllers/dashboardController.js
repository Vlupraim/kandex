const Tarea = require('../models/tareaModel');
const { demoTareas } = require('../config/demoData');

exports.index = async (req, res) => {
    if (req.session && req.session.demoMode) {
        return res.render('dashboard', { tareas: demoTareas, user: req.user });
    }
    try {
        const tareas = await Tarea.findByUser(req.user.id);
        res.render('dashboard', { tareas, user: req.user });
    } catch (err) {
        console.error(err);
        res.render('dashboard', { tareas: [], user: req.user });
    }
};
