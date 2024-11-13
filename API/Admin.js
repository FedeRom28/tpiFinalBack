const express = require('express');
const router = express.Router();
const { conexion } = require('../db/conexion');
const { hashPassword, verificartoken } = require('@damianegreco/hashpass');

// Obtener todos los administradores
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM administradores';
  conexion.query(sql, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ status: 'error', error: 'Ocurrió un error' });
    }
    res.json({ status: 'ok', administradores: results });
  });
});

// Agregar un nuevo administrador
router.post('/', async (req, res) => {
  const { nomadmin, contraseña, roll } = req.body;
  try {
    const hashedPassword = await hashPassword(contraseña);

    const sql = `INSERT INTO administradores (nomadmin, contraseña, roll) VALUES (?, ?, ?)`;
    conexion.query(sql, [nomadmin, hashedPassword, roll], (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', error: 'Ocurrió un error al agregar el administrador' });
      }
      res.json({ status: 'ok', message: 'Administrador agregado exitosamente' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Ocurrió un error al encriptar la contraseña' });
  }
});

// Verificar token de autenticación (si es necesario en el proyecto)
router.use((req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ status: 'error', error: 'Sin token' });
  }
  
  const verificacion = verificartoken(token, process.env.TOKEN_SECRET);
  if (!verificacion) {
    return res.status(403).json({ status: 'error', error: 'Token inválido' });
  }
  
  next();
});

module.exports = router;
