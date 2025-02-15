const express = require('express');
const router = express.Router();
const { verificarToken } = require('@damianegreco/hashpass');

// Importar las rutas de admin y productos
const productosPublic = require('./productosPublic.js');
const adminPublic = require('./adminPublic.js');
const adminRouter = require('./Admin.js');
const productosRouter = require('./Productos.js');
const categoriasRouter = require('./categorias.js');
const tallesRouter = require('./talles.js');

const TOKEN_SECRET = "hju32_okfd";

router.use('/admin', adminPublic);
router.use('/Productos', productosPublic);

router.use('/admin', function (req, res, next) {
    const token = req.headers.authorization;
    const verification = verificarToken(token, TOKEN_SECRET);
    if (verification) {
        next();
    } else {
        return res.status(403).json({ status: "error", error: "acceso denegado" });
    }
});
router.use('/admin', adminRouter);

router.use('/Productos', function (req, res, next) {
    const token = req.headers.authorization;
    const verification = verificarToken(token, TOKEN_SECRET);
    if (verification) {
        next();
    } else {
        return res.status(403).json({ status: "error", error: "acceso denegado" });
    }
});
router.use('/Productos', productosRouter);

router.use('/categorias', function (req, res, next) {
    const token = req.headers.authorization;
    const verification = verificarToken(token, TOKEN_SECRET);
    if (verification) {
        next();
    } else {
        return res.status(403).json({ status: "error", error: "acceso denegado" });
    }
});
router.use('/categorias', categoriasRouter);

router.use('/talles', function (req, res, next) {
    const token = req.headers.authorization;
    const verification = verificarToken(token, TOKEN_SECRET);
    if (verification) {
        next();
    } else {
        return res.status(403).json({ status: "error", error: "acceso denegado" });
    }
});
router.use('/talles', tallesRouter); // Usar las rutas de talles

module.exports = router;