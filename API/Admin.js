const express = require('express');
const router = express.Router();
const { hashPass, verificarPass, generarToken } = require('@damianegreco/hashpass');
const { conexion } = require('../db/conexion');
const TOKEN_SECRET = "46334366";


// Crear un nuevo administrador
router.post('/Crear', function (req, res, next) {
    const { nom_admin, contrasena } = req.body;

    if (!nom_admin || !contrasena) {
        return res.status(400).send("nom_admin y contraseña son obligatorios");
    }

    checkUsuario(nom_admin)
        .then(() => {
            const passHasheada = hashPass(contrasena);
            guardarUsuario(nom_admin, passHasheada)
                .then((id) => {
                    res.json({ status: 'ok', id });
                })
                .catch((error) => {
                    return res.status(500).json({ status: 'error', error });
                });
        })
        .catch((error) => {
            return res.status(500).json({ status: 'error', error });
        });
});

// Funciones auxiliares para manejar promesas
const checkUsuario = function (nom_admin) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM administrador WHERE nom_admin = ?";
        conexion.query(sql, [nom_admin], function (error, result) {
            if (error) return reject(error);
            if (result.length > 0) return reject("Usuario ya registrado");
            return resolve();
        });
    });
};

const guardarUsuario = function (nom_admin, passHasheada) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO administrador (nom_admin, contrasena) VALUES (?, ?)";
        conexion.query(sql, [nom_admin, passHasheada], function (error, result) {
            if (error) return reject(error);
            return resolve(result.insertId);
        });
    });
};


// Obtener todos los administradores
router.get('/', function (req, res, next) {
    const sql = "SELECT id, nom_admin FROM administrador";
    conexion.query(sql, function (error, result) {
        if (error) {
            return res.status(500).send("Ocurrió un error al obtener los administradores");
        }
        return res.json({ status: "ok", administradores: result });
    });
});

// Obtener un administrador por ID
router.get('/:id', function (req, res, next) {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);
    
    if (isNaN(parsedId)) {
        return res.status(400).send("ID no válido");
    }

    const sql = "SELECT id, nom_admin FROM administrador WHERE id = ?";
    conexion.query(sql, [parsedId], function (error, result) {
        if (error) {
            return res.status(500).send("Ocurrió un error al obtener el administrador");
        }
        if (result.length === 0) {
            return res.status(404).send("Administrador no encontrado");
        }
        return res.json({ status: "ok", administrador: result[0] });
    });
});

// Actualizar un administrador por ID
router.put('/:id', function (req, res, next) {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);
    const { nom_admin, contrasena } = req.body;

    if (isNaN(parsedId)) {
        return res.status(400).send("ID no válido");
    }

    if (!nom_admin || !contrasena) {
        return res.status(400).send("nom_admin y contraseña son obligatorios");
    }

    const passHasheada = hashPass(contrasena);
    const sql = "UPDATE administrador SET nom_admin = ?, contraseña = ? WHERE id = ?";
    conexion.query(sql, [nom_admin, passHasheada, parsedId], function (error, result) {
        if (error) {
            return res.status(500).send("Ocurrió un error al actualizar el administrador");
        }
        return res.json({ status: "ok", message: "Administrador actualizado con éxito" });
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
        return res.json({ status: "ok", message: "Administrador eliminado con éxito" });
    });
});

module.exports = router;