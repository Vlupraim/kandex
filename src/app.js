const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const path = require('path');
const ejs = require('ejs');

const app = express();

const VIEWS = path.join(__dirname, 'views');
const LAYOUT = path.join(VIEWS, 'layouts', 'main.ejs');

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', VIEWS);

// Layout middleware
app.use((req, res, next) => {
    res.render = function (view, locals, cb) {
        if (typeof locals === 'function') { cb = locals; locals = {}; }
        const opts = Object.assign({}, res.locals, locals || {});
        const viewPath = path.join(VIEWS, view + '.ejs');
        ejs.renderFile(viewPath, opts, (err, body) => {
            if (err) return next(err);
            ejs.renderFile(LAYOUT, Object.assign({}, opts, { body }), (err, html) => {
                if (err) return next(err);
                if (cb) return cb(null, html);
                res.send(html);
            });
        });
    };
    next();
});

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sesiones
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const tareaRoutes = require('./routes/tareaRoutes');
const equipoRoutes = require('./routes/equipoRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
// Agregar más rutas aquí

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/tareas', tareaRoutes);
app.use('/equipos', equipoRoutes);
app.use('/reportes', reporteRoutes);
// Agregar más rutas

// Ruta raíz
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/auth/login');
    }
});

// Ruta temporal para ver dashboard sin login
app.get('/demo', (req, res) => {
    const tareasEjemplo = [
        { id: 1, titulo: 'Tarea de ejemplo 1', descripcion: 'Descripción 1', estado: 'Por realizar', prioridad: 'Media' },
        { id: 2, titulo: 'Tarea de ejemplo 2', descripcion: 'Descripción 2', estado: 'En proceso', prioridad: 'Alta' },
        { id: 3, titulo: 'Tarea de ejemplo 3', descripcion: 'Descripción 3', estado: 'Realizado', prioridad: 'Baja' }
    ];
    res.render('dashboard', { tareas: tareasEjemplo, user: { nombre_usuario: 'Demo' } });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;