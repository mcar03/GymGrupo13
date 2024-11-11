const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config({ path: './gym/.env' }); // Relative Path: gym\.env

/**
 * Crea el servidor Web
 */

const app = express();
const port = process.env.SERVICE_PORT;


/**
 * Configuramos el motor de plantillas 
 */
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Middleware para llevar la gestión de sesiones.
 * Si no hay sesión iniciada, arrancamos...
 */

app.use(session({
    secret: 'misupersecretoquenadiesabe',
    resave: true,
    saveUninitialized: false
}));


// cargarmos y configuramos el middleware para gestión de sesiones
app.use((req,res,next)=>{
    res.locals.currentUser = req.session.user;
    if (!req.session.user){        
        if (req.path.startsWith('/auth/login') ||
            req.path.startsWith('/auth/register')){
            // para hacer el GET/POST al login
            next();            
        } else {
            // cuando es una ruta distinta a login
            // me redirecciona al login
            return res.redirect('/auth/login');
        }
    } else {
        // ya estamos logeados        
        next();
    }
});

app.use('/auth', authRouter);
app.use('/alumnos', alumnoRouter);
app.use('/asignaturas', asignaturaRouter);


app.get('/', (req, res) => {
    if (req.session.user)
        res.render('index', {user: req.session.user, titulo: 'Inicio'})
    else 
        res.redirect('/login')
});



