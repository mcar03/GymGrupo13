/**
 * Aplicación full-stack gestión académica.
 */

const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const clasesRouter = require('./routes/clasesRouter');
const clientesRouter = require('./routes/clientesRouter');
const entrenadorRouter = require('./routes/entrenadorRouter')
const membresiasRouter = require('./routes/membresiasRouter')
const inscripcionesMembresiasRouter = require('./routes/inscripcionesMembresiasRouter')

<<<<<<< HEAD
require('dotenv').config({ path: './gesaca/.env' });
=======
require('dotenv').config({ path: './gym/.env' });
>>>>>>> 924044bcb5f8bdc71911025a317013171ab8355e

/**
 * Crea el servidor Web
 */
const app = express();
const port = process.env.SERVICE_PORT;
;
/**
 * Configuramos el motor de plantillas 
 * 
 */
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Delegamos todas las rutas que comienzan por alumnos, asignaturas, etc.
 * al enrutador correspondiente
 */
app.use('/clases', clasesRouter);
app.use('/clientes', clientesRouter);
<<<<<<< HEAD
app.use('/entrenador', entrenadorRouter);
app.use('/membresias', membresiasRouter);
app.use('/inscripciones', inscripcionesMembresiasRouter);
=======
app.use('/entrenadores', entrenadorRouter);
app.use('/membresias', membresiasRouter);
app.use('/inscripciones_membresias', inscripcionesMembresiasRouter);
>>>>>>> 924044bcb5f8bdc71911025a317013171ab8355e

app.get('/', (req, res) => {
    res.render('index')
});



/**
 * Siempre lo último que hacemos
 */
app.listen(
    port, () => {
        console.log(`Servidor iniciado en http://localhost:${port}`);
    });

