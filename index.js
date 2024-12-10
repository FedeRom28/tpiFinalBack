const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// Configuración de CORS
const corsOptions = {
  origin: "http://localhost:5174", // Permitir solicitudes desde este origen
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Encabezados permitidos
};

app.use(cors(corsOptions));
app.use(express.json());

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
