const express = require("express");
const router = express.Router();
const { conexion } = require('../db/conexion');

// Obtener todos los administradores
router.get("/", function (req, res, next) {
  const sql = "SELECT * FROM administradores";
  conexion.query(sql, function (error, result) {
    if (error) {
      console.error(error);
      return res.send("Ocurrió un error al obtener los administradores");
    }
    res.json({
      status: "ok",
      administradores: result
    });
  });
});

// Obtener un administrador específico por ID
router.get("/:id", function (req, res, next) {
  const { id } = req.params;
  const sql = "SELECT * FROM administradores WHERE ID_administrador = ?";
  conexion.query(sql, [id], function (error, result) {
    if (error) {
      console.error(error);
      return res.send("Ocurrió un error al obtener el administrador");
    }
    res.json({
      status: "ok",
      administrador: result
    });
  });
});

// Crear un nuevo administrador
router.post("/", function (req, res, next) {
  const { nomadmin, contraseña, roll } = req.body;

  const sql = `INSERT INTO administradores (nomadmin, contraseña, roll) VALUES (?, ?, ?)`;
  conexion.query(sql, [nomadmin, contraseña, roll], function (error, result) {
    if (error) {
      console.error(error);
      return res.send("Ocurrió un error al agregar el administrador");
    }
    res.json({ status: "ok", message: "Administrador agregado con éxito" });
  });
});

// Actualizar un administrador por ID
router.put("/:id", function (req, res, next) {
  const { id } = req.params;
  const { nomadmin, contraseña, roll } = req.body;

  const sql = `UPDATE administradores SET nomadmin = ?, contraseña = ?, roll = ? WHERE ID_administrador = ?`;
  conexion.query(sql, [nomadmin, contraseña, roll, id], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).send("Ocurrió un error al actualizar el administrador");
    }
    res.json({ status: "ok", message: "Administrador actualizado con éxito" });
  });
});

// Eliminar un administrador por ID
router.delete("/:id", function (req, res, next) {
  const { id } = req.params;

  const sql = `DELETE FROM administradores WHERE ID_administrador = ?`;
  conexion.query(sql, [id], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).send("Ocurrió un error al eliminar el administrador");
    }
    res.json({ status: "ok", message: "Administrador eliminado con éxito" });
  });
});

module.exports = router;
