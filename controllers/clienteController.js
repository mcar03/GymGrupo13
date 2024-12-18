const db = require('../db');

// Listado de clientes con membresías para el maestro-detalle
exports.clientes = (req, res) => {
  db.query('SELECT * FROM `clientes`', (err, clientes) => {
    if (err) return res.send('ERROR al hacer la consulta de clientes');

    db.query('SELECT * FROM `membresias`', (err, membresias) => {
      if (err) return res.send('ERROR al hacer la consulta de membresías');
      
      res.render('clientes/list', { clientes, membresias });
    });
  });
};

// Listado filtrado de clientes por tipo de membresía
exports.clientesPorMembresia = (req, res) => {
  const membresiaId = req.params.membresia_id;

  const query = `
    SELECT clientes.* FROM clientes
    JOIN inscripciones_membresias ON clientes.cliente_id = inscripciones_membresias.cliente_id
    WHERE inscripciones_membresias.membresia_id = ?
  `;
  db.query(query, [membresiaId], (err, clientes) => {
    if (err) return res.send('ERROR al hacer la consulta filtrada de clientes');

    db.query('SELECT * FROM `membresias`', (err, membresias) => {
      if (err) return res.send('ERROR al hacer la consulta de membresías');
      
      res.render('clientes/list', { clientes, membresias, selectedMembresia: membresiaId });
    });
  });
};

// Formulario para agregar un nuevo cliente
exports.clienteAddFormulario = (req, res) => {
  res.render('clientes/add');
};

// Agregar un nuevo cliente
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

// Formulario para eliminar un cliente
exports.clienteDelFormulario = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM clientes WHERE cliente_id=?', [id], (error, respuesta) => {
    if (error) return res.send('ERROR al INTENTAR BORRAR EL CLIENTE');
    if (respuesta.length > 0) {
      res.render('clientes/del', { cliente: respuesta[0] });
    } else {
      res.send('ERROR al INTENTAR BORRAR EL CLIENTE, NO EXISTE');
    }
  });
};

// Eliminar un cliente
exports.clienteDel = (req, res) => {
  const { cliente_id } = req.body;
  db.query('DELETE FROM clientes WHERE cliente_id=?', [cliente_id], (error, respuesta) => {
    if (error) return res.send('ERROR BORRANDO CLIENTE');
    if (respuesta.affectedRows === 0) {
      return res.send('No se encontró el cliente para eliminar');
    }
    res.redirect('/clientes');
  });
};

// Formulario para editar un cliente
exports.clienteEditFormulario = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.send('PARÁMETROS INCORRECTOS');

  db.query('SELECT * FROM clientes WHERE cliente_id = ?', [id], (error, respuesta) => {
    if (error) return res.send('ERROR al INTENTAR ACTUALIZAR EL CLIENTE');
    if (respuesta.length > 0) {
      const cliente = respuesta[0];
      // Asegúrate de que fecha_nacimiento esté en formato YYYY-MM-DD
      if (cliente.fecha_nacimiento instanceof Date) {
        cliente.fecha_nacimiento = cliente.fecha_nacimiento.toISOString().split('T')[0];
      }
      res.render('clientes/edit', { cliente });
    } else {
      res.send('ERROR al INTENTAR ACTUALIZAR EL CLIENTE, NO EXISTE');
    }
  });
};


// Actualizar un cliente
exports.clienteEdit = (req, res) => {
  const { cliente_id, nombre, apellidos, telefono, email, direccion, fecha_nacimiento } = req.body;
  db.query('UPDATE `clientes` SET `nombre` = ?, `apellidos` = ?, `telefono` = ?, `email` = ?, `direccion` = ?, `fecha_nacimiento` = ? WHERE `cliente_id` = ?', [nombre, apellidos, telefono, email, direccion, fecha_nacimiento, cliente_id], (error, respuesta) => {
    if (error) return res.send('ERROR ACTUALIZANDO CLIENTE');
    if (respuesta.affectedRows === 0) {
      return res.send('No se encontró el cliente para actualizar');
    }
    res.redirect('/clientes');
  });
};
