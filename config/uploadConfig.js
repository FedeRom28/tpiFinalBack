const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de almacenamiento con verificación de duplicados
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const filename = file.originalname;
    const filepath = path.join(__dirname, '../uploads/', filename);

    // Comprobar si el archivo ya existe
    if (fs.existsSync(filepath)) {
      cb(null, filename); // Usa el nombre del archivo existente
    } else {
      cb(null, filename); // Crea un nuevo archivo si no existe
    }
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
