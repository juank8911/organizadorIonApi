const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  creadoPor:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  fechaVencimiento: {
    type: Date,
    required: true,
  },
  asignadoA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  estado: {
    type: String,
    enum: ['asignado', 'en espera', 'finalizado'],
    default: 'asignado',
  },
  comentarios: [
    {
      usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      contenido: String,
      fecha: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  log: [
    {
      usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      accion: String,
      fecha: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model('Task', taskSchema);
