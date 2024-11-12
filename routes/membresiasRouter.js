const express = require('express');
const router = express.Router();
const membresiaController = require('../controllers/membresiaController');

// Rutas para manejar Membresías
// Ruta para obtener todas las membresías
router.get('/', membresiaController.membresias);

// Ruta para mostrar el formulario de agregar una nueva membresía
router.get('/add', membresiaController.membresiaAddFormulario);

// Ruta para manejar la creación de una nueva membresía
router.post('/add', membresiaController.membresiaAdd);

// Ruta para mostrar el formulario de eliminación de una membresía (por id)
router.get('/del/:id', membresiaController.membresiaDelFormulario);

// Ruta para manejar la eliminación de una membresía (por id)
router.post('/del/:id', membresiaController.membresiaDel);

// Ruta para mostrar el formulario de edición de una membresía (por id)
router.get('/edit/:id', membresiaController.membresiaEditFormulario);

// Ruta para manejar la edición de una membresía (por id)
router.post('/edit/:id', membresiaController.membresiaEdit);

module.exports = router;
