const db = require('../db');

exports.listarEntrenadores = (req, res) => {
  const especialidadFiltro = req.query.especialidad || ''; // Tomamos el valor de especialidad desde la query string (si existe)
  
  // Si se especifica una especialidad, filtramos por ella
  let query = 'SELECT * FROM entrenadores';
  if (especialidadFiltro) {
    query += ' WHERE especialidad = ?';
  }

  db.query(query, especialidadFiltro ? [especialidadFiltro] : [], (err, resultados) => {
    if (err) {
      console.error('Error al obtener los entrenadores:', err);
      return res.status(500).send('Error al obtener los entrenadores');
    }

    // Consultamos las especialidades disponibles para la lista desplegable
    db.query('SELECT DISTINCT especialidad FROM entrenadores', (err, especialidades) => {
      if (err) {
        console.error('Error al obtener especialidades:', err);
        return res.status(500).send('Error al obtener las especialidades');
      }
      
      // Renderizamos la vista, pasando tanto los entrenadores como las especialidades
      res.render('entrenadores/list', { 
        entrenadores: resultados,
        especialidades: especialidades,
        especialidadSeleccionada: especialidadFiltro // Pasamos la especialidad seleccionada para mantenerla en la lista desplegable
      });
    });
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

    const entrenador = results[0];
    // Asegúrate de que fecha_contratacion esté en formato YYYY-MM-DD si existe
    if (entrenador.fecha_contratacion instanceof Date) {
      entrenador.fecha_contratacion = entrenador.fecha_contratacion.toISOString().split('T')[0];
    }

    // Renderiza el formulario de edición con los datos del entrenador
    res.render('entrenadores/edit', { entrenador });
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