const express = require("express");
const router = express.Router();
const { conexion } = require('../db/conexion');

// Obtener todas las categorías
router.get("/", function (req, res, next) {
    const sql = "SELECT * FROM categorias";
    conexion.query(sql, function (error, results) {
        if (error) {
            console.error(error);
            return res.send("Ocurrió un error al obtener las categorías");
        }
        res.json({
            status: "ok",
            categorias: results
        });
    });
});

// Obtener una categoría por ID
router.get("/:id", function (req, res, next) {
    const { id } = req.params;
    const sql = "SELECT * FROM categorias WHERE id_categorias = ?";
    conexion.query(sql, [parseInt(id)], function (error, result) {
        if (error) {
            console.error(error);
            return res.send("Ocurrió un error al obtener la categoría");
        }
        if (result.length === 0) {
            return res.status(404).send("Categoría no encontrada");
        }
        res.json({
            status: "ok",
            categoria: result[0]
        });
    });
});

// Agregar una nueva categoría
router.post("/", function (req, res, next) {
    const { nom_categoria } = req.body;

    if (!nom_categoria) {
        return res.status(400).send("nom_categoria es obligatorio");
    }

    const sql = "INSERT INTO categorias (nom_categoria) VALUES (?)";
    conexion.query(sql, [nom_categoria], function (error, result) {
        if (error) {
            console.error(error);
            return res.send("Ocurrió un error al agregar la categoría");
        }
        res.json({ status: "ok", message: "Categoría agregada exitosamente", id: result.insertId });
    });
});

// Actualizar una categoría por ID
router.put("/:id", function (req, res, next) {
    const { id } = req.params;
    const { nom_categoria } = req.body;

    if (!nom_categoria) {
        return res.status(400).send("nom_categoria es obligatorio");
    }

    const sql = "UPDATE categorias SET nom_categoria = ? WHERE id_categorias = ?";
    conexion.query(sql, [nom_categoria, parseInt(id)], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send("Ocurrió un error al actualizar la categoría");
        }
        if (result.affectedRows === 0) {
            return res.status(404).send("Categoría no encontrada");
        }
        res.json({ status: "ok", message: "Categoría actualizada exitosamente" });
    });
});

// Eliminar una categoría por ID
router.delete("/:id", function (req, res, next) {
    const { id } = req.params;
    const sql = "DELETE FROM categorias WHERE id_categorias = ?";
    conexion.query(sql, [parseInt(id)], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send("Ocurrió un error al eliminar la categoría");
        }
        if (result.affectedRows === 0) {
            return res.status(404).send("Categoría no encontrada");
        }
        res.json({ status: "ok", message: "Categoría eliminada exitosamente" });
    });
});

module.exports = router;
