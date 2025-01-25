const express = require('express');
const router = express.Router();
const { hashPass, verificarPass, generarToken } = require('@damianegreco/hashpass');
const { conexion } = require('../db/conexion');
const TOKEN_SECRET = "46334366";

// Función envolvente para verificar la contraseña con promesas

// Crear un nuevo administrador
router.post('/Crear', function (req, res, next) {
    const { nom_admin, contraseña } = req.body;

    if (!nom_admin || !contraseña) {
        return res.status(400).send("nom_admin y contraseña son obligatorios");
    }

    checkUsuario(nom_admin)
        .then(() => {
            const passHasheada = hashPass(contraseña);
            guardarUsuario(nom_admin, passHasheada)
                .then((id) => {
                    res.json({ status: 'ok', id });
                })
                .catch((error) => {
                    res.status(500).json({ status: 'error', error });
                });
        })
        .catch((error) => {
            res.status(500).json({ status: 'error', error });
        });
});

// Login y generación de token para el administrador
router.post('/login', function (req, res, next) {
    const { nom_admin, contraseña } = req.body;

    const sql = 'SELECT id, nom_admin, contraseña FROM administrador WHERE nom_admin = ?';
    conexion.query(sql, [nom_admin], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).json({ status: 'error', error });
        }
        if (result.length !== 1) {
            console.error('Error al buscar administrador (Usuario Incorrecto)');
            return res.status(403).json({ status: 'error', error: 'Error al buscar administrador (Usuario incorrecto)' });
        }

        if (verificarPass(contraseña, result[0].contraseña)) {
            console.log('Inicio Correctamente');
            const token = generarToken(TOKEN_SECRET, 6, { admin_id: result[0].id, nom_admin: nom_admin });
            console.log(token);
            return res.json({ status: 'ok', token, admin_id: result[0].id });
        } else {
            console.error('Usuario/Contraseña incorrecto');
            return res.status(403).json({ status: 'error', error: 'Usuario/Contraseña incorrecto' });
        }
    });
});

// Obtener todos los administradores
router.get('/', function (req, res, next) {
    const sql = "SELECT id, nom_admin, contraseña FROM administrador";
    conexion.query(sql, function (error, result) {
        if (error) {
            return res.status(500).send("Ocurrió un error al obtener los administradores");
        }
        res.json({ status: "ok", administradores: result });
    });
});

// Obtener un administrador por ID
router.get('/:id', function (req, res, next) {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);
    
    if (isNaN(parsedId)) {
        return res.status(400).send("ID no válido");
    }

    const sql = "SELECT id, nom_admin, contraseña FROM administrador WHERE id = ?";
    conexion.query(sql, [parsedId], function (error, result) {
        if (error) {
            return res.status(500).send("Ocurrió un error al obtener el administrador");
        }
        if (result.length === 0) {
            return res.status(404).send("Administrador no encontrado");
        }
        res.json({ status: "ok", administrador: result[0] });
    });
});

// Actualizar un administrador por ID
router.put('/:id', function (req, res, next) {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);
    const { nom_admin, contraseña } = req.body;

    if (isNaN(parsedId)) {
        return res.status(400).send("ID no válido");
    }

    if (!nom_admin || !contraseña) {
        return res.status(400).send("nom_admin y contraseña son obligatorios");
    }

    const passHasheada = hashPass(contraseña);
    const sql = "UPDATE administrador SET nom_admin = ?, contraseña = ? WHERE id = ?";
    conexion.query(sql, [nom_admin, passHasheada, parsedId], function (error, result) {
        if (error) {
            return res.status(500).send("Ocurrió un error al actualizar el administrador");
        }
        res.json({ status: "ok", message: "Administrador actualizado con éxito" });
    });
});

// Eliminar un administrador por ID
router.delete('/:id', function (req, res, next) {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
        return res.status(400).send("ID no válido");
    }

    const sql = "DELETE FROM administrador WHERE id = ?";
    conexion.query(sql, [parsedId], function (error, result) {
        if (error) {
            return res.status(500).send("Ocurrió un error al eliminar el administrador");
        }
        res.json({ status: "ok", message: "Administrador eliminado con éxito" });
    });
});

module.exports = router;
