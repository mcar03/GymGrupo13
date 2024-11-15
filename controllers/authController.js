// Solo estas línea debería estar presente
const bcrypt = require('bcrypt');
const db = require('../db');

// Mostrar el formulario de login
exports.mostrarLogin = (req, res) => {
    res.render('auth/login');  // Asegúrate de tener esta vista
};


// Función para procesar el login
exports.login = (req, res) => {
    const { nombre, password } = req.body;

    // Buscamos al usuario por su nombre
    const query = 'SELECT * FROM usuarios WHERE nombre = ?';
    db.query(query, [nombre], (err, results) => {
        if (err) {
            return res.send('Error en la base de datos');
        }

        if (results.length > 0) {
            const user = results[0];
            
            // Comparamos la contraseña ingresada con la almacenada
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return res.send('Error en la comparación de contraseñas');
                }
                if (isMatch) {
                    req.session.user = user;  // Almacenamos el usuario en la sesión
                    return res.redirect('/');  // Redirigir al inicio
                } else {
                    return res.send('Credenciales incorrectas');
                }
            });
        } else {
            return res.send('No se encontró el usuario');
        }
    });
};


// Mostrar el formulario de registro
exports.mostrarRegistro = (req, res) => {
    res.render('auth/register');  // Asegúrate de tener esta vista
};



// Función para registrar un nuevo usuario
exports.registro = (req, res) => {
    const { nombre, password } = req.body;

    // Hash de la contraseña
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.send('Error al cifrar la contraseña');

        // Insertamos el nuevo usuario en la base de datos
        const query = 'INSERT INTO usuarios (nombre, password) VALUES (?, ?)';
        db.query(query, [nombre, hashedPassword], (err, result) => {
            if (err) {
                return res.send('Error en la base de datos');
            }
            // Redirigimos al login después de registrar al usuario
            res.redirect('/auth/login');
        });
    });
};


// Cerrar sesión
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Error al cerrar sesión');
        }
        res.redirect('/auth/login');  // Redirigir al login después de cerrar sesión
    });
};
