const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas de autenticación
router.get('/login', authController.mostrarFormularioLogin);
router.post('/login', authController.procesarLogin);
router.get('/logout', authController.logout);

module.exports = router;
