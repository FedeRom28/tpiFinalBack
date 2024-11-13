const express = require('express');
const router = express.Router();
const { conexion } = require('../db/conexion');

// Obtener todas las categorías
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM categorias';
  conexion.query(sql, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ status: 'error', error: 'Ocurrió un error al obtener las categorías' });
    }
    res.json({ status: 'ok', categorias: results });
  });
});

// Obtener una categoría por ID
router.get('/:id_categorias', (req, res) => {
  const { id_categorias } = req.params;
  const sql = 'SELECT * FROM categorias WHERE id_categorias = ?';
  conexion.query(sql, [id_categorias], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ status: 'error', error: 'Ocurrió un error al obtener la categoría' });
    }
    if (result.length === 0) {
      return res.status(404).json({ status: 'error', error: 'Categoría no encontrada' });
    }
    res.json({ status: 'ok', categoria: result[0] });
  });
});

// Agregar una nueva categoría
router.post('/', (req, res) => {
  const { nom_categoria } = req.body;
  const sql = 'INSERT INTO categorias (nom_categoria) VALUES (?)';
  conexion.query(sql, [nom_categoria], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ status: 'error', error: 'Ocurrió un error al agregar la categoría' });
    }
    res.json({ status: 'ok', message: 'Categoría agregada exitosamente', id: result.insertId });
  });
});

// Actualizar una categoría
router.put('/:id_categorias', (req, res) => {
  const { id_categorias } = req.params;
  const { nom_categoria } = req.body;
  const sql = 'UPDATE categorias SET nom_categoria = ? WHERE id_categorias = ?';
  conexion.query(sql, [nom_categoria, id_categorias], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ status: 'error', error: 'Ocurrió un error al actualizar la categoría' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', error: 'Categoría no encontrada' });
    }
    res.json({ status: 'ok', message: 'Categoría actualizada exitosamente' });
  });
});

// Eliminar una categoría
router.delete('/:id_categorias', (req, res) => {
  const { id_categorias } = req.params;
  const sql = 'DELETE FROM categorias WHERE id_categorias = ?';
  conexion.query(sql, [id_categorias], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ status: 'error', error: 'Ocurrió un error al eliminar la categoría' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', error: 'Categoría no encontrada' });
    }
    res.json({ status: 'ok', message: 'Categoría eliminada exitosamente' });
  });
});

module.exports = router;
