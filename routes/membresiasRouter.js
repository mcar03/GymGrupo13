const express = require('express');
const router = express.Router();
const membresiaController = require('../controllers/membresiaController');
const inscripcionController = require('../controllers/inscripcionMembresiaController');

// Rutas para manejar Membresías
// Ruta para obtener todas las membresías
router.get('/membresias', membresiaController.membresias);

// Ruta para mostrar el formulario de agregar una nueva membresía
router.get('/membresias/add', membresiaController.membresiaAddFormulario);

// Ruta para manejar la creación de una nueva membresía
router.post('/membresias/add', membresiaController.membresiaAdd);

// Ruta para mostrar el formulario de eliminación de una membresía (por id)
router.get('/membresias/del/:id', membresiaController.membresiaDelFormulario);

// Ruta para manejar la eliminación de una membresía (por id)
router.post('/membresias/del/:id', membresiaController.membresiaDel);

// Ruta para mostrar el formulario de edición de una membresía (por id)
router.get('/membresias/edit/:id', membresiaController.membresiaEditFormulario);

// Ruta para manejar la edición de una membresía (por id)
router.post('/membresias/edit/:id', membresiaController.membresiaEdit);

module.exports = router;
