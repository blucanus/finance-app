const express = require('express');
const router = express.Router();
const {
  getIncomesByDateRange,
  getIncomesByType,
  getIncomesByName
} = require('../controllers/reportController');

router.get('/date-range', getIncomesByDateRange);
router.get('/by-type', getIncomesByType);
router.get('/by-name', getIncomesByName);

module.exports = router;