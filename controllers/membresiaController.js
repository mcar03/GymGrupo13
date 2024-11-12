const db = require('../db');

exports.membresias = (req, res) => {
  db.query(
    'SELECT * FROM `membresias`',
    (err, response) => {
      if (err) res.send('ERROR al hacer la consulta');
      else res.render('membresias/list', { membresias: response });
    }
  );
};

exports.membresiaAddFormulario = (req, res) => {
  res.render('membresias/add');
};

exports.membresiaAdd = (req, res) => {
  const { tipo, costo, duracion_dias, descripcion } = req.body;
  db.query(
    'INSERT INTO membresias (tipo, costo, duracion_dias, descripcion) VALUES (?,?,?,?)',
    [tipo, costo, duracion_dias, descripcion],
    (error, respuesta) => {
      if (error) res.send('ERROR INSERTANDO MEMBRESÍA' + req.body);
      else res.redirect('/membresias');
    }
  );
};

exports.membresiaDelFormulario = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) res.send('PARAMETROS INCORRECTOS');
  else
    db.query(
      'SELECT * FROM membresias WHERE membresia_id=?',
      id,
      (error, respuesta) => {
        if (error) res.send('ERROR al INTENTAR BORRAR LA MEMBRESÍA');
        else {
          if (respuesta.length > 0) {
            res.render('membresias/del', { membresia: respuesta[0] });
          } else {
            res.send('ERROR al INTENTAR BORRAR LA MEMBRESÍA, NO EXISTE');
          }
        }
      }
    );
};

exports.membresiaDel = (req, res) => {
  const { id, tipo } = req.body;
  const paramId = req.params['id'];

  if (isNaN(id) || isNaN(paramId) || id !== paramId) {
    res.send('ERROR BORRANDO');
  } else {
    db.query(
      'DELETE FROM membresias WHERE membresia_id=?',
      id,
      (error, respuesta) => {
        if (error) res.send('ERROR BORRANDO MEMBRESÍA' + req.body);
        else res.redirect('/membresias');
      }
    );
  }
};

exports.membresiaEditFormulario = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) res.send('PARAMETROS INCORRECTOS');
  else
    db.query(
      'SELECT * FROM membresias WHERE membresia_id=?',
      id,
      (error, respuesta) => {
        if (error) res.send('ERROR al INTENTAR ACTUALIZAR LA MEMBRESÍA');
        else {
          if (respuesta.length > 0) {
            res.render('membresias/edit', { membresia: respuesta[0] });
          } else {
            res.send('ERROR al INTENTAR ACTUALIZAR LA MEMBRESÍA, NO EXISTE');
          }
        }
      }
    );
};

exports.membresiaEdit = (req, res) => {
  const { id, tipo, costo, duracion_dias, descripcion } = req.body;
  const paramId = req.params['id'];

  if (isNaN(id) || isNaN(paramId) || id !== paramId) {
    res.send('ERROR ACTUALIZANDO');
  } else {
    db.query(
      'UPDATE `membresias` SET `tipo` = ?, `costo` = ?, `duracion_dias` = ?, `descripcion` = ? WHERE `membresia_id` = ?',
      [tipo, costo, duracion_dias, descripcion, id],
      (error, respuesta) => {
        if (error) {
          res.send('ERROR ACTUALIZANDO MEMBRESÍA' + error);
          console.log(error);
        } else res.redirect('/membresias');
      }
    );
  }
};
