function isAuthenticated(req, res, next) {
    console.log(req.session); // Verifica que la sesión esté definida
    if (req.session.user) {
        return next();  // Si está autenticado, sigue al siguiente middleware
    }
    res.redirect('/auth/login');  // Si no está autenticado, redirige al login
}
