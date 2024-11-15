const db = require('../db'); // Importamos la conexión a la base de datos
const { validationResult } = require('express-validator');

// Listar todos los entrenadores
exports.listarEntrenadores = (req, res) => {
  const query = 'SELECT * FROM entrenadores';
  
  db.query(query, (err, resultados) => {
    if (err) {
      console.error('Error al obtener los entrenadores:', err);
      return res.status(500).send('Error al obtener los entrenadores');
    }
    res.render('entrenadores/list', { entrenadores: resultados });
  });
};

// Mostrar el formulario para agregar un nuevo entrenador
exports.mostrarFormularioAgregar = (req, res) => {
  res.render('entrenadores/add');
};

// Agregar un nuevo entrenador
exports.agregarEntrenador = (req, res) => {
  const { nombre, apellido, especialidad, salario } = req.body;

  // Validar los datos del formulario
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('entrenadores/add', { errors: errors.array() });
  }

  const query = `
    INSERT INTO entrenadores (nombre, apellido, especialidad, salario)
    VALUES (?, ?, ?, ?)
  `;
  
  db.query(query, [nombre, apellido, especialidad, salario], (err) => {
    if (err) {
      console.error('Error al agregar el entrenador:', err);
      return res.status(500).send('Error al agregar el entrenador');
    }
    res.redirect('/entrenadores');
  });
};

// Mostrar el formulario para editar un entrenador
exports.mostrarFormularioEditar = (req, res) => {
  const { id } = req.params;

  // Obtener el entrenador por su ID
  db.query('SELECT * FROM entrenadores WHERE entrenador_id = ?', [id], (err, entrenadorResults) => {
    if (err) {
      console.error('Error al obtener el entrenador para editar:', err);
      return res.status(500).send('Error al obtener el entrenador');
    }

    if (entrenadorResults.length === 0) {
      return res.status(404).send('Entrenador no encontrado');
    }

    res.render('entrenadores/edit', { entrenador: entrenadorResults[0] });
  });
};

// Editar un entrenador
exports.editarEntrenador = (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, especialidad, salario } = req.body;

  // Validar los datos del formulario
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('entrenadores/edit', { errors: errors.array(), entrenador: req.body });
  }

  const query = `
    UPDATE entrenadores
    SET nombre = ?, apellido = ?, especialidad = ?, salario = ?
    WHERE entrenador_id = ?
  `;
  
  db.query(query, [nombre, apellido, especialidad, salario, id], (err) => {
    if (err) {
      console.error('Error al actualizar el entrenador:', err);
      return res.status(500).send('Error al actualizar el entrenador');
    }
    res.redirect('/entrenadores');
  });
};

// Mostrar el formulario de eliminación de un entrenador
exports.mostrarFormularioEliminar = (req, res) => {
  const { id } = req.params;

  // Obtener el entrenador por su ID para confirmación
  db.query('SELECT * FROM entrenadores WHERE entrenador_id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al obtener el entrenador para eliminar:', err);
      return res.status(500).send('Error al obtener el entrenador');
    }

    if (results.length === 0) {
      return res.status(404).send('Entrenador no encontrado');
    }
    res.render('entrenadores/del', { entrenador: results[0] });
  });
};

// Eliminar un entrenador
exports.eliminarEntrenador = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM entrenadores WHERE entrenador_id = ?', [id], (err) => {
    if (err) {
      console.error('Error al eliminar el entrenador:', err);
      return res.status(500).send('Error al eliminar el entrenador');
    }
    res.redirect('/entrenadores');
  });
};