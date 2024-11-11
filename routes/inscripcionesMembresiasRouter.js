const express = require('express');
const router = express.Router();
const membresiaController = require('../controllers/membresiaController');
const inscripcionController = require('../controllers/inscripcionMembresiaController');


// Rutas para manejar Inscripciones a Membresías
// Ruta para ver todas las inscripciones de los clientes a las membresías
router.get('/inscripciones', inscripcionController.inscripciones);

// Ruta para mostrar el formulario de agregar una nueva inscripción a una membresía
router.get('/inscripciones/add', inscripcionController.inscripcionAddFormulario);

// Ruta para manejar la creación de una nueva inscripción a una membresía
router.post('/inscripciones/add', inscripcionController.inscripcionAdd);

// Ruta para eliminar una inscripción (por id)
router.get('/inscripciones/del/:id', inscripcionController.inscripcionDelFormulario);

// Ruta para manejar la eliminación de una inscripción (por id)
router.post('/inscripciones/del/:id', inscripcionController.inscripcionDel);

// Ruta para editar una inscripción (por id)
router.get('/inscripciones/edit/:id', inscripcionController.inscripcionEditFormulario);

// Ruta para manejar la edición de una inscripción (por id)
router.post('/inscripciones/edit/:id', inscripcionController.inscripcionEdit);

module.exports = router;
