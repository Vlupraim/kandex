const db = require('../config/db');

class Tarea {
    static async create({ usuario_id, equipo_id, titulo, descripcion, estado, prioridad, fecha_inicio, fecha_limite }) {
        const [result] = await db.promise().query(
            'INSERT INTO tareas (usuario_id, equipo_id, titulo, descripcion, estado, prioridad, fecha_inicio, fecha_limite) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [usuario_id, equipo_id, titulo, descripcion, estado || 'Por realizar', prioridad || 'Media', fecha_inicio, fecha_limite]
        );
        return result.insertId;
    }

    static async findByUser(usuario_id) {
        const [rows] = await db.promise().query(
            'SELECT * FROM tareas WHERE usuario_id = ? ORDER BY estado, posicion',
            [usuario_id]
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.promise().query('SELECT * FROM tareas WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, { titulo, descripcion, estado, prioridad, fecha_inicio, fecha_limite }) {
        let query = 'UPDATE tareas SET titulo = ?, descripcion = ?, estado = ?, prioridad = ?, fecha_inicio = ?, fecha_limite = ?';
        const params = [titulo, descripcion, estado, prioridad, fecha_inicio, fecha_limite];

        if (estado === 'Realizado') {
            query = 'UPDATE tareas SET titulo = ?, descripcion = ?, estado = ?, prioridad = ?, fecha_inicio = ?, fecha_limite = ?, fecha_finalizacion = NOW()';
        }

        await db.promise().query(query + ' WHERE id = ?', [...params, id]);
    }

    static async delete(id) {
        await db.promise().query('DELETE FROM tareas WHERE id = ?', [id]);
    }

    static async updatePosition(id, posicion, estado) {
        await db.promise().query(
            'UPDATE tareas SET posicion = ?, estado = ? WHERE id = ?',
            [posicion, estado, id]
        );
    }
}

module.exports = Tarea;
