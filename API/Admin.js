const express = require("express");
const router = express.Router();
const { conexion } = require('../db/conexion');
const { hashPass, verificarToken, generarToken, verificarPass } = require('@damianegreco/hashpass');

// Obtener todos los administradores
router.get("/", function (req, res, next) {
  const sql = "SELECT ID_administrador, nomadmin, contraseña FROM administradores"; // Eliminado 'roll'
  conexion.query(sql, function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).send("Ocurrió un error al obtener los administradores");
    }
    res.json({
      status: "ok",
      administradores: result
    });
  });
});

// Obtener un administrador por ID
router.get("/:id", function (req, res, next) {
  const { id } = req.params;
  const sql = "SELECT ID_administrador, nomadmin, contraseña FROM administradores WHERE ID_administrador = ?"; // Eliminado 'roll'
  conexion.query(sql, [id], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).send("Ocurrió un error al obtener el administrador");
    }
    if (result.length === 0) {
      return res.status(404).send("Administrador no encontrado");
    }
    res.json({
      status: "ok",
      administrador: result[0]
    });
  });
});

// Crear un nuevo administrador
router.post("/", async function (req, res, next) {
  const { nomadmin, contraseña } = req.body;

  try {
    const hashedPassword = await hashpassword(contraseña);
    const sql = `INSERT INTO administrador(nomadmin, contraseña) VALUES (?, ?)`; 
    conexion.query(sql, [nomadmin, hashedPassword], function (error, result) {
      if (error) {
        console.error(error);
        return res.status(500).send("Ocurrió un error al agregar el administrador");
      }
      res.json({ status: "ok", message: "Administrador agregado con éxito", ID_administrador: result.insertId });
    });
  } catch (error) {
    console.error("Error al encriptar la contraseña:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Actualizar un administrador
router.put("/:id", async function (req, res, next) {
  const { id } = req.params;
  const { nomadmin, contraseña } = req.body; 

  try {
    const hashedPassword = await hashpassword(contraseña);
    const sql = "UPDATE administrador SET nomadmin = ?, contraseña = ? WHERE ID_administrador = ?";
    conexion.query(sql, [nomadmin, hashedPassword, id], function (error, result) {
      if (error) {
        console.error(error);
        return res.status(500).send("Ocurrió un error al actualizar el administrador");
      }
      res.json({ status: "ok", message: "Administrador actualizado con éxito" });
    });
  } catch (error) {
    console.error("Error al encriptar la contraseña:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Eliminar un administrador
router.delete("/:id", function (req, res, next) {
  const { id } = req.params;
  const sql = "DELETE FROM administrador WHERE ID_administrador = ?";
  conexion.query(sql, [id], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).send("Ocurrió un error al eliminar el administrador");
    }
    res.json({ status: "ok", message: "Administrador eliminado con éxito" });
  });
});

module.exports = router;
