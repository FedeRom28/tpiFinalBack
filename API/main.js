const express = require('express');
const router = express.Router();
const { conexion } = require('../db/conexion');
const {  verificarToken } = require('@damianegreco/hashpass');

// Importar las rutas de admin y productos
const adminRouter = require('./Admin.js');
const productosRouter = require('./Productos.js');
const detallesstockRouter = require('./detallesstock.js');
const tallesRouter = require('./talles.js');
const categoriasRouter = require('.categorias.js');

const TOKEN_SECRET = "46334366"

// Middleware de verificación de token para rutas protegidas
router.use('/Productos', function(req, res, next){
    const token = req.headers.authorization;
    if (!token) {
        console.error('Sin token');
        return res.status(403).json({ status: 'error', error: 'Sin token' });
    }

    const tokenValido = verificarToken(token, TOKEN_SECRET);
    if (!tokenValido) {
        console.error('Token inválido');
        return res.status(403).json({ status: 'error', error: 'Token inválido' });
    }

    console.log('Token verificado correctamente');
    next();
});

router.use('/Admin', adminRouter);
router.use('/productos', productosRouter);
router.use('/detallesstock',detallesstockRouter);
router.use('/talles',tallesRouter);
router.use('/categorias',categoriasRouter);

module.exports = router;
