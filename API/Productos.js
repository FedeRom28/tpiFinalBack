const express = require("express");
const router = express.Router();
const { conexion } = require('../db/conexion');

// RECIBE = req => params, query, body, headers
// RESPUESTA = res => status, send, sendFile, json, render

// Crear un nuevo producto
router.post("/", function (req, res, next) {
    const { nom_producto, descripcion, precio, id_categorias } = req.body;
    const sql = "INSERT INTO productos (nom_producto, descripcion, precio, id_categorias) VALUES (?, ?, ?, ?)";
    conexion.query(sql, [nom_producto, descripcion, precio, id_categorias], function (error, result) {
        if (error) {
            console.error(error);
            return res.send("Ocurrió un error al agregar el producto");
        }
        return res.json({ status: "ok", message: "Producto agregado con éxito" });
    });
});

// Actualizar un producto por ID
router.put("/:id", function (req, res, next) {
    const { id } = req.params;
    const { nom_producto, descripcion, precio, id_categorias } = req.body;
    const sql = "UPDATE productos SET nom_producto = ?, descripcion = ?, precio = ?, id_categorias = ? WHERE id_productos = ?";
    conexion.query(sql, [nom_producto, descripcion, precio, id_categorias, id], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send("Ocurrió un error al actualizar el producto");
        }
        return res.json({ status: "ok", message: "Producto actualizado con éxito" });
    });
});

// Eliminar un producto por ID
router.delete("/:id", function (req, res, next) {
    const { id } = req.params;
    const sql = "DELETE FROM productos WHERE id_productos = ?";
    conexion.query(sql, [id], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send("Ocurrió un error al eliminar el producto");
        }
        return res.json({ status: "ok", message: "Producto eliminado con éxito" });
    });
});

module.exports = router;
