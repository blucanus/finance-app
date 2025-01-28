const Income = require('../model/Income');

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

exports.getIncomesByType = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const incomesByType = await Income.aggregate([
      {
        $match: {
          date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
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

exports.getIncomesByName = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const incomesByName = await Income.aggregate([
      {
        $match: {
          date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
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
// reportController.js (agregar este nuevo método)
exports.getBalance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Calcular total de ingresos
    const incomeResult = await Income.aggregate([
      {
        $match: {
          date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);
    
    // Calcular total de gastos
    const expenseResult = await Expense.aggregate([
      {
        $match: {
          date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    const incomeTotal = incomeResult[0]?.total || 0;
    const expenseTotal = expenseResult[0]?.total || 0;
    const balance = incomeTotal - expenseTotal;

    res.status(200).json({
      success: true,
      data: {
        incomeTotal,
        expenseTotal,
        balance
      }
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
