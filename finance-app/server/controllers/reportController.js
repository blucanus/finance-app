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