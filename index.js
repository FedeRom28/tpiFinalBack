const express = require("express");
const cors = require("cors");
const multer = require("multer");
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

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'imagen/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const apiMain = require('./api/main.js');

app.get("/", function (req, res, next) {
  res.send("app express");
});

app.use('/api/', apiMain);

// Ruta de ejemplo para cargar archivos
app.post('/api/upload', upload.single('imagen'), (req, res) => {
  if (req.file) {
    res.json({ message: 'Archivo cargado correctamente', file: req.file });
  } else {
    res.status(400).json({ message: 'Error al cargar el archivo' });
  }
});

app.listen(port, () => {
  console.log(`Ejecutando servidor en puerto ${port}`);
});

app.get("/test", (req, res) => {
  res.send('/test');
});
