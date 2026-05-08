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

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`<pre style="font-family:monospace;padding:24px;color:#c25e58">${err.message}</pre>`);
});

module.exports = app;
