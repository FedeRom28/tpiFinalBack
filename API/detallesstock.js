const express = require("express");
const router = express.Router();
const { conexion } = require('../db/conexion');

// Obtener todos los detalles de stock
router.get("/", function (req, res, next) {
  const sql = "SELECT * FROM detallesstock";
  conexion.query(sql, function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).send("Ocurrió un error al obtener los detalles de stock");
    }
    return res.json({
      status: "ok",
      detallesstock: result
    });
  });
});

// Obtener un detalle de stock específico por id_Dstock
router.get("/:id_Dstock", function (req, res, next) {
  const { id_Dstock } = req.params;
  const sql = "SELECT * FROM detallesstock WHERE id_Dstock = ?";
  conexion.query(sql, [id_Dstock], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).send("Ocurrió un error al obtener el detalle de stock");
    }
    return res.json({
      status: "ok",
      detalle: result
    });
  });
});

// Crear un nuevo detalle de stock
router.post("/", function (req, res, next) {
  const { cantidad, talles, id_productos } = req.body;

  const sql = `INSERT INTO detallesstock (cantidad, talles, id_productos) VALUES (?, ?, ?)`;
  conexion.query(sql, [cantidad, talles, id_productos], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).send("Ocurrió un error al agregar el detalle de stock");
    }
    return res.json({ status: "ok", message: "Detalle de stock agregado con éxito", id_Dstock: result.insertId });
  });
});

// Actualizar un detalle de stock
router.put("/:id_Dstock", function (req, res, next) {
  const { id_Dstock } = req.params;
  const { cantidad, talles, id_productos } = req.body;

  const sql = `UPDATE detallesstock SET cantidad = ?, talles = ?, id_productos = ? WHERE id_Dstock = ?`;
  conexion.query(sql, [cantidad, talles, id_productos, id_Dstock], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).send("Ocurrió un error al actualizar el detalle de stock");
    }
    return res.json({ status: "ok", message: "Detalle de stock actualizado con éxito" });
  });
});

// Eliminar un detalle de stock por id_Dstock
router.delete("/:id_Dstock", function (req, res, next) {
  const { id_Dstock } = req.params;

  const sql = `DELETE FROM detallesstock WHERE id_Dstock = ?`;
  conexion.query(sql, [id_Dstock], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).send("Ocurrió un error al eliminar el detalle de stock");
    }
    return res.json({ status: "ok", message: "Detalle de stock eliminado con éxito" });
  });
});

module.exports = router;
