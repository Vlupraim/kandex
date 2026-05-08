const db = require('../config/db');
const bcrypt = require('bcryptjs');

class Usuario {
    static async create({ nombre_usuario, email, password, rol }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.promise().query(
            'INSERT INTO usuarios (nombre_usuario, email, password_hash, rol) VALUES (?, ?, ?, ?)',
            [nombre_usuario, email, hashedPassword, rol || 'usuario']
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);
        return rows[0];
    }
}

module.exports = Usuario;
