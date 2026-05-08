const Tarea = require('../models/tareaModel');
const { demoTareas } = require('../config/demoData');

const isDemo = (req) => req.session && req.session.demoMode;

exports.index = async (req, res) => {
    const tareas = isDemo(req) ? demoTareas : await Tarea.findByUser(req.user.id).catch(() => []);
    const completadas = tareas.filter(t => t.estado === 'Realizado');
    let tiempoPromedio = 0;
    if (completadas.length > 0 && !isDemo(req)) {
        const suma = completadas.reduce((acc, t) => {
            return acc + (new Date(t.fecha_finalizacion) - new Date(t.fecha_creacion)) / (1000 * 60 * 60);
        }, 0);
        tiempoPromedio = (suma / completadas.length).toFixed(1);
    }
    res.render('reportes/index', { tareas, completadas, tiempoPromedio, user: req.user });
};

exports.filtrarPorFecha = async (req, res) => {
    if (isDemo(req)) return res.json({ tareas: [], total: 0 });
    try {
        const { fecha_inicio, fecha_fin } = req.query;
        const tareas = await Tarea.findByUser(req.user.id);
        const filtradas = tareas.filter(t => {
            if (t.estado !== 'Realizado' || !t.fecha_finalizacion) return false;
            const f = new Date(t.fecha_finalizacion);
            return f >= new Date(fecha_inicio) && f <= new Date(fecha_fin);
        });
        res.json({ tareas: filtradas, total: filtradas.length });
    } catch (err) {
        res.status(500).json({ error: 'Error al filtrar' });
    }
};
