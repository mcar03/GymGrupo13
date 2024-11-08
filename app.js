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

