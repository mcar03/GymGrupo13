// routes/authRouter.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Asegúrate de que la ruta sea correcta

// Ruta para mostrar el login
router.get('/login', authController.mostrarLogin);

// Ruta para manejar el login
router.post('/login', authController.login);

// Ruta para mostrar el registro
router.get('/register', authController.mostrarRegistro);

// Ruta para manejar el registro
router.post('/register', authController.registro);

// Ruta para cerrar sesión
router.get('/logout', authController.logout); // Asegúrate de que `logout` esté definido en el controlador

module.exports = router;
