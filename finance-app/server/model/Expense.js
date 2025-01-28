// model/Expense.js
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor proporcione un nombre para el gasto'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  amount: {
    type: Number,
    required: [true, 'Por favor proporcione una cantidad'],
    min: [0, 'La cantidad no puede ser negativa']
  },
  category: {
    type: String,
    required: [true, 'Por favor especifique la categoría'],
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

// Método para formatear la cantidad
ExpenseSchema.methods.formatAmount = function() {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(this.amount);
};

module.exports = mongoose.model('Expense', ExpenseSchema);