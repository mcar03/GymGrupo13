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

// Ruta para listar todos los entrenadores
router.get('/', (req, res) => {
  db.query('SELECT * FROM entrenadores', (err, results) => {
    if (err) {
      console.error('Error al obtener los entrenadores:', err);
      return res.status(500).send('Error al obtener los entrenadores');
    }
    res.render('list', { entrenadores: results });
  });
});

// Ruta para mostrar el formulario de agregar entrenador
router.get('/add', (req, res) => {
  res.render('add');
});

// Ruta para procesar el formulario de agregar entrenador
router.post('/add', (req, res) => {
  const { nombre, apellido, especialidad, salario, fecha_contratacion } = req.body;

  // Validar los datos del formulario
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('add', { errors: errors.array() });
  }

  // Insertar el nuevo entrenador en la base de datos
  const query = 'INSERT INTO entrenadores (nombre, apellido, especialidad, salario, fecha_contratacion) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nombre, apellido, especialidad, salario, fecha_contratacion || null], (err, results) => {
    if (err) {
      console.error('Error al agregar el entrenador:', err);
      return res.status(500).send('Error al agregar el entrenador');
    }
    res.redirect('/entrenadores');
  });
});

// Ruta para mostrar el formulario de editar entrenador
router.get('/edit/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM entrenadores WHERE entrenador_id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al obtener el entrenador para editar:', err);
      return res.status(500).send('Error al obtener el entrenador');
    }
    if (results.length === 0) {
      return res.status(404).send('Entrenador no encontrado');
    }
    res.render('edit', { entrenador: results[0] });
  });
});

// Ruta para procesar el formulario de editar entrenador
router.post('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, especialidad, salario, fecha_contratacion } = req.body;

  // Validar los datos del formulario
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('edit', { errors: errors.array(), entrenador: req.body });
  }

  // Actualizar el entrenador en la base de datos
  const query = 'UPDATE entrenadores SET nombre = ?, apellido = ?, especialidad = ?, salario = ?, fecha_contratacion = ? WHERE entrenador_id = ?';
  db.query(query, [nombre, apellido, especialidad, salario, fecha_contratacion || null, id], (err, results) => {
    if (err) {
      console.error('Error al actualizar el entrenador:', err);
      return res.status(500).send('Error al actualizar el entrenador');
    }
    res.redirect('/entrenadores');
  });
});

// Ruta para mostrar la confirmación de eliminación de un entrenador
router.get('/delete/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM entrenadores WHERE entrenador_id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al obtener el entrenador para eliminar:', err);
      return res.status(500).send('Error al obtener el entrenador');
    }
    if (results.length === 0) {
      return res.status(404).send('Entrenador no encontrado');
    }
    res.render('del', { entrenador: results[0] });
  });
});

// Ruta para procesar la eliminación de un entrenador
router.post('/delete/:id', (req, res) => {
  const { id } = req.params;

  // Eliminar el entrenador de la base de datos
  db.query('DELETE FROM entrenadores WHERE entrenador_id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar el entrenador:', err);
      return res.status(500).send('Error al eliminar el entrenador');
    }
    res.redirect('/entrenadores');
  });
});

module.exports = router;
