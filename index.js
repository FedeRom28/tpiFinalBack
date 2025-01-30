const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 3000;

// Configuración de CORS
const corsOptions = {
  origin: "http://localhost:5173", // Permitir solicitudes desde este origen
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Encabezados permitidos
};
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));
app.use(cors(corsOptions));
app.use(express.json());

const apiMain = require('./api/main.js');

app.get("/", function (req, res, next) {
  res.send("app express");
});

app.use('/api/', apiMain);

app.listen(port, () => {
  console.log(`Ejecutando servidor en puerto ${port}`);
});

app.get("/test", (req, res) => {
  res.send('/test');
});
