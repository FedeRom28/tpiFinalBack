const express = require('express');
const router = express.Router();

// Importar las rutas de admin y productos
const adminRouter = require('./Admin.js');
const productosRouter = require('./Productos.js');
const categoriasRouter = require('./categorias.js');

router.use('/Admin', adminRouter);
router.use('/Productos', productosRouter);
router.use('/categorias', categoriasRouter);

module.exports = router;
