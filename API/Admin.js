const mysql = require('mysql');
const bcrypt = require('bcrypt');

// Configuración de la conexión a la base de datos
const conexion = mysql.createConnection({
    host: 'ctpoba.edu.ar',     // Cambia por tu host
    user: 'rodriguezj',         // Cambia por tu usuario
    password: '46334366',       // Cambia por tu contraseña
    database: '24_72_b'         // Cambia por el nombre de tu base de datos
});

// Conectar a la base de datos
conexion.connect((err) => {
    if (err) {
        console.error('Error al conectar:', err);
        return;
    }
    console.log('Conectado a la base de datos');

    // Información de las cuentas
    const admins = [
        { nomadmin: 'rodriguezj', contrasena: '46334366' },
        { nomadmin: 'lemesn', contrasena: '46087116' }
    ];

    // Función para encriptar e insertar cada cuenta
    admins.forEach((admin) => {
        bcrypt.hash(admin.contrasena, 10, (err, hash) => {
            if (err) {
                console.error(`Error al encriptar la contraseña de ${admin.nomadmin}:`, err);
                return;
            }

            // Consulta para insertar el administrador
            const insertarAdmin = `
                INSERT INTO Administrador (IDadministrador, Nomadmin, Contraseña)
                VALUES (NULL, ?, ?)
            `;

            conexion.query(insertarAdmin, [admin.nomadmin, hash], (err, result) => {
                if (err) {
                    console.error(`Error al insertar el administrador ${admin.nomadmin}:`, err);
                    return;
                }
                console.log(`Administrador ${admin.nomadmin} insertado correctamente con contraseña encriptada`);
            });
        });
    });

    // Cerrar la conexión después de las inserciones
    setTimeout(() => {
        conexion.end((err) => {
            if (err) {
                console.error('Error al cerrar la conexión:', err);
            } else {
                console.log('Conexión cerrada');
            }
        });
    }, 3000); // Asegura que todas las inserciones terminen antes de cerrar la conexión
});
