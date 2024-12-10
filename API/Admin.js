const express = require('express');
const router = express.Router();
const { hashPass, verificarPass, generarToken } = require('@damianegreco/hashpass');
const { conexion } = require('../db/conexion');

// Función envolvente para verificar la contraseña con promesas
const verificarPassPromise = (contraseña, contraseñaHasheada) => {
    return new Promise((resolve, reject) => {
        verificarPass(contraseña, contraseñaHasheada, (error, match) => {
            if (error) return reject(error);
            resolve(match);
        });
    });
};

// Crear un nuevo administrador
router.post('/', function (req, res, next) {
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
                    console.error(error);
                    res.json({ status: 'error', error });
                });
        })
        .catch((error) => {
            console.error(error);
            res.json({ status: 'error', error });
        });
});

// Login y generación de token
router.post('/login', function (req, res, next) {
    const { nom_admin, contraseña } = req.body;

    console.log('Datos recibidos:', { nom_admin, contraseña });

    if (!nom_admin || !contraseña) {
        return res.status(400).send("nom_admin y contraseña son obligatorios");
    }

    const sql = "SELECT * FROM administrador WHERE nom_admin = ?";
    conexion.query(sql, [nom_admin], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send("Ocurrió un error al autenticar al administrador");
        }
        if (result.length === 0) {
            return res.status(404).send("Administrador no encontrado");
        }

        const admin = result[0];
        
        if (!admin.id) {
            console.error("Administrador sin ID");
            return res.status(500).send("Administrador sin ID");
        }

        verificarPassPromise(contraseña, admin.contraseña)
            .then(match => {
                if (match) {
                    const token = generarToken({ id: admin.id, nom_admin: admin.nom_admin });
                    res.json({ status: "ok", token });
                } else {
                    res.status(401).send("Contraseña incorrecta");
                }
            })
            .catch(error => {
                console.error("Error al verificar la contraseña:", error);
                res.status(500).send("Error interno del servidor");
            });
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
        const sql = "INSERT INTO administrador (nom_admin, contraseña) VALUES (?, ?)";
        conexion.query(sql, [nom_admin, passHasheada], function (error, result) {
            if (error) return reject(error);
            return resolve(result.insertId);
        });
    });
};

// Obtener todos los administradores
router.get('/', function (req, res, next) {
    const sql = "SELECT id, nom_admin, contraseña FROM administrador";
    conexion.query(sql, function (error, result) {
        if (error) {
            console.error(error);
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
            console.error(error);
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
            console.error(error);
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
            console.error(error);
            return res.status(500).send("Ocurrió un error al eliminar el administrador");
        }
        res.json({ status: "ok", message: "Administrador eliminado con éxito" });
    });
});

module.exports = router;
