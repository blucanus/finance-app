const express = require('express');
const router = express.Router();
const {
  createIncome,
  getIncomes,
  getIncome,
  updateIncome,
  deleteIncome
} = require('../controllers/incomeController');

router.route('/').get(getIncomes).post(createIncome);
router.route('/:id').get(getIncome).put(updateIncome).delete(deleteIncome);

module.exports = router;