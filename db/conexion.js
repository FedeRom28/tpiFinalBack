const mysql = require('mysql');

const conexion = mysql.createConnection({
<<<<<<< HEAD
    host: "ctpoba.edu.ar",
    user: "rodriguezj",
    password: "46334366",
    database: "24_72_rodriguezj" 
=======
    host:"ctpoba.edu.ar",
    user:"rodriguezj",
    password:"46334366",
    database:"24_72_b"
>>>>>>> main
});

conexion.connect(function(error){
    if(error) {
        console.error(error);
        return;
    }     
<<<<<<< HEAD
    console.log("Conectado correctamente a la db")
});

module.exports = { conexion };
=======

    console.log("Conectado correctamente a la db")
})

module.exports = { conexion } 
>>>>>>> main
