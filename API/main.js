const express = require('express');
const router = express.Router();
const { verificartoken } = require('@damianegreco/hashpass');

// Importar las rutas de admin y productos
const adminRouter = require('./Admin.js');
const productosRouter = require('./Productos.js');

// Middleware de verificación de token para rutas protegidas
router.use((req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        console.error('Sin token');
        return res.status(403).json({ status: 'error', error: 'Sin token' });
    }
    
    const verificacionToken = verificartoken(token, TOKEN_SECRET);
    if (!verificacionToken) {
        console.error('Token inválido');
        return res.status(403).json({ status: 'error', error: 'Token inválido' });
    }

    console.log('Token verificado correctamente');
    next();
});

// Aplicar las rutas de admin y productos
router.use('/admin', adminRouter);
router.use('/productos', productosRouter);

module.exports = router;
