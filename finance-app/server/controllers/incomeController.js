const Income = require('../model/Income');


// Crear un nuevo ingreso
exports.createIncome = async (req, res) => {
  try {
    const income = new Income(req.body);
    await income.save();
    res.status(201).json({
      success: true,
      data: income
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Obtener todos los ingresos
exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find().sort('-date');
    res.status(200).json({
      success: true,
      count: incomes.length,
      data: incomes
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Obtener un ingreso específico
exports.getIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({
        success: false,
        error: 'Ingreso no encontrado'
      });
    }
    res.status(200).json({
      success: true,
      data: income
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Actualizar un ingreso
exports.updateIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!income) {
      return res.status(404).json({
        success: false,
        error: 'Ingreso no encontrado'
      });
    }
    res.status(200).json({
      success: true,
      data: income
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Eliminar un ingreso
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) {
      return res.status(404).json({
        success: false,
        error: 'Ingreso no encontrado'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Generar reporte de ingresos por rango de fechas
exports.getIncomesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const incomes = await Income.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).sort('date');
    
    res.status(200).json({
      success: true,
      count: incomes.length,
      data: incomes
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Generar reporte de ingresos por tipo
exports.getIncomesByType = async (req, res) => {
  try {
    const incomesByType = await Income.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: incomesByType
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Generar reporte de ingresos por nombre
exports.getIncomesByName = async (req, res) => {
  try {
    const incomesByName = await Income.aggregate([
      {
        $group: {
          _id: '$name',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: incomesByName
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};