const mysql = require('mysql');

const conexion = mysql.createConnection({
    host: "ctpoba.edu.ar",
    user: "rodriguezj",
    password: "46334366",
    database: "24_72_rodriguezj",
    port:5713
});

conexion.connect(function(error){
    if(error) {
        console.error(error);
        return;
    }     
    console.log("Conectado correctamente a la db")
});

module.exports = { conexion };