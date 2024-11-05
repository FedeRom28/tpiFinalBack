const { addMultipleAdmins } = require('./models/admin.js');

const admins = [
    { nomadmin: 'rodriguezj', contrasena: '46334366' },
    { nomadmin: 'lemesn', contrasena: '46087116' },
    { nomadmin: 'traimantep', contrasena: '46334366' },
    { nomadmin: 'romerof', contrasena: '46334369' }
];

addMultipleAdmins(admins, (error, result) => {
    if (error) {
        console.error('Error al agregar administradores:', error);
    } else {
        console.log(`${result} administradores agregados correctamente.`);
    }
    process.exit();
});