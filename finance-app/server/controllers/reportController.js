const Income = require('../model/Income');
const Expense = require('../model/Expense');

const getDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};

// Balance general
exports.getBalance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren ambas fechas (startDate y endDate)'
      });
    }

    const { start, end } = getDateRange(startDate, endDate);

    const [incomeResult, expenseResult] = await Promise.all([
      Income.aggregate([
        { $match: { date: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Expense.aggregate([
        { $match: { date: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    const incomeTotal = incomeResult[0]?.total || 0;
    const expenseTotal = expenseResult[0]?.total || 0;

    res.status(200).json({
      success: true,
      data: {
        incomeTotal,
        expenseTotal,
        balance: incomeTotal - expenseTotal
      }
    });
    
  } catch (error) {
    console.error('Error en getBalance:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Reporte por tipo de ingreso (Método corregido)
exports.getIncomesByType = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { start, end } = getDateRange(startDate, endDate);

    const data = await Income.aggregate([
      { 
        $match: { 
          date: { $gte: start, $lte: end } 
        } 
      }, // Paréntesis correctamente cerrado
      { 
        $group: { 
          _id: '$type', 
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Reporte por nombre de ingreso (Método corregido)
exports.getIncomesByName = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { start, end } = getDateRange(startDate, endDate);

    const data = await Income.aggregate([
      { 
        $match: { 
          date: { $gte: start, $lte: end } 
        } 
      }, // Paréntesis correctamente cerrado
      { 
        $group: { 
          _id: '$name',
          total: { $sum: '$amount' },
          type: { $first: '$type' },
          date: { $first: '$date' }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Detalle completo de ingresos
exports.getDetailedIncomes = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { start, end } = getDateRange(startDate, endDate);

    const data = await Income.find({ 
      date: { $gte: start, $lte: end } 
    }).sort('-date');

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Detalle completo de gastos
exports.getDetailedExpenses = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { start, end } = getDateRange(startDate, endDate);

    const data = await Expense.find({ 
      date: { $gte: start, $lte: end } 
    }).sort('-date');

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};