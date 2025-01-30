const express = require("express");
const router = express.Router();
const { conexion } = require('../db/conexion');
const multer = require("multer");

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'imagen/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Crear un nuevo producto con imagen
router.post("/", upload.single('imagen'), function (req, res, next) {
    const { nom_producto, descripcion, precio, id_categorias } = req.body;
    const imagen = req.file ? req.file.filename : null;
    const sql = "INSERT INTO productos (nom_producto, descripcion, precio, id_categorias, imagen) VALUES (?, ?, ?, ?, ?)";
    const valores = [nom_producto, descripcion, precio, id_categorias, imagen];
    conexion.query(sql, valores, function (error, result) {
        if (error) {
            console.error(error);
            return res.send("Ocurrió un error al agregar el producto");
        }
        return res.json({ status: "ok", message: "Producto agregado con éxito" });
    });
});

// Actualizar un producto por ID con imagen
router.put("/:id", upload.single('imagen'), function (req, res, next) {
    const { id } = req.params;
    const { nom_producto, descripcion, precio, id_categorias } = req.body;
    const imagen = req.file ? req.file.filename : null;
    const sql = "UPDATE productos SET nom_producto = ?, descripcion = ?, precio = ?, id_categorias = ?, imagen = ? WHERE id_productos = ?";
    const valores = [nom_producto, descripcion, precio, id_categorias, imagen, id];
    conexion.query(sql, valores, function (error, result) {
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
