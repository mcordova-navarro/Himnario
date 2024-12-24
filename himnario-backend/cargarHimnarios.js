require('dotenv').config();
const mongoose = require('mongoose');
const Himnario = require('./models/Himnario');
const fs = require('fs').promises; // Usar promesas para evitar bloqueos
const path = require('path');

// Conexión a MongoDB
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)
  .then(() => console.log(`Conexión exitosa a MongoDB: ${dbURI}`))
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err.message);
    process.exit(1);
  });

// Ruta de la carpeta de himnarios
const directoryPath = path.join(__dirname, 'data/himnarios');

// Función para cargar los himnarios
async function cargarHimnarios() {
  try {
    const files = await fs.readdir(directoryPath); // Leer todos los archivos en la carpeta

    // Itera sobre cada archivo JSON
    for (let file of files) {
      const filePath = path.join(directoryPath, file);
      const content = JSON.parse(await fs.readFile(filePath, 'utf8')); // Leer y parsear el archivo JSON

      // Crear el documento de Himnario a partir del archivo JSON
      const himnario = new Himnario(content);

      // Intentar guardar el himnario en la base de datos
      try {
        await himnario.save();
        console.log(`Himnario "${content.title}" guardado correctamente.`);
      } catch (err) {
        console.error(`Error al guardar el himnario "${content.title}":`, err.message);
      }
    }
    mongoose.disconnect(); // Desconectar de MongoDB una vez completado
  } catch (err) {
    console.error('Error al leer la carpeta de himnarios:', err.message);
    mongoose.disconnect(); // Desconectar de MongoDB si ocurre un error
    process.exit(1);
  }
}

// Llamar a la función para cargar los himnarios
cargarHimnarios();
