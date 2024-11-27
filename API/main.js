const express = require('express');
const router = express.Router();
const { conexion } = require('../db/conexion');
const { verificarToken } = require('@damianegreco/hashpass');

// Importar las rutas de admin y productos
const adminRouter = require('./Admin.js');
const productosRouter = require('./Productos.js');

const TOKEN_SECRET = "46334366";


router.use('/Productos', function(req, res, next){
    const token = req.headers.authorization;
    if (token === undefined || token === null){
        console.error('Sin token');
        res.status(403).json({status:'error', error:'Sin token'})
        req.json({status:'error', error:'Sin token'});

    }
    else {
       const verificacionToken = verificartoken(token, TOKEN_SECRET);
       console.log
       res.json({status:'ok'})
    }
})

// Middleware de verificación de token para rutas protegidas
const verificarTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.error('Sin token');
        return res.status(403).json({ status: 'error', error: 'Sin token' });
    }

    const token = authHeader.split(' ')[1];
    verificarToken(token, TOKEN_SECRET)
        .then(tokenValido => {
            if (!tokenValido) {
                console.error('Token inválido');
                return res.status(403).json({ status: 'error', error: 'Token inválido' });
            }
            console.log('Token verificado correctamente');
            next();
        })
        .catch(error => {
            console.error('Error al verificar el token:', error);
            return res.status(403).json({ status: 'error', error: 'Token inválido' });
        });
};

// Aplicar middleware a las rutas protegidas
router.use('/Productos', verificarTokenMiddleware);
router.use('/Admin', adminRouter);
router.use('/Productos', productosRouter);

module.exports = router;
