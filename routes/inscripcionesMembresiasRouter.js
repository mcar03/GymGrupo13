const express = require('express');
const router = express.Router();
const inscripcionController = require('../controllers/inscripcionController');

// Rutas para manejar Inscripciones a Membresías
router.get('/', inscripcionController.inscripcionesMembresias);
router.get('/add', inscripcionController.inscripcionMembresiaAddFormulario);
router.post('/add', inscripcionController.inscripcionMembresiaAdd);
router.get('/del/:id', inscripcionController.inscripcionMembresiaDelFormulario);
router.post('/del/:id', inscripcionController.inscripcionMembresiaDel);
router.get('/edit/:id', inscripcionController.inscripcionMembresiaEditFormulario);
router.post('/edit/:id', inscripcionController.inscripcionMembresiaEdit);

module.exports = router;