const express = require('express');
const router = express.Router();
const {
  getIncomesByType,
  getIncomesByName,
  getBalance,
  getDetailedIncomes,
  getDetailedExpenses
} = require('../controllers/reportController');

// Balance general
router.get('/balance', getBalance);

// Reportes agregados
router.get('/by-type', getIncomesByType);
router.get('/by-name', getIncomesByName);

// Detalles completos
router.get('/detailed-incomes', getDetailedIncomes);
router.get('/detailed-expenses', getDetailedExpenses);

module.exports = router;