const express = require('express');
const router = express.Router();
const entrenadorController = require('../controllers/entrenadorController');

// Rutas para entrenadores
router.get('/', entrenadorController.listarEntrenadores);
router.get('/add', entrenadorController.mostrarFormularioAgregar);
router.post('/add', entrenadorController.agregarEntrenador);
router.get('/edit/:id', entrenadorController.mostrarFormularioEditar);
router.post('/edit/:id', entrenadorController.editarEntrenador);
router.get('/del/:id', entrenadorController.mostrarFormularioEliminar);
router.post('/del/:id', entrenadorController.eliminarEntrenador);

module.exports = router;
