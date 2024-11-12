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
  if (isNaN(id)) res.send('PARAMETROS INCORRECTOS');
  else
    db.query(
      'SELECT * FROM inscripciones_membresias WHERE inscripcion_id=?',
      id,
      (error, respuesta) => {
        if (error) res.send('ERROR al INTENTAR BORRAR LA INSCRIPCIÓN');
        else {
          if (respuesta.length > 0) {
            res.render('inscripciones_membresias/del', { inscripcionMembresia: respuesta[0] });
          } else {
            res.send('ERROR al INTENTAR BORRAR LA INSCRIPCIÓN, NO EXISTE');
          }
        }
      }
    );
};

exports.inscripcionMembresiaDel = (req, res) => {
  const { id } = req.body;
  const paramId = req.params['id'];

  if (isNaN(id) || isNaN(paramId) || id !== paramId) {
    res.send('ERROR BORRANDO');
  } else {
    db.query(
      'DELETE FROM inscripciones_membresias WHERE inscripcion_id=?',
      id,
      (error, respuesta) => {
        if (error) res.send('ERROR BORRANDO INSCRIPCIÓN' + req.body);
        else res.redirect('/inscripciones_membresias');
      }
    );
  }
};

exports.inscripcionMembresiaEditFormulario = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) res.send('PARAMETROS INCORRECTOS');
  else
    db.query(
      'SELECT * FROM inscripciones_membresias WHERE inscripcion_id=?',
      id,
      (error, respuesta) => {
        if (error) res.send('ERROR al INTENTAR ACTUALIZAR LA INSCRIPCIÓN');
        else {
          if (respuesta.length > 0) {
            res.render('inscripciones_membresias/edit', { inscripcionMembresia: respuesta[0] });
          } else {
            res.send('ERROR al INTENTAR ACTUALIZAR LA INSCRIPCIÓN, NO EXISTE');
          }
        }
      }
    );
};

exports.inscripcionMembresiaEdit = (req, res) => {
  const { id, cliente_id, membresia_id, fecha_fin, estado } = req.body;
  const paramId = req.params['id'];

  if (isNaN(id) || isNaN(paramId) || id !== paramId) {
    res.send('ERROR ACTUALIZANDO');
  } else {
    db.query(
      'UPDATE `inscripciones_membresias` SET `cliente_id` = ?, `membresia_id` = ?, `fecha_fin` = ?, `estado` = ? WHERE `inscripcion_id` = ?',
      [cliente_id, membresia_id, fecha_fin, estado, id],
      (error, respuesta) => {
        if (error) {
          res.send('ERROR ACTUALIZANDO INSCRIPCIÓN' + error);
          console.log(error);
        } else res.redirect('/inscripciones_membresias');
      }
    );
  }
};
