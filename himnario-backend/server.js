require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Himnario = require('./models/Himnario'); // Importa el modelo
const SearchLog = require('./models/SearchLog'); // Importa el modelo SearchLog

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

// 1. Obtener todos los himnarios
app.get('/api/himnarios', async (req, res) => {
  try {
    const himnarios = await Himnario.find(); // Obtiene todos los himnarios
    res.json(himnarios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los himnarios' });
  }
});

// 2. Buscar un himnario por su `tag`
app.get('/api/himnarios/:tag', async (req, res) => {
  const { tag } = req.params;

  try {
    const himnario = await Himnario.findOne({ tag });
    if (!himnario) {
      return res.status(404).json({ error: 'Himnario no encontrado' });
    }

    // Registra la búsqueda
    await SearchLog.create({ tag, title: himnario.title });

    res.json(himnario);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar el himnario' });
  }
});

// 3. Agregar un nuevo himnario (opcional)
app.post('/api/himnarios', async (req, res) => {
  try {
    const himnario = new Himnario(req.body); // Crea un nuevo himnario con los datos enviados
    await himnario.save();
    res.status(201).json({ message: 'Himnario agregado correctamente', himnario });
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar el himnario' });
  }
});

// 4. Obtener(listar) los himnarios más buscados
app.get('/himnarios/mas-buscados', async (req, res) => {
  const { limit } = req.query; // Número máximo de resultados a devolver

  try {
      // Obtener todos los himnarios
      const himnarios = await Himnario.find();

      // Combinar todos los himnos de los himnarios
      let todosLosHimnos = [];
      himnarios.forEach(himnario => {
          todosLosHimnos = [...todosLosHimnos, ...himnario.hymns];
      });

      // Ordenar por vistas (views) en orden descendente
      todosLosHimnos.sort((a, b) => (b.views || 0) - (a.views || 0));

      // Limitar los resultados si se especifica
      const resultado = limit ? todosLosHimnos.slice(0, parseInt(limit, 10)) : todosLosHimnos;

      res.status(200).json(resultado);
  } catch (error) {
      res.status(500).json({ message: 'Error interno del servidor', error });
  }
});



//5. Buscar Himno por número o título
app.get('/himnarios/:id/himnos', async (req, res) => {
  const { id } = req.params;
  const { numero, titulo } = req.query; // Parámetros de búsqueda

  try {
    const himnario = await Himnario.findById(id);
    if (!himnario) {
      return res.status(404).json({ message: 'Himnario no encontrado' });
    }

    let himno;

    if (numero) {
      himno = himnario.hymns.find(h => h.number === parseInt(numero, 10));
    } else if (titulo) {
      himno = himnario.hymns.find(h => h.title.toLowerCase() === titulo.toLowerCase());
    }

    if (!himno) {
      return res.status(404).json({ message: 'Himno no encontrado' });
    }

    // Incrementar vistas
    himno.views = (himno.views || 0) + 1;
    await himnario.save();

    res.status(200).json(himno);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
});









// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
