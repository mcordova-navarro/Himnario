const mongoose = require('mongoose');

const searchLogSchema = new mongoose.Schema({
  tag: String, // Tag del himnario buscado
  title: String, // Título del himnario buscado
  date: { type: Date, default: Date.now }, // Fecha de la búsqueda
});

module.exports = mongoose.model('SearchLog', searchLogSchema);
