const { conexion } = require('../config/conexion.js');

const getAllProducts = (callback) => {
    conexion.query('SELECT * FROM Productos', (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results);
    });
};

const createProduct = (product, callback) => {
    const { nombre, descripcion, precio, id_categoria } = product;
    conexion.query(
        'INSERT INTO Productos (nombre, descripcion, precio, id_categoria) VALUES (?, ?, ?, ?)',
        [nombre, descripcion, precio, id_categoria],
        (error, result) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, result.insertId);
        }
    );
};

module.exports = {
    getAllProducts,
    createProduct
};