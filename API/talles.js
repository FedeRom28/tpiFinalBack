const express = require("express");
const router = express.Router();
const { conexion } = require('../db/conexion');

// Obtener todos los talles
router.get("/", function (req, res, next) {
  const sql = "SELECT * FROM talles";
  conexion.query(sql, function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).send("Ocurrió un error al obtener los talles");
    }
    return res.json({
      status: "ok",
      talles: result
    });
  });
});

// Obtener un talle específico por id_talles
router.get("/:id_talles", function (req, res, next) {
  const { id_talles } = req.params;
  const sql = "SELECT * FROM talles WHERE id_talles = ?";
  conexion.query(sql, [id_talles], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).send("Ocurrió un error al obtener el talle");
    }
    return res.json({
      status: "ok",
      talle: result
    });
  });
});

// Crear un nuevo talle
router.post("/", function (req, res, next) {
  const { nom_talles } = req.body;

  const sql = `INSERT INTO talles (nom_talles) VALUES (?)`;
  conexion.query(sql, [nom_talles], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).send("Ocurrió un error al agregar el talle");
    }
    return res.json({ status: "ok", message: "Talle agregado con éxito", id_talles: result.insertId });
  });
});

// Actualizar un talle
router.put("/:id_talles", function (req, res, next) {
  const { id_talles } = req.params;
  const { nom_talles } = req.body;

  const sql = `UPDATE talles SET nom_talles = ? WHERE id_talles = ?`;
  conexion.query(sql, [nom_talles, id_talles], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).send("Ocurrió un error al actualizar el talle");
    }
    return res.json({ status: "ok", message: "Talle actualizado con éxito" });
  });
});

// Eliminar un talle por id_talles
router.delete("/:id_talles", function (req, res, next) {
  const { id_talles } = req.params;

  const sql = `DELETE FROM talles WHERE id_talles = ?`;
  conexion.query(sql, [id_talles], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).send("Ocurrió un error al eliminar el talle");
    }
    return res.json({ status: "ok", message: "Talle eliminado con éxito" });
  });
});

module.exports = router;