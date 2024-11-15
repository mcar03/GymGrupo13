const db = require('../db');

exports.clientes = (req, res) => {
  db.query(
    'SELECT * FROM `clientes`',
    (err, response) => {
      if (err) res.send('ERROR al hacer la consulta');
      else res.render('clientes/list', { clientes: response });
    }
  );
};

exports.clienteAddFormulario = (req, res) => {
  res.render('clientes/add');
};

exports.clienteAdd = (req, res) => {
  const { nombre, apellidos, telefono, email, direccion, fecha_nacimiento } = req.body;
  db.query(
    'INSERT INTO clientes (nombre, apellidos, telefono, email, direccion, fecha_nacimiento) VALUES (?,?,?,?,?,?)',
    [nombre, apellidos, telefono, email, direccion, fecha_nacimiento],
    (error, respuesta) => {
      if (error) res.send('ERROR INSERTANDO CLIENTE' + req.body);
      else res.redirect('/clientes');
    }
  );
};

exports.clienteDelFormulario = (req, res) => {
  const { id } = req.params;
  console.log(id)
  if (isNaN(id)) res.send('PARAMETROS INCORRECTOS');
  else
    db.query(
      'SELECT * FROM clientes WHERE id=?',
      id,
      (error, respuesta) => {
        if (error) res.send('ERROR al INTENTAR BORRAR EL CLIENTE');
        else {
          if (respuesta.length > 0) {
            res.render('clientes/del', { cliente: respuesta[0] });
          } else {
            res.send('ERROR al INTENTAR BORRAR EL CLIENTE, NO EXISTE');
          }
        }
      }
    );
};

exports.clienteDel = (req, res) => {
  const { id, nombre, apellidos } = req.body;
  const paramId = req.params['id'];

  if (isNaN(id) || isNaN(paramId) || id !== paramId) {
    res.send('ERROR BORRANDO');
  } else {
    db.query(
      'DELETE FROM clientes WHERE id=?',
      id,
      (error, respuesta) => {
        if (error) res.send('ERROR BORRANDO CLIENTE' + req.body);
        else res.redirect('/clientes');
      }
    );
  }
};

exports.clienteEditFormulario = (req, res) => {
  const { id } = req.params;
  console.log(id)
  if (isNaN(id)) res.send('PARAMETROS INCORRECTOS');
  else
    db.query(
      'SELECT * FROM clientes WHERE id=?',
      id,
      (error, respuesta) => {
        if (error) res.send('ERROR al INTENTAR ACTUALIZAR EL CLIENTE');
        else {
          if (respuesta.length > 0) {
            res.render('clientes/edit', { cliente: respuesta[0] });
          } else {
            res.send('ERROR al INTENTAR ACTUALIZAR EL CLIENTE, NO EXISTE');
          }
        }
      }
    );
};

exports.clienteEdit = (req, res) => {
  const { id, nombre, apellidos, telefono, email, direccion, fecha_nacimiento } = req.body;
  const paramId = req.params['id'];

  if (isNaN(id) || isNaN(paramId) || id !== paramId) {
    res.send('ERROR ACTUALIZANDO');
  } else {
    db.query(
      'UPDATE `clientes` SET `nombre` = ?, `apellidos` = ?, `telefono` = ?, `email` = ?, `direccion` = ?, `fecha_nacimiento` = ? WHERE `id` = ?',
      [nombre, apellidos, telefono, email, direccion, fecha_nacimiento, id],
      (error, respuesta) => {
        if (error) {
          res.send('ERROR ACTUALIZANDO CLIENTE' + error);
          console.log(error);
        } else res.redirect('/clientes');
      }
    );
  }
};
