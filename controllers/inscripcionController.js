const db = require('../db');

exports.inscripcionesMembresias = (req, res) => {
  db.query(
    'SELECT * FROM `inscripciones_membresias`',
    (err, response) => {
      if (err) res.send('ERROR al hacer la consulta');
      else res.render('inscripciones_membresias/list', { inscripcionesMembresias: response });
    }
  );
};

exports.inscripcionMembresiaAddFormulario = (req, res) => {
  res.render('inscripciones_membresias/add');
};

exports.inscripcionMembresiaAdd = (req, res) => {
  const { cliente_id, membresia_id, fecha_fin, estado } = req.body;
  db.query(
    'INSERT INTO inscripciones_membresias (cliente_id, membresia_id, fecha_fin, estado) VALUES (?,?,?,?)',
    [cliente_id, membresia_id, fecha_fin, estado || 'activa'],
    (error, respuesta) => {
      if (error) res.send('ERROR INSERTANDO INSCRIPCIÓN DE MEMBRESÍA' + req.body);
      else res.redirect('/inscripciones_membresias');
    }
  );
};

exports.inscripcionMembresiaDelFormulario = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM inscripciones_membresias WHERE inscripcion_id=?', [id], (error, respuesta) => {
    if (error) return res.send('ERROR al INTENTAR BORRAR LA INSCRIPCIÓN');
    if (respuesta.length > 0) {
      res.render('inscripciones_membresias/del', { inscripcion: respuesta[0] });
    } else {
      res.send('ERROR al INTENTAR BORRAR LA INSCRIPCIÓN, NO EXISTE');
    }
  });
};

exports.inscripcionMembresiaDel = (req, res) => {
  const { inscripcion_id } = req.body;
  db.query('DELETE FROM inscripciones_membresias WHERE inscripcion_id=?', [inscripcion_id], (error, respuesta) => {
    if (error) return res.send('ERROR BORRANDO INSCRIPCIÓN');
    if (respuesta.affectedRows === 0) {
      return res.send('No se encontró la inscripción para eliminar');
    }
    res.redirect('/inscripciones_membresias');
  });
};

exports.inscripcionMembresiaEditFormulario = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM inscripciones_membresias WHERE inscripcion_id = ?', [id], (error, respuesta) => {
    if (error) {
      return res.send('ERROR al INTENTAR ACTUALIZAR LA INSCRIPCIÓN');
    }

    if (respuesta.length > 0) {
      const inscripcion = respuesta[0];
      // Asegúrate de que fecha_fin esté en formato YYYY-MM-DD
      if (inscripcion.fecha_fin instanceof Date) {
        inscripcion.fecha_fin = inscripcion.fecha_fin.toISOString().split('T')[0];
      }

      res.render('inscripciones_membresias/edit', { inscripcion });
    } else {
      res.send('ERROR al INTENTAR ACTUALIZAR LA INSCRIPCIÓN, NO EXISTE');
    }
  });
};



exports.inscripcionMembresiaEdit = (req, res) => {
  const { inscripcion_id, cliente_id, membresia_id, fecha_fin, estado } = req.body;
  db.query('UPDATE `inscripciones_membresias` SET `cliente_id` = ?, `membresia_id` = ?, `fecha_fin` = ?, `estado` = ? WHERE `inscripcion_id` = ?', [cliente_id, membresia_id, fecha_fin, estado, inscripcion_id], (error, respuesta) => {
    if (error) return res.send('ERROR ACTUALIZANDO INSCRIPCIÓN');
    if (respuesta.affectedRows === 0) {
      return res.send('No se encontró la inscripción para actualizar');
    }
    res.redirect('/inscripciones_membresias');
  });
};
