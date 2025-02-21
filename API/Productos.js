const express = require("express");
const router = express.Router();
const { conexion } = require('../db/conexion');
const upload = require('../config/uploadConfig'); // Importar la configuración de uploadConfig

// Crear un nuevo producto con imagen, talle y cantidad
router.post("/", upload.single('imagen'), function (req, res, next) {
    const { nom_producto, descripcion, precio, id_categorias, id_talles, cantidad } = req.body;
    const imagen = req.file ? req.file.filename : null;

    console.log(req.file, imagen);
    
    if(imagen !== null){
        const sqlProducto = "INSERT INTO productos (nom_producto, descripcion, precio, id_categorias, imagen, id_talles, cantidad) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const valoresProducto = [nom_producto, descripcion, precio, id_categorias, imagen, id_talles, cantidad];

        conexion.query(sqlProducto, valoresProducto, function (error, result) {
            if (error) {
                console.error(error);
                return res.status(500).send("Ocurrió un error al agregar el producto");
            }
            return res.json({ status: "ok", message: "Producto agregado con éxito" });
        });
    } else {
        const sqlProducto = "INSERT INTO productos (nom_producto, descripcion, precio, id_categorias, id_talles, cantidad) VALUES (?, ?, ?, ?, ?, ?)";
        const valoresProducto = [nom_producto, descripcion, precio, id_categorias, id_talles, cantidad];

        conexion.query(sqlProducto, valoresProducto, function (error, result) {
            if (error) {
                console.error(error);
                return res.status(500).send("Ocurrió un error al agregar el producto");
            }
            return res.json({ status: "ok", message: "Producto agregado con éxito" });
        });
    }
});

// Actualizar un producto por ID con imagen, talle y cantidad
router.put("/:id", upload.single('imagen'), function (req, res, next) {
    const { id } = req.params;
    const { nom_producto, descripcion, precio, id_categorias, id_talles, cantidad } = req.body;
    const imagen = req.file ? req.file.filename : null;

    console.log(req.file, imagen);

    if(imagen !== null){
        console.log("Se actualizó con imagen");
        
        const sqlProducto = "UPDATE productos SET nom_producto = ?, descripcion = ?, precio = ?, id_categorias = ?, imagen = ?, id_talles = ?, cantidad = ? WHERE id_productos = ?";
        const valoresProducto = [nom_producto, descripcion, precio, id_categorias, imagen, id_talles, cantidad, id];
        
        conexion.query(sqlProducto, valoresProducto, function (error) {
            if (error) {
                console.error(error);
                return res.status(500).send("Ocurrió un error al actualizar el producto");
            }
            console.log("Producto actualizado con éxito");
            return res.json({ status: "ok", message: "Producto actualizado con éxito" });
        });
    } else {
        console.log("Se actualizó sin imagen");
        
        const sqlProducto = "UPDATE productos SET nom_producto = ?, descripcion = ?, precio = ?, id_categorias = ?, id_talles = ?, cantidad = ? WHERE id_productos = ?";
        const valoresProducto = [nom_producto, descripcion, precio, id_categorias, id_talles, cantidad, id];
        
        conexion.query(sqlProducto, valoresProducto, function (error) {
            if (error) {
                console.error(error);
                return res.status(500).send("Ocurrió un error al actualizar el producto");
            }
            console.log("Producto actualizado con éxito");
            return res.json({ status: "ok", message: "Producto actualizado con éxito" });
        });
    }
});

// Eliminar un producto por ID
router.delete("/:id", function (req, res, next) {
    const { id } = req.params;
    const sqlDeleteProducto = "DELETE FROM productos WHERE id_productos = ?";
    conexion.query(sqlDeleteProducto, [id], function (error, result) {
        if (error) {
            console.error(error);
            return res.status(500).send("Ocurrió un error al eliminar el producto");
        }
        return res.json({ status: "ok", message: "Producto eliminado con éxito" });
    });
});

module.exports = router;
