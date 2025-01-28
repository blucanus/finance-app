const express = require('express');
const router = express.Router();
const {
  getIncomesByDateRange,
  getIncomesByType,
  getIncomesByName
} = require('../controllers/reportController');
const { getBalance } = require('../controllers/reportController');

router.get('/balance', getBalance);

router.get('/date-range', getIncomesByDateRange);
router.get('/by-type', getIncomesByType);
router.get('/by-name', getIncomesByName);

module.exports = router;