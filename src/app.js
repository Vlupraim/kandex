require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const path = require('path');
const ejs = require('ejs');

const app = express();

const VIEWS = path.join(__dirname, 'views');

app.set('view engine', 'ejs');
app.set('views', VIEWS);

// Inject user into res.locals globally
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Layout middleware — supports opts.layout override
app.use((req, res, next) => {
    res.render = function (view, locals, cb) {
        if (typeof locals === 'function') { cb = locals; locals = {}; }
        const opts = Object.assign({}, res.locals, locals || {});
        const layoutName = ('layout' in opts) ? opts.layout : 'layouts/main';
        const viewPath = path.join(VIEWS, view + '.ejs');

        ejs.renderFile(viewPath, opts, (err, body) => {
            if (err) return next(err);
            if (!layoutName) {
                return cb ? cb(null, body) : res.send(body);
            }
            const layoutPath = path.join(VIEWS, layoutName + '.ejs');
            ejs.renderFile(layoutPath, Object.assign({}, opts, { body }), (err, html) => {
                if (err) return next(err);
                return cb ? cb(null, html) : res.send(html);
            });
        });
    };
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'kandex_secret',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Keep res.locals.user in sync after passport populates req.user
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

const authRoutes      = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const tareaRoutes     = require('./routes/tareaRoutes');
const equipoRoutes    = require('./routes/equipoRoutes');
const reporteRoutes   = require('./routes/reporteRoutes');

app.use('/auth',      authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/tareas',    tareaRoutes);
app.use('/equipos',   equipoRoutes);
app.use('/reportes',  reporteRoutes);

app.get('/', (req, res) => {
    res.redirect(req.isAuthenticated() ? '/tareas' : '/auth/login');
});

// ── DEMO MODE (sin DB) ────────────────────────────
const demoUser  = { id: 0, nombre_usuario: 'Demo User', email: 'demo@kandex.com', rol: 'admin' };
const demoTareas = [
    { id: 1, titulo: 'Diseñar wireframes',         descripcion: 'Prototipos de las pantallas principales.',      estado: 'Por realizar', prioridad: 'Alta',    fecha_limite: '2026-05-20' },
    { id: 2, titulo: 'Configurar CI/CD',            descripcion: 'Pipeline con GitHub Actions.',                   estado: 'Por realizar', prioridad: 'Media',   fecha_limite: null },
    { id: 3, titulo: 'API de autenticación',        descripcion: 'Login con JWT y refresh tokens.',                estado: 'En progreso',  prioridad: 'Urgente', fecha_limite: '2026-05-12' },
    { id: 4, titulo: 'Módulo de reportes',          descripcion: 'Gráficas de progreso por equipo.',              estado: 'En progreso',  prioridad: 'Media',   fecha_limite: '2026-05-18' },
    { id: 5, titulo: 'Revisión de diseño',          descripcion: 'Code review del sistema de componentes.',        estado: 'En revisión',  prioridad: 'Alta',    fecha_limite: '2026-05-10' },
    { id: 6, titulo: 'Setup del proyecto',          descripcion: 'Express, EJS y estructura MVC inicial.',        estado: 'Realizado',    prioridad: 'Baja',    fecha_limite: '2026-04-30' },
    { id: 7, titulo: 'Schema MySQL',               descripcion: 'Diseño del esquema y migraciones.',              estado: 'Realizado',    prioridad: 'Alta',    fecha_limite: '2026-04-28' },
];

app.get('/demo', (req, res) => {
    res.locals.user = demoUser;
    res.render('tareas/board', { tareas: demoTareas, user: demoUser });
});

app.get('/demo/dashboard', (req, res) => {
    res.locals.user = demoUser;
    res.render('dashboard', { tareas: demoTareas, user: demoUser });
});

// 404
app.use((req, res) => {
    res.status(404).send(`
        <body style="font-family:monospace;padding:40px;background:#faf8f4;color:#1a1a1a">
        <h2 style="color:#b07f2b">404 — Página no encontrada</h2>
        <p>${req.method} ${req.path}</p>
        <a href="/" style="color:#3a6e9c">← Volver al inicio</a>
        </body>`);
});

// 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`
        <body style="font-family:monospace;padding:40px;background:#faf8f4;color:#1a1a1a">
        <h2 style="color:#c25e58">500 — Error del servidor</h2>
        <pre style="background:#f5d9d6;padding:16px;border-radius:8px;font-size:13px;overflow:auto">${err.message}\n\n${err.stack}</pre>
        <a href="/" style="color:#3a6e9c">← Volver al inicio</a>
        </body>`);
});

module.exports = app;
