const express = require('express');
const router = express.Router();
const claseController = require('../controllers/claseController');

// Ruta para listar todas las clases con información de los entrenadores
router.get('/', claseController.listarClases);

// Ruta para mostrar el formulario para agregar una nueva clase
router.get('/add', claseController.mostrarFormularioAgregar);

// Ruta para agregar una nueva clase
router.post('/add', claseController.agregarClase);

// Ruta para mostrar el formulario de edición de una clase
router.get('/edit/:id', claseController.mostrarFormularioEditar);

// Ruta para editar una clase
router.post('/edit/:id', claseController.editarClase);

// Ruta para mostrar el formulario de eliminación de una clase
router.get('/del/:id', claseController.mostrarFormularioEliminar);

// Ruta para eliminar una clase
router.post('/del/:id', claseController.eliminarClase);

module.exports = router;
