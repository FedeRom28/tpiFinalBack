const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { conexion } = require('../db/conexion');

// Obtener todos los usuarios
router.get("/", function (req, res, next) {
  const sql = "SELECT * FROM usuarios";
  conexion.query(sql, function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).send("Ocurrió un error al obtener los usuarios");
    }
    res.json({
      status: "ok",
      usuarios: result
    });
  });
});

// Obtener un usuario específico por id_usuarios
router.get("/:id_usuarios", function (req, res, next) {
  const { id_usuarios } = req.params;
  const sql = "SELECT * FROM usuarios WHERE id_usuarios = ?";
  conexion.query(sql, [id_usuarios], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).send("Ocurrió un error al obtener el usuario");
    }
    res.json({
      status: "ok",
      usuario: result
    });
  });
});

// Crear un nuevo usuario con contraseña encriptada
router.post("/", async function (req, res, next) {
  const { nom_usuario, password, roll } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = `INSERT INTO usuarios (nom_usuario, contraseña, roll) VALUES (?, ?, ?)`;
    conexion.query(sql, [nom_usuario, hashedPassword, roll], function (error, result) {
      if (error) {
        console.error(error);
        return res.status(500).send("Ocurrió un error al agregar el usuario");
      }
      res.json({ status: "ok", message: "Usuario agregado con éxito", id_usuarios: result.insertId });
    });
  } catch (error) {
    console.error("Error al encriptar la contraseña", error);
    res.status(500).send("Error al encriptar la contraseña");
  }
});

// Actualizar un usuario
router.put("/:id_usuarios", async function (req, res, next) {
  const { id_usuarios } = req.params;
  const { nom_usuario, password, roll } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = `UPDATE usuarios SET nom_usuario = ?, contraseña = ?, roll = ? WHERE id_usuarios = ?`;
    conexion.query(sql, [nom_usuario, hashedPassword, roll, id_usuarios], function (error, result) {
      if (error) {
        console.error(error);
        return res.status(500).send("Ocurrió un error al actualizar el usuario");
      }
      res.json({ status: "ok", message: "Usuario actualizado con éxito" });
    });
  } catch (error) {
    console.error("Error al encriptar la contraseña", error);
    res.status(500).send("Error al encriptar la contraseña");
  }
});

// Eliminar un usuario por id_usuarios
router.delete("/:id_usuarios", function (req, res, next) {
  const { id_usuarios } = req.params;

  const sql = `DELETE FROM usuarios WHERE id_usuarios = ?`;
  conexion.query(sql, [id_usuarios], function (error, result) {
    if (error) {
      console.error(error);
      return res.status(500).send("Ocurrió un error al eliminar el usuario");
    }
    res.json({ status: "ok", message: "Usuario eliminado con éxito" });
  });
});

module.exports = router;
