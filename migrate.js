require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function migrate() {
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

    const conn = await mysql.createConnection({
        host:     process.env.DB_HOST,
        port:     process.env.DB_PORT || 3306,
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true,
    });

    console.log('Connected to MySQL');

    try {
        await conn.query(sql);
        console.log('Migration completed successfully');
    } finally {
        await conn.end();
    }
}

migrate().catch(err => {
    console.error('Migration failed:', err.message);
    process.exit(1);
});
