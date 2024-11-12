const express = require('express');
const router = express.Router();
const newLocal = '../controllers/entrenadorController';
const entrenadorController = require(newLocal);

// Ruta para listar todos los entrenadores
router.get('/', entrenadorController.listarEntrenadores);

// Ruta para mostrar el formulario para agregar un nuevo entrenador
router.get('/add', entrenadorController.mostrarFormularioAgregar);

// Ruta para agregar un nuevo entrenador
router.post('/add', entrenadorController.agregarEntrenador);

// Ruta para mostrar el formulario de edición de un entrenador
router.get('/edit/:id', entrenadorController.mostrarFormularioEditar);

// Ruta para editar un entrenador
router.post('/edit/:id', entrenadorController.editarEntrenador);

// Ruta para mostrar el formulario de eliminación de un entrenador
router.get('/del/:id', entrenadorController.mostrarFormularioEliminar);

// Ruta para eliminar un entrenador
router.post('/del/:id', entrenadorController.eliminarEntrenador);

module.exports = router;
