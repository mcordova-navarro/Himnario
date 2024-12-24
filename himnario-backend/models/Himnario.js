const mongoose = require('mongoose');

// Esquema para el himnario
const himnarioSchema = new mongoose.Schema({
  tag: { type: String, required: true, unique: true }, // Asegura que cada tag sea único
  title: { type: String, required: true },
  hymns: [
    {
      number: { type: Number, required: true },
      title: { type: String, required: true },
      verses: { type: [String], required: true },
      chorus: { type: String, default: "" }, // Agregado para manejar el campo chorus si está vacío
      views: { type: Number, default: 0 }
    },
  ],
});

// Modelo de Himnario
const Himnario = mongoose.model('Himnario', himnarioSchema);

module.exports = Himnario;
