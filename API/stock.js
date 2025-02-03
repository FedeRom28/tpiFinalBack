const express = require("express");
const router = express.Router();
const { conexion } = require('../db/conexion');

// Obtener todas las entradas de stock
router.get("/", function (req, res, next) {
    const sql = "SELECT * FROM stock";
    conexion.query(sql, function (error, results) {
        if (error) {
            console.error(error);
            return res.send("Ocurrió un error al obtener los detalles de stock");
        }
        return res.json({
            status: "ok",
            stock: results
        });
    });
});

// Obtener una entrada de stock por ID
router.get("/:id", function (req, res, next) {
    const { id } = req.params;
    const sql = "SELECT * FROM stock WHERE id_stock = ?";
    conexion.query(sql, [parseInt(id)], function (error, result) {
        if (error) {
            console.error(error);
            return res.send("Ocurrió un error al obtener el detalle de stock");
        }
        if (result.length === 0) {
            return res.status(404).send("Detalle de stock no encontrado");
        }
        return res.json({
            status: "ok",
            stock: result[0]
        });
    });
});

// Agregar una nueva entrada de stock
router.post("/", function (req, res, next) {
    const { id_productos, cantidad, id_talles } = req.body;

    if (!id_productos || !cantidad || !id_talles) {
        return res.status(400).send("Todos los campos son obligatorios");
    }

    const sql = "INSERT INTO stock (id_productos, cantidad, id_talles) VALUES (?, ?, ?)";
    conexion.query(sql, [id_productos, cantidad, id_talles], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send("Ocurrió un error al agregar el detalle de stock");
        }
        return res.json({ status: "ok", message: "Detalle de stock agregado exitosamente", id: result.insertId });
    });
});

// Actualizar una entrada de stock por ID
router.put("/:id", function (req, res, next) {
    const { id } = req.params;
    const { id_productos, cantidad, id_talles } = req.body;

    if (!id_productos || !cantidad || !id_talles) {
        return res.status(400).send("Todos los campos son obligatorios");
    }

    const sql = "UPDATE stock SET id_productos = ?, cantidad = ?, id_talles = ? WHERE id_stock = ?";
    conexion.query(sql, [id_productos, cantidad, id_talles, parseInt(id)], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send("Ocurrió un error al actualizar el detalle de stock");
        }
        if (result.affectedRows === 0) {
            return res.status(404).send("Detalle de stock no encontrado");
        }
        return res.json({ status: "ok", message: "Detalle de stock actualizado exitosamente" });
    });
});

// Eliminar una entrada de stock por ID
router.delete("/:id", function (req, res, next) {
    const { id } = req.params;
    const sql = "DELETE FROM stock WHERE id_stock = ?";
    conexion.query(sql, [parseInt(id)], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send("Ocurrió un error al eliminar el detalle de stock");
        }
        if (result.affectedRows === 0) {
            return res.status(404).send("Detalle de stock no encontrado");
        }
        return res.json({ status: "ok", message: "Detalle de stock eliminado exitosamente" });
    });
});

module.exports = router;
