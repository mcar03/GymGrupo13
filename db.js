const mysql = require('mysql2'); 
<<<<<<< HEAD
const bcrypt = require('bcrypt');

require('dotenv').config({ path: 'gym/.env' }); 
=======
require('dotenv').config({ path: 'gesaca/.env' }); 
>>>>>>> 7b2fae91398405e2ac15ecfaf1bbe4a157bb7d58

/**
 * Conectamos a la base de datos
 */
const db = mysql.createConnection({
    host:       process.env.MYSQL_HOST,
    port:       process.env.MYSQL_PORT,
    user:       process.env.MYSQL_USERNAME,
    password:   process.env.MYSQL_ROOT_PASSWORD,
    database:   process.env.MYSQL_DATABASE,
  });

db.connect(err => {
    if (err) {
      console.error(
        'Error al conectar a MySQL:', err);
      return;
    }
    console.log('Conexión exitosa a MySQL');
  });

<<<<<<< HEAD
module.exports=db;
=======
  module.exports=db;
>>>>>>> 7b2fae91398405e2ac15ecfaf1bbe4a157bb7d58
