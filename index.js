const express = require("express");
const cors = require("cors"); // Importar cors
const app = express();
const port = 3000;

app.use(express.json());

// Configuración de CORS
app.use(cors({ origin: 'http://localhost:3000'}));

const apiMain = require('./API/main.js');

app.get("/", function (req, res, next) {
    res.send("app express");
});

app.use('/API/', apiMain);

app.listen(port, () => {
    console.log(`Ejecutando servidor en puerto ${port}`);
});

app.get("/test", (req, res) => {
    res.send('/test');
});
