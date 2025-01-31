const express = require("express");
const router = express.Router();
const { conexion } = require('../db/conexion');
const upload = require('../config/uploadConfig'); // Importar la configuración de uploadConfig

// Crear un nuevo producto con imagen y talle
router.post("/", upload.single('imagen'), function (req, res, next) {
    const { nom_producto, descripcion, precio, id_categorias, id_talles } = req.body;
    const imagen = req.file ? req.file.filename : null;
    const sqlProducto = "INSERT INTO productos (nom_producto, descripcion, precio, id_categorias, imagen, id_talles) VALUES (?, ?, ?, ?, ?, ?)";
    const valoresProducto = [nom_producto, descripcion, precio, id_categorias, imagen, id_talles];
    
    conexion.query(sqlProducto, valoresProducto, function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send("Ocurrió un error al agregar el producto");
        }
        return res.json({ status: "ok", message: "Producto y talle agregado con éxito" });
    });
});

// Actualizar un producto por ID con imagen y talle
router.put("/:id", upload.single('imagen'), function (req, res, next) {
    const { id } = req.params;
    const { nom_producto, descripcion, precio, id_categorias, id_talles } = req.body;
    const imagen = req.file ? req.file.filename : null;
    const sqlProducto = "UPDATE productos SET nom_producto = ?, descripcion = ?, precio = ?, id_categorias = ?, imagen = ?, id_talles = ? WHERE id_productos = ?";
    const valoresProducto = [nom_producto, descripcion, precio, id_categorias, imagen, id_talles, id];
    
    conexion.query(sqlProducto, valoresProducto, function (error) {
        if (error) {
            console.error(error);
            return res.status(500).send("Ocurrió un error al actualizar el producto");
        }
        return res.json({ status: "ok", message: "Producto y talle actualizado con éxito" });
    });
});

// Eliminar un producto por ID junto con su talle
router.delete("/:id", function (req, res, next) {
    const { id } = req.params;

    const sqlDeleteProducto = "DELETE FROM productos WHERE id_productos = ?";
    conexion.query(sqlDeleteProducto, [id], function (error) {
        if (error) {
            console.error(error);
            return res.status(500).send("Ocurrió un error al eliminar el producto");
        }
        return res.json({ status: "ok", message: "Producto y talle eliminados con éxito" });
    });
});

module.exports = router;
