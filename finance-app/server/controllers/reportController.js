const Income = require('../model/Income');
const Expense = require('../model/Expense');

exports.getIncomesByType = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const incomesByType = await Income.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end }
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
    
    res.status(200).json({ success: true, data: incomesByType });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getIncomesByName = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const incomesByName = await Income.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end }
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
    
    res.status(200).json({ success: true, data: incomesByName });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getBalance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren ambas fechas'
      });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

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