const express = require('express');
const router = express.Router();
const { conexion } = require('../db/conexion');
const { hashpassword, verificartoken, generatetoken, verifyhash } = require('@damianegreco/hashpass');

// Importar las rutas de admin y productos
const adminRouter = require('./Admin.js');
const productosRouter = require('./Productos.js');

// Login para generar token
router.post("/login", async function (req, res, next) {
    const { nomadmin, contraseña } = req.body;
    console.log(req.body);
    
    const sql = "SELECT * FROM administradores WHERE nomadmin = ?";
    conexion.query(sql, [nomadmin], async function (error, result) {
      if (error) {
        console.error(error);
        return res.status(500).send("Ocurrió un error al autenticar al administrador");
      }
      if (result.length === 0) {
        return res.status(404).send("Administrador no encontrado");
      }
  
      const admin = result[0];
      const passwordMatch = await verifyhash(contraseña, admin.contraseña);
  
      if (passwordMatch) {
        const token = generatetoken({ id: admin.ID_administrador, nomadmin: admin.nomadmin });
        res.json({ status: "ok", token });
      } else {
        res.status(401).send("Contraseña incorrecta");
      }
    });
  });

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
