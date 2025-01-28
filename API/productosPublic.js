const express = require("express");
const router = express.Router();
const { conexion } = require('../db/conexion');

// Obtener todos los productos
router.get("/", function (req, res, next) {
    const sql = "SELECT * FROM productos";
    conexion.query(sql, function (error, result) {
        if (error) {
            console.error(error);
            return res.send("Ocurrió un error al obtener los productos");
        }
        res.json({
            status: "ok",
            productos: result
        });
    });
});

// Obtener un producto por ID
router.get("/:id", function (req, res, next) {
    const { id } = req.params;
    const sql = "SELECT * FROM productos WHERE id_productos = ?";
    conexion.query(sql, [id], function (error, result) {
        if (error) {
            console.error(error);
            return res.send("Ocurrió un error al obtener el producto");
        }
        return res.json({
            status: "ok",
            producto: result
        });
    });
});
module.exports = router;