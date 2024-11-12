const express = require('express');
const router = express.Router();
const inscripcionController = require('../controllers/inscripcionMembresiaController');


// Rutas para manejar Inscripciones a Membresías
// Ruta para ver todas las inscripciones de los clientes a las membresías
router.get('/', inscripcionController.inscripciones);

// Ruta para mostrar el formulario de agregar una nueva inscripción a una membresía
router.get('/add', inscripcionController.inscripcionAddFormulario);

// Ruta para manejar la creación de una nueva inscripción a una membresía
router.post('/add', inscripcionController.inscripcionAdd);

// Ruta para eliminar una inscripción (por id)
router.get('/del/:id', inscripcionController.inscripcionDelFormulario);

// Ruta para manejar la eliminación de una inscripción (por id)
router.post('/del/:id', inscripcionController.inscripcionDel);

// Ruta para editar una inscripción (por id)
router.get('/edit/:id', inscripcionController.inscripcionEditFormulario);

// Ruta para manejar la edición de una inscripción (por id)
router.post('/edit/:id', inscripcionController.inscripcionEdit);

module.exports = router;
