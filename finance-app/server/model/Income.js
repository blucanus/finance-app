const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor proporcione un nombre para el ingreso'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  amount: {
    type: Number,
    required: [true, 'Por favor proporcione una cantidad'],
    min: [0, 'La cantidad no puede ser negativa']
  },
  type: {
    type: String,
    required: [true, 'Por favor especifique el tipo de ingreso'],
    enum: ['efectivo', 'digital'],
    default: 'efectivo'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Método para formatear la cantidad como moneda
IncomeSchema.methods.formatAmount = function() {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(this.amount);
};

// Índice para mejorar las consultas por fecha
IncomeSchema.index({ date: 1 });

module.exports = mongoose.model('Income', IncomeSchema);