const Tarea = require('../models/tareaModel');
const Equipo = require('../models/equipoModel');

exports.getTareas = async (req, res) => {
    try {
        const tareas = await Tarea.findByUser(req.user.id);
        res.render('tareas/board', { tareas, user: req.user });
    } catch (err) {
        console.error(err);
        res.render('tareas/board', { tareas: [], user: req.user });
    }
};

exports.getCreate = async (req, res) => {
    try {
        const equipos = await Equipo.findAll();
        res.render('tareas/create', { equipos, user: req.user });
    } catch (err) {
        res.render('tareas/create', { equipos: [], user: req.user });
    }
};

exports.postCreate = async (req, res) => {
    try {
        const { titulo, descripcion, estado, prioridad, equipo_id, fecha_inicio, fecha_limite } = req.body;
        await Tarea.create({
            usuario_id: req.user.id,
            equipo_id: equipo_id || 1,
            titulo,
            descripcion,
            estado: estado || 'Por realizar',
            prioridad: prioridad || 'Media',
            fecha_inicio: fecha_inicio || null,
            fecha_limite: fecha_limite || null,
        });
        res.redirect('/tareas');
    } catch (err) {
        console.error(err);
        res.redirect('/tareas/create');
    }
};

exports.getEdit = async (req, res) => {
    try {
        const tarea = await Tarea.findById(req.params.id);
        if (!tarea) return res.redirect('/tareas');
        res.render('tareas/edit', { tarea, user: req.user });
    } catch (err) {
        console.error(err);
        res.redirect('/tareas');
    }
};

exports.postEdit = async (req, res) => {
    try {
        const { titulo, descripcion, estado, prioridad, fecha_inicio, fecha_limite } = req.body;
        await Tarea.update(req.params.id, { titulo, descripcion, estado, prioridad, fecha_inicio, fecha_limite });
        res.redirect('/tareas');
    } catch (err) {
        console.error(err);
        res.redirect(`/tareas/edit/${req.params.id}`);
    }
};

exports.delete = async (req, res) => {
    try {
        await Tarea.delete(req.params.id);
        res.redirect('/tareas');
    } catch (err) {
        console.error(err);
        res.redirect('/tareas');
    }
};

exports.updatePosition = async (req, res) => {
    try {
        const { id, posicion, estado } = req.body;
        await Tarea.updatePosition(id, posicion, estado);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};
