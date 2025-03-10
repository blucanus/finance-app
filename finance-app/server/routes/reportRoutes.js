const express = require('express');
const router = express.Router();
const {
  getIncomesByType,
  getIncomesByName,
  getBalance
} = require('../controllers/reportController');

router.get('/balance', getBalance);
router.get('/by-type', getIncomesByType);
router.get('/by-name', getIncomesByName);

module.exports = router;