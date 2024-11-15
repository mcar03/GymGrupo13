const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const clasesRouter = require('./routes/clasesRouter');
const clientesRouter = require('./routes/clientesRouter');
const entrenadorRouter = require('./routes/entrenadorRouter');
const membresiasRouter = require('./routes/membresiasRouter');
const inscripcionesMembresiasRouter = require('./routes/inscripcionesMembresiasRouter');
const authRouter = require('./routes/authRouter'); // Ruta de autenticación

require('dotenv').config({ path: './gym/.env' });

const app = express();
const port = process.env.SERVICE_PORT;

// Configuramos el motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de express-session
app.use(session({
    secret: 'secreto', // Secreto para firmar las sesiones
    resave: false,     // No re-salvar sesiones sin cambios
    saveUninitialized: false, // No guardar sesiones vacías
    cookie: { secure: false }  // Cambiar a 'true' si usas HTTPS
}));

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();  // Si está autenticado, sigue al siguiente middleware
    }
    res.redirect('/auth/login');  // Si no está autenticado, redirige al login
}

// Rutas de autenticación
app.use('/auth', authRouter);

// Rutas protegidas (solo accesibles si el usuario está autenticado)
app.use('/clases', isAuthenticated, clasesRouter);
app.use('/clientes', isAuthenticated, clientesRouter);
app.use('/entrenadores', isAuthenticated, entrenadorRouter);
app.use('/membresias', isAuthenticated, membresiasRouter);
app.use('/inscripciones_membresias', isAuthenticated, inscripcionesMembresiasRouter);

// Página de inicio (restringida a usuarios autenticados)
app.get('/', isAuthenticated, (req, res) => {
    res.render('index');  // Esta página solo será accesible si el usuario está autenticado
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
