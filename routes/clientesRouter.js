const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Ruta para obtener todos los clientes
router.get('/', clienteController.clientes);

// Ruta para mostrar el formulario de agregar un nuevo cliente
router.get('/add', clienteController.clienteAddFormulario);

// Ruta para manejar la creación de un nuevo cliente
router.post('/add', clienteController.clienteAdd);

// Ruta para mostrar el formulario de eliminación de un cliente (por id)
router.get('/del/:id', clienteController.clienteDelFormulario);

// Ruta para manejar la eliminación de un cliente (por id)
router.post('/del/:id', clienteController.clienteDel);

// Ruta para mostrar el formulario de edición de un cliente (por id)
router.get('/edit/:id', clienteController.clienteEditFormulario);

// Ruta para manejar la edición de un cliente (por id)
router.post('/edit/:id', clienteController.clienteEdit);

module.exports = router;