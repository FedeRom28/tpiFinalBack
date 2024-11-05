const { conexion } = require('../config/conexion.js');
const { hashear } = require('@damianegreco/hashpass');

const getAdminByUsername = (username, callback) => {
    conexion.query('SELECT * FROM Administrador WHERE Nom_Admin = ?', [username], (error, results) => {
        if (error) {
            return callback(error, null);
        }
        callback(null, results[0]);
    });
};

const createAdmin = (admin, callback) => {
    const { Nom_Admin, Contraseña } = admin;
    const hashedPassword = hashear(Contraseña);
    conexion.query(
        'INSERT INTO Administrador (Nom_Admin, Contraseña) VALUES (?, ?)',
        [Nom_Admin, hashedPassword],
        (error, result) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, result.insertId);
        }
    );
};

const addMultipleAdmins = (admins, callback) => {
    const values = admins.map(admin => [admin.nomadmin, hashear(admin.contrasena)]);
    conexion.query(
        'INSERT INTO Administrador (Nom_Admin, Contraseña) VALUES ?',
        [values],
        (error, result) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, result.affectedRows);
        }
    );
};

module.exports = {
    getAdminByUsername,
    createAdmin,
    addMultipleAdmins
};