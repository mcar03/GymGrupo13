const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const { validationResult } = require('express-validator');

// Crear la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'tu_contraseña',
  database: 'tu_base_de_datos',
});

// Conectar con la base de datos
db.connect(err => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

// Ruta para listar todas las clases
router.get('/', (req, res) => {
  // Consultar clases con la información de los entrenadores
  const query = `
    SELECT clases.clase_id, clases.nombre, clases.descripcion, clases.capacidad, 
           clases.duracion_minutos, clases.fecha_registro, 
           entrenadores.nombre AS entrenador_nombre, 
           entrenadores.apellido AS entrenador_apellido
    FROM clases
    JOIN entrenadores ON clases.entrenador_id = entrenadores.entrenador_id
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener las clases:', err);
      return res.status(500).send('Error al obtener las clases');
    }
    res.render('listClases', { clases: results });
  });
});

// Ruta para mostrar el formulario de agregar clase
router.get('/add', (req, res) => {
  // Obtener todos los entrenadores para el formulario
  db.query('SELECT * FROM entrenadores', (err, entrenadores) => {
    if (err) {
      console.error('Error al obtener los entrenadores:', err);
      return res.status(500).send('Error al obtener los entrenadores');
    }
    res.render('addClase', { entrenadores: entrenadores });
  });
});

// Ruta para procesar el formulario de agregar clase
router.post('/add', (req, res) => {
  const { nombre, descripcion, capacidad, duracion_minutos, entrenador_id } = req.body;

  // Validar los datos del formulario
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('addClase', { errors: errors.array(), entrenadores: req.entrenadores });
  }

  // Insertar la nueva clase en la base de datos
  const query = `
    INSERT INTO clases (nombre, descripcion, capacidad, duracion_minutos, entrenador_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(query, [nombre, descripcion, capacidad, duracion_minutos, entrenador_id], (err, results) => {
    if (err) {
      console.error('Error al agregar la clase:', err);
      return res.status(500).send('Error al agregar la clase');
    }
    res.redirect('/clases');
  });
});

// Ruta para mostrar el formulario de editar clase
router.get('/edit/:id', (req, res) => {
  const { id } = req.params;

  // Obtener la clase y los entrenadores
  const query = `
    SELECT * FROM clases WHERE clase_id = ?
  `;
  
  db.query(query, [id], (err, claseResults) => {
    if (err) {
      console.error('Error al obtener la clase para editar:', err);
      return res.status(500).send('Error al obtener la clase');
    }
    
    if (claseResults.length === 0) {
      return res.status(404).send('Clase no encontrada');
    }

    // Obtener la lista de entrenadores para el formulario
    db.query('SELECT * FROM entrenadores', (err, entrenadores) => {
      if (err) {
        console.error('Error al obtener los entrenadores:', err);
        return res.status(500).send('Error al obtener los entrenadores');
      }

      res.render('editClase', { clase: claseResults[0], entrenadores: entrenadores });
    });
  });
});

// Ruta para procesar el formulario de editar clase
router.post('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, capacidad, duracion_minutos, entrenador_id } = req.body;

  // Validar los datos del formulario
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('editClase', { errors: errors.array(), clase: req.body, entrenadores: req.entrenadores });
  }

  // Actualizar los datos de la clase
  const query = `
    UPDATE clases 
    SET nombre = ?, descripcion = ?, capacidad = ?, duracion_minutos = ?, entrenador_id = ? 
    WHERE clase_id = ?
  `;
  db.query(query, [nombre, descripcion, capacidad, duracion_minutos, entrenador_id, id], (err, results) => {
    if (err) {
      console.error('Error al actualizar la clase:', err);
      return res.status(500).send('Error al actualizar la clase');
    }
    res.redirect('/clases');
  });
});

// Ruta para mostrar la confirmación de eliminación de una clase
router.get('/delete/:id', (req, res) => {
  const { id } = req.params;

  // Obtener la clase para confirmar su eliminación
  db.query('SELECT * FROM clases WHERE clase_id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al obtener la clase para eliminar:', err);
      return res.status(500).send('Error al obtener la clase');
    }
    
    if (results.length === 0) {
      return res.status(404).send('Clase no encontrada');
    }
    res.render('delClase', { clase: results[0] });
  });
});

// Ruta para procesar la eliminación de una clase
router.post('/delete/:id', (req, res) => {
  const { id } = req.params;

  // Eliminar la clase de la base de datos
  db.query('DELETE FROM clases WHERE clase_id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar la clase:', err);
      return res.status(500).send('Error al eliminar la clase');
    }
    res.redirect('/clases');
  });
});

module.exports = router;
