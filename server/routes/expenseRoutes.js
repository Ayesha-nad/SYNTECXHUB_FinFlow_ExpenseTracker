const express = require('express');
const router = express.Router();
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary,
  seedSampleData
} = require('../controllers/expenseController');

// Summary route (must be before /:id)
router.get('/summary', getSummary);

// Sample seed route for rapid onboarding & demonstration
router.post('/seed', seedSampleData);

// Base CRUD routes
router.route('/')
  .get(getExpenses)
  .post(createExpense);

router.route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;
