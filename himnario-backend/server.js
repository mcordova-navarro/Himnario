require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Himnario = require('./models/Himnario'); // Importa el modelo

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors()); // Permite conexiones entre el frontend y el backend
app.use(express.json()); // Para manejar datos en formato JSON

// Conexión a MongoDB
const dbURI = process.env.MONGO_URI;
mongoose
  .connect(dbURI)
  .then(() => console.log(`Conexión exitosa a MongoDB: ${dbURI}`))
  .catch((err) => console.error('Error al conectar a MongoDB:', err.message));

// Rutas
app.get('/api/himnos', async (req, res) => {
  try {
    const himnos = await Himnario.find(); // Obtiene himnos desde la base de datos
    res.json(himnos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los himnos' });
  }
});

// Ruta de prueba para agregar himnos (solo para inicializar datos)
app.post('/api/himnos', async (req, res) => {
  try {
    const himno = new Himnario(req.body); // Crea un nuevo himno con los datos enviados
    await himno.save();
    res.status(201).json({ message: 'Himno agregado correctamente', himno });
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar el himno' });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});




