const mongoose = require('mongoose');

const himnarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  detalles: { type: String, required: true },
  popularidad: { type: Number, default: 0 }
});

const Himnario = mongoose.model('Himnario', himnarioSchema);
module.exports = Himnario;
