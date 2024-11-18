const db = require('../db'); // Importamos la conexión a la base de datos
const { validationResult } = require('express-validator');

// Listar todas las clases con información de los entrenadores
exports.listarClases = (req, res) => {
  const query = `
    SELECT clases.clase_id, clases.nombre, clases.descripcion, clases.capacidad, 
           clases.duracion_minutos, clases.fecha_registro, 
           entrenadores.nombre AS entrenador_nombre, 
           entrenadores.apellido AS entrenador_apellido
    FROM clases
    JOIN entrenadores ON clases.entrenador_id = entrenadores.entrenador_id
  `;
  
  db.query(query, (err, resultados) => {
    if (err) {
      console.error('Error al obtener las clases:', err);
      return res.status(500).send('Error al obtener las clases');
    }

    res.render('clases/list', { clases: resultados });
  });
};

// Mostrar el formulario para agregar una nueva clase
exports.mostrarFormularioAgregar = (req, res) => {
  db.query('SELECT * FROM entrenadores', (err, entrenadores) => {
    if (err) {
      console.error('Error al obtener los entrenadores:', err);
      return res.status(500).send('Error al obtener los entrenadores');
    }
    res.render('clases/add', { entrenadores: entrenadores });
  });
};

// Agregar una nueva clase
exports.agregarClase = (req, res) => {
  const { nombre, descripcion, capacidad, duracion_minutos, entrenador_id } = req.body;

  // Validar los datos del formulario
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('clases/add', { errors: errors.array(), entrenadores: req.entrenadores });
  }

  const query = `
    INSERT INTO clases (nombre, descripcion, capacidad, duracion_minutos, entrenador_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(query, [nombre, descripcion, capacidad, duracion_minutos, entrenador_id], (err) => {
    if (err) {
      console.error('Error al agregar la clase:', err);
      return res.status(500).send('Error al agregar la clase');
    }
    res.redirect('/clases');
  });
};

// Mostrar el formulario para editar una clase
exports.mostrarFormularioEditar = (req, res) => {
  const { id } = req.params;

  // Obtener la clase por su ID
  db.query('SELECT * FROM clases WHERE clase_id = ?', [clase_id], (err, claseResults) => {
    if (err) {
      console.error('Error al obtener la clase para editar:', err);
      return res.status(500).send('Error al obtener la clase');
    }

    if (claseResults.length === 0) {
      return res.status(404).send('Clase no encontrada');
    }

    // Obtener la lista de entrenadores
    db.query('SELECT * FROM entrenadores', (err, entrenadores) => {
      if (err) {
        console.error('Error al obtener los entrenadores:', err);
        return res.status(500).send('Error al obtener los entrenadores');
      }

      res.render('clases/edit', { clase: claseResults[0], entrenadores: entrenadores });
    });
  });
};

// Editar una clase
exports.editarClase = (req, res) => {
  const { clase_id } = req.params;
  const { nombre, descripcion, capacidad, duracion_minutos, entrenador_id } = req.body;

  // Validar los datos del formulario
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    return res.render('clases/edit', { errors: errors.array(), clase: req.body, entrenadores: req.entrenadores });

  }

  const query = `
    UPDATE clases 
    SET nombre = ?, descripcion = ?, capacidad = ?, duracion_minutos = ?, entrenador_id = ? 
    WHERE clase_id = ?
  `;
  db.query(query, [nombre, descripcion, capacidad, duracion_minutos, entrenador_id, clase_id], (err) => {
    if (err) {
      console.error('Error al actualizar la clase:', err);
      return res.status(500).send('Error al actualizar la clase');
    }
    res.redirect('/clases');
  });
};

// Mostrar el formulario para eliminar una clase
exports.mostrarFormularioEliminar = (req, res) => {
  const { clase_id } = req.params;
  console.log(clase_id)
  db.query('SELECT * FROM clases WHERE clase_id = ?', [clase_id], (err, results) => {
    if (err) {
      console.error('Error al obtener la clase para eliminar:', err);
      return res.status(500).send('Error al obtener la clase');
    }

    if (results.length === 0) {
      return res.status(404).send('Clase no encontrada');
    }
    res.render('clases/del', { clase: results[0] });
  });
};

// Eliminar una clase
exports.eliminarClase = (req, res) => {
  const { clase_id } = req.params;

  db.query('DELETE FROM clases WHERE clase_id = ?', [clase_id], (err) => {
    if (err) {
      console.error('Error al eliminar la clase:', err);
      return res.status(500).send('Error al eliminar la clase');
    }
    res.redirect('/clases');
  });
};