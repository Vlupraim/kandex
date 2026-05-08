const Tarea = require('../models/tareaModel');

exports.index = async (req, res) => {
    try {
        const tareas = await Tarea.findByUser(req.user.id);
        res.render('dashboard', { tareas, user: req.user });
    } catch (err) {
        console.error('Error cargando tareas:', err);
        res.render('dashboard', { tareas: [], user: req.user });
    }
};
