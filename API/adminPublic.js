const express = require('express');
const router = express.Router();
const { hashPass, verificarPass, generarToken } = require('@damianegreco/hashpass');
const { conexion } = require('../db/conexion');


const TOKEN_SECRET = "hju32_okfd";

router.post('/login', function (req, res, next) {
    const { nom_admin, contrasena } = req.body;
    
    if (!nom_admin || !contrasena) {
        return res.status(400).send("nom_admin y contraseña son obligatorios");
    }

    const sql = "SELECT * FROM administrador WHERE nom_admin = ?";
    conexion.query(sql, [nom_admin], function (error, result) {
        if (error) {
            return res.status(500).send("Ocurrió un error al autenticar al administrador");
        }
        if (result.length === 0) {
            return res.status(404).send("Administrador no encontrado");
        }

        const admin = result[0];

        if (verificarPass(contrasena, admin.contrasena)) {
            const token = generarToken(TOKEN_SECRET,6,{ usuario_id: admin.id, usuario: admin.nom_admin });
            return res.json({ status: "ok", token });
        } else {
            return res.status(401).send("Contraseña incorrecta");
        }
    });

});

module.exports = router;