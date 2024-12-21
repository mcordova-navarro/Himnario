require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Para parsear el cuerpo de las solicitudes

// Conexión a MongoDB (si decides usarlo)
const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost:27017/himnario'; // Aquí pones tu URI
mongoose.connect('mongodb://localhost:27017/himnario')
  .then(() => console.log('Conexión a la base de datos exitosa'))
  .catch((err) => console.error('Error de conexión a la base de datos:', err));

// Ruta de ejemplo para obtener sugerencias
app.get('/api/sugeridos', (req, res) => {
  // Aquí traerás los datos de los himnarios más buscados, por ejemplo.
  res.json([
    { id: 1, titulo: 'Himnario Navideño', popularidad: 95 },
    { id: 2, titulo: 'Himnario Majestuoso', popularidad: 85 },
  ]);
});

// Ruta para obtener himnarios disponibles (simula "más himnarios")
app.get('/api/himnarios', (req, res) => {
  res.json([
    { id: 1, nombre: 'Himnario Navideño', detalles: 'Detalles de este himnario' },
    { id: 2, nombre: 'Himnario Majestuoso', detalles: 'Detalles de este himnario' },
  ]);
});

// Ruta para agregar himnario (simula la descarga)
app.post('/api/agregar-himnario', (req, res) => {
  const { himnarioId } = req.body;
  // Aquí puedes manejar la lógica para "agregar" un himnario, como simular la descarga
  res.json({ message: `Himnario ${himnarioId} agregado a tu dispositivo.` });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});


const Himnario = require('./models/Himnario');

// Ruta para obtener himnarios disponibles
app.get('/api/himnarios', async (req, res) => {
  try {
    const himnarios = await Himnario.find();
    res.json(himnarios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los himnarios' });
  }
});
