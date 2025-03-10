const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nombre del gasto requerido'],
    trim: true,
    maxlength: 100
  },
  amount: {
    type: Number,
    required: [true, 'Monto requerido'],
    min: [0, 'El monto no puede ser negativo']
  },
  category: {
    type: String,
    required: true,
    enum: ['comida', 'transporte', 'vivienda', 'entretenimiento', 'salud', 'otros'],
    default: 'otros'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', ExpenseSchema);