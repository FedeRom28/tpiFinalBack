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

// Obtener un producto específico por ID
router.get("/:id", function (req, res, next) {
  const { id } = req.params;
  const sql = "SELECT * FROM productos WHERE id = ?";
  conexion.query(sql, [id], function (error, result) {
    if (error) {
      console.error(error);
      return res.send("Ocurrió un error al obtener el producto");
    }
    res.json({
      status: "ok",
      producto: result
    });
  });
});

// Crear un nuevo producto
router.post("/", function (req, res, next) {
  const { nombre_producto, descripcion, precio, id_categorias } = req.body;

  const sql = `INSERT INTO productos (nombre_producto, descripcion, precio, id_categorias) VALUES (?, ?, ?, ?)`;
  conexion.query(sql, [nombre_producto, descripcion, precio, id_categorias], function (error, result) {
    if (error) {
      console.error(error);
      return res.send("Ocurrió un error al agregar el producto");
    }
    res.json({ status: "ok", message: "Producto agregado con éxito" });
  });
});

// Actualizar un producto por ID
router.put("/:id", function (req, res, next) {
  const { id } = req.params;
  const { nombre_producto, descripcion, precio, id_categorias } = req.body;

  const sql = `UPDATE productos SET nombre_producto = ?, descripcion = ?, precio = ?, id_categorias = ? WHERE id = ?`;
  conexion.query(sql, [nombre_producto, descripcion, precio, id_categorias, id], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).send("Ocurrió un error al actualizar el producto");
    }
    res.json({ status: "ok", message: "Producto actualizado con éxito" });
  });
});

// Eliminar un producto por ID
router.delete("/:id", function (req, res, next) {
  const { id } = req.params;

  const sql = `DELETE FROM productos WHERE id = ?`;
  conexion.query(sql, [id], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).send("Ocurrió un error al eliminar el producto");
    }
    res.json({ status: "ok", message: "Producto eliminado con éxito" });
  });
});

module.exports = router;
