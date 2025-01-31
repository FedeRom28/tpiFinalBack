const express = require("express");
const router = express.Router();
const { conexion } = require('../db/conexion');

// Obtener todos los talles
router.get("/", function (req, res, next) {
    const sql = "SELECT * FROM talles";
    conexion.query(sql, function (error, results) {
        if (error) {
            console.error(error);
            return res.send("Ocurrió un error al obtener los talles");
        }
        return res.json({
            status: "ok",
            talles: results
        });
    });
});

// Obtener un talle por ID
router.get("/:id", function (req, res, next) {
    const { id } = req.params;
    const sql = "SELECT * FROM talles WHERE id_talles = ?";
    conexion.query(sql, [parseInt(id)], function (error, result) {
        if (error) {
            console.error(error);
            return res.send("Ocurrió un error al obtener el talle");
        }
        if (result.length === 0) {
            return res.status(404).send("Talle no encontrado");
        }
        return res.json({
            status: "ok",
            talle: result[0]
        });
    });
});

// Agregar un nuevo talle
router.post("/", function (req, res, next) {
    const { nom_talles } = req.body;

    if (!nom_talles) {
        return res.status(400).send("nom_talles es obligatorio");
    }

    const sql = "INSERT INTO talles (nom_talles) VALUES (?)";
    conexion.query(sql, [nom_talles], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send("Ocurrió un error al agregar el talle");
        }
        return res.json({ status: "ok", message: "Talle agregado exitosamente", id: result.insertId });
    });
});

// Actualizar un talle por ID
router.put("/:id", function (req, res, next) {
    const { id } = req.params;
    const { nom_talles } = req.body;

    if (!nom_talles) {
        return res.status(400).send("nom_talles es obligatorio");
    }

    const sql = "UPDATE talles SET nom_talles = ? WHERE id_talles = ?";
    conexion.query(sql, [nom_talles, parseInt(id)], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send("Ocurrió un error al actualizar el talle");
        }
        if (result.affectedRows === 0) {
            return res.status(404).send("Talle no encontrado");
        }
        return res.json({ status: "ok", message: "Talle actualizado exitosamente" });
    });
});

// Eliminar un talle por ID
router.delete("/:id", function (req, res, next) {
    const { id } = req.params;
    const sql = "DELETE FROM talles WHERE id_talles = ?";
    conexion.query(sql, [parseInt(id)], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send("Ocurrió un error al eliminar el talle");
        }
        if (result.affectedRows === 0) {
            return res.status(404).send("Talle no encontrado");
        }
        return res.json({ status: "ok", message: "Talle eliminado exitosamente" });
    });
});

module.exports = router;
