const { Expense, CATEGORIES } = require('../models/Expense');
const { getIsConnected } = require('../config/db');

// In-memory / local fallback store with realistic PKR amounts
let fallbackExpenses = [
  {
    _id: 'exp_1',
    title: 'Supermarket Monthly Groceries',
    amount: 18500,
    category: 'Food',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    notes: 'Cooking oil, basmati rice, spices, milk, and household items',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
  },
  {
    _id: 'exp_2',
    title: 'Electricity & Utility Bill',
    amount: 24500,
    category: 'Bills',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    notes: 'LESCO electricity and gas monthly billing',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
  },
  {
    _id: 'exp_3',
    title: 'Car Fuel & Petrol Tank',
    amount: 9500,
    category: 'Transport',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    notes: 'Full tank fuel at PSO pump',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  },
  {
    _id: 'exp_4',
    title: 'High-speed Fiber Optic Internet',
    amount: 4500,
    category: 'Bills',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    notes: 'Monthly 50 Mbps unlimited fiber connection',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString()
  },
  {
    _id: 'exp_5',
    title: 'Family Dinner at Restaurant',
    amount: 7200,
    category: 'Food',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    notes: 'Weekend barbecue and dessert with family',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
  },
  {
    _id: 'exp_6',
    title: 'Clothing & Footwear Shopping',
    amount: 14800,
    category: 'Shopping',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    notes: 'Seasonal clothes and formal shoes from mall',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString()
  },
  {
    _id: 'exp_7',
    title: 'Gym Membership & Fitness',
    amount: 5500,
    category: 'Health',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    notes: 'Monthly fitness club fee and protein',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString()
  },
  {
    _id: 'exp_8',
    title: 'Cinema IMAX Tickets & Snacks',
    amount: 3200,
    category: 'Entertainment',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
    notes: 'Weekend movie with popcorn',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString()
  }
];

// Helper to calculate rich summaries
const calculateSummary = (expensesList) => {
  const totalSpent = expensesList.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const thisMonthExpenses = expensesList.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
  });

  const thisMonthSpent = thisMonthExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  // Group by category
  const categoryTotals = {};
  CATEGORIES.forEach((cat) => {
    categoryTotals[cat] = 0;
  });

  expensesList.forEach((item) => {
    const cat = item.category || 'Other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(item.amount || 0);
  });

  // Top category
  let topCategory = { category: 'None', amount: 0 };
  Object.entries(categoryTotals).forEach(([cat, amt]) => {
    if (amt > topCategory.amount) {
      topCategory = { category: cat, amount: amt };
    }
  });

  // Monthly trend (last 6 months)
  const monthlyTrend = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1);
    const monthKey = d.toLocaleString('default', { month: 'short' });
    const yearKey = d.getFullYear();
    const fullKey = `${monthKey} ${yearKey}`;

    const monthSpend = expensesList
      .filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate.getFullYear() === yearKey && itemDate.getMonth() === d.getMonth();
      })
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    monthlyTrend.push({ month: monthKey, label: fullKey, total: Number(monthSpend.toFixed(2)) });
  }

  // Highest single expense
  const highestExpense = expensesList.reduce(
    (max, item) => (item.amount > (max?.amount || 0) ? item : max),
    null
  );

  const count = expensesList.length;
  const averageExpense = count > 0 ? totalSpent / count : 0;

  return {
    totalSpent: Number(totalSpent.toFixed(2)),
    thisMonthSpent: Number(thisMonthSpent.toFixed(2)),
    expenseCount: count,
    averageExpense: Number(averageExpense.toFixed(2)),
    topCategory,
    categoryTotals,
    monthlyTrend,
    highestExpense
  };
};

/**
 * @desc Get all expenses with optional filtering, search, and sorting
 * @route GET /api/expenses
 */
const getExpenses = async (req, res) => {
  try {
    const { category, search, startDate, endDate, sortBy = 'date', order = 'desc' } = req.query;

    if (getIsConnected()) {
      const filter = {};

      if (category && category !== 'All') {
        filter.category = category;
      }

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { notes: { $regex: search, $options: 'i' } }
        ];
      }

      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          filter.date.$lte = end;
        }
      }

      const sortOptions = {};
      const sortDirection = order === 'asc' ? 1 : -1;
      sortOptions[sortBy] = sortDirection;

      const expenses = await Expense.find(filter).sort(sortOptions);
      return res.status(200).json({
        success: true,
        count: expenses.length,
        data: expenses,
        source: 'mongodb'
      });
    }

    // Fallback in-memory
    let filtered = [...fallbackExpenses];

    if (category && category !== 'All') {
      filtered = filtered.filter((e) => e.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (e) => (e.title && e.title.toLowerCase().includes(q)) || (e.notes && e.notes.toLowerCase().includes(q))
      );
    }

    if (startDate) {
      const start = new Date(startDate).getTime();
      filtered = filtered.filter((e) => new Date(e.date).getTime() >= start);
    }

    if (endDate) {
      const end = new Date(endDate).getTime() + (24 * 60 * 60 * 1000 - 1);
      filtered = filtered.filter((e) => new Date(e.date).getTime() <= end);
    }

    filtered.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'date' || sortBy === 'createdAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (sortBy === 'amount') {
        valA = Number(valA);
        valB = Number(valB);
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (order === 'asc') {
        return valA > valB ? 1 : -1;
      }
      return valA < valB ? 1 : -1;
    });

    return res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
      source: 'local'
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve expenses',
      error: error.message
    });
  }
};

/**
 * @desc Get single expense by ID
 * @route GET /api/expenses/:id
 */
const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const expense = await Expense.findById(id);
      if (!expense) {
        return res.status(404).json({ success: false, message: 'Expense not found' });
      }
      return res.status(200).json({ success: true, data: expense });
    }

    const expense = fallbackExpenses.find((e) => e._id === id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    return res.status(200).json({ success: true, data: expense });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Create new expense
 * @route POST /api/expenses
 */
const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
    }

    const validCategory = CATEGORIES.includes(category) ? category : 'Other';
    const expenseDate = date ? new Date(date) : new Date();

    if (getIsConnected()) {
      const newExpense = await Expense.create({
        title: title.trim(),
        amount: numAmount,
        category: validCategory,
        date: expenseDate,
        notes: notes ? notes.trim() : ''
      });

      return res.status(201).json({
        success: true,
        message: 'Expense created successfully',
        data: newExpense
      });
    }

    // Local fallback
    const newExpense = {
      _id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title: title.trim(),
      amount: numAmount,
      category: validCategory,
      date: expenseDate.toISOString(),
      notes: notes ? notes.trim() : '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    fallbackExpenses.unshift(newExpense);

    return res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: newExpense
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to create expense'
    });
  }
};

/**
 * @desc Update an existing expense
 * @route PUT /api/expenses/:id
 */
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date, notes } = req.body;

    if (amount !== undefined && (isNaN(Number(amount)) || Number(amount) <= 0)) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than 0' });
    }

    if (category && !CATEGORIES.includes(category)) {
      return res.status(400).json({ success: false, message: `Invalid category: ${category}` });
    }

    if (getIsConnected()) {
      const updateData = {};
      if (title !== undefined) updateData.title = title.trim();
      if (amount !== undefined) updateData.amount = Number(amount);
      if (category !== undefined) updateData.category = category;
      if (date !== undefined) updateData.date = new Date(date);
      if (notes !== undefined) updateData.notes = notes.trim();

      const updated = await Expense.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      });

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Expense not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Expense updated successfully',
        data: updated
      });
    }

    // Local fallback
    const index = fallbackExpenses.findIndex((e) => e._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    const current = fallbackExpenses[index];
    const updated = {
      ...current,
      ...(title !== undefined && { title: title.trim() }),
      ...(amount !== undefined && { amount: Number(amount) }),
      ...(category !== undefined && { category }),
      ...(date !== undefined && { date: new Date(date).toISOString() }),
      ...(notes !== undefined && { notes: notes.trim() }),
      updatedAt: new Date().toISOString()
    };

    fallbackExpenses[index] = updated;

    return res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update expense'
    });
  }
};

/**
 * @desc Delete an expense
 * @route DELETE /api/expenses/:id
 */
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const deleted = await Expense.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Expense not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Expense deleted successfully',
        data: deleted
      });
    }

    const index = fallbackExpenses.findIndex((e) => e._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    const deleted = fallbackExpenses.splice(index, 1)[0];

    return res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: deleted
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete expense'
    });
  }
};

/**
 * @desc Get aggregated expense summary & chart statistics
 * @route GET /api/expenses/summary
 */
const getSummary = async (req, res) => {
  try {
    if (getIsConnected()) {
      const allExpenses = await Expense.find({});
      const summary = calculateSummary(allExpenses);
      return res.status(200).json({
        success: true,
        data: summary,
        source: 'mongodb'
      });
    }

    const summary = calculateSummary(fallbackExpenses);
    return res.status(200).json({
      success: true,
      data: summary,
      source: 'local'
    });
  } catch (error) {
    console.error('Error calculating summary:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to calculate summary'
    });
  }
};

/**
 * @desc Reset / Seed sample expenses in PKR
 * @route POST /api/expenses/seed
 */
const seedSampleData = async (req, res) => {
  try {
    const sampleItems = [
      { title: 'Supermarket Monthly Groceries', amount: 19500, category: 'Food', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), notes: 'Flour, rice, cooking oil, dairy, snacks' },
      { title: 'Electricity & Utility Bill', amount: 26000, category: 'Bills', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), notes: 'Monthly power and gas utility' },
      { title: 'Car Fuel & Petrol Tank', amount: 10500, category: 'Transport', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), notes: 'Full tank unleaded petrol' },
      { title: 'Ergonomic Desk & Office Setup', amount: 32000, category: 'Shopping', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), notes: 'Work from home equipment' },
      { title: 'Fiber Optic High-Speed Internet', amount: 4800, category: 'Bills', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9), notes: 'Unlimited fiber package' },
      { title: 'Gym Membership & Health Checkup', amount: 8500, category: 'Health', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12), notes: 'Fitness center fee + supplements' },
      { title: 'Weekend Family Dinner Buffet', amount: 9400, category: 'Food', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), notes: 'Dinner at Continental buffet' },
      { title: 'Ride Hailing & Careem Trips', amount: 3600, category: 'Transport', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18), notes: 'Weekly city commutes' },
      { title: 'Formal Attire & Footwear', amount: 16500, category: 'Shopping', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22), notes: 'New clothing and shoes' },
      { title: 'Cinema IMAX & Entertainment', amount: 4200, category: 'Entertainment', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28), notes: 'Weekend 3D movie with snacks' }
    ];

    if (getIsConnected()) {
      await Expense.deleteMany({});
      const created = await Expense.insertMany(sampleItems);
      return res.status(200).json({
        success: true,
        message: 'Successfully seeded sample expenses in MongoDB',
        count: created.length,
        data: created
      });
    }

    fallbackExpenses = sampleItems.map((item, idx) => ({
      _id: `seed_${idx + 1}_${Date.now()}`,
      title: item.title,
      amount: item.amount,
      category: item.category,
      date: item.date.toISOString(),
      notes: item.notes,
      createdAt: item.date.toISOString(),
      updatedAt: new Date().toISOString()
    }));

    return res.status(200).json({
      success: true,
      message: 'Successfully seeded sample expenses in local storage',
      count: fallbackExpenses.length,
      data: fallbackExpenses
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary,
  seedSampleData,
  CATEGORIES
};
