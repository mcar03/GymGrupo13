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

require('dotenv').config({ path: './gesaca/.env' });

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
app.use('/entrenador', entrenadorRouter);
app.use('/membresias', membresiasRouter);
app.use('/inscripciones', inscripcionesMembresiasRouter);

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

