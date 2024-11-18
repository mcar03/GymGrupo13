const db = require('../db');

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

exports.mostrarFormularioAgregar = (req, res) => {
  res.render('entrenadores/add');
};

exports.agregarEntrenador = (req, res) => {
  const { nombre, apellido, especialidad, salario } = req.body;

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

exports.mostrarFormularioEditar = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM entrenadores WHERE entrenador_id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al obtener el entrenador para editar:', err);
      return res.status(500).send('Error al obtener el entrenador');
    }

    if (results.length === 0) {
      return res.status(404).send('Entrenador no encontrado');
    }
    res.render('entrenadores/edit', { entrenador: results[0] });
  });
};

exports.editarEntrenador = (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, especialidad, salario } = req.body;

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

exports.mostrarFormularioEliminar = (req, res) => {
  const { id } = req.params;

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