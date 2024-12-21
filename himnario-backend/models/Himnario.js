const mongoose = require('mongoose');

const himnarioSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  titulo: { type: String, required: true },
});

const Himnario = mongoose.model('Himnario', himnarioSchema);
module.exports = Himnario;
