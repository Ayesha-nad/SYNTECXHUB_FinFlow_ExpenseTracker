import { useState, useEffect, useMemo, useCallback } from 'react';
import expenseApi from '../api/expenseApi';

export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Other'
];

export const CATEGORY_COLORS = {
  Food: '#F97316',
  Transport: '#3B82F6',
  Shopping: '#EC4899',
  Bills: '#8B5CF6',
  Entertainment: '#06B6D4',
  Health: '#10B981',
  Other: '#64748B'
};

export const CATEGORY_BG_COLORS = {
  Food: 'rgba(249, 115, 22, 0.15)',
  Transport: 'rgba(59, 130, 246, 0.15)',
  Shopping: 'rgba(236, 72, 153, 0.15)',
  Bills: 'rgba(139, 92, 246, 0.15)',
  Entertainment: 'rgba(6, 182, 212, 0.15)',
  Health: 'rgba(16, 185, 129, 0.15)',
  Other: 'rgba(100, 116, 139, 0.15)'
};

export const DEFAULT_PKR_EXPENSES = [
  {
    _id: 'pkr_seed_1',
    title: 'Supermarket Monthly Groceries',
    amount: 19500,
    category: 'Food',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    notes: 'Flour, rice, cooking oil, dairy, snacks',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
  },
  {
    _id: 'pkr_seed_2',
    title: 'Electricity & Utility Bill',
    amount: 26000,
    category: 'Bills',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    notes: 'Monthly power and gas utility',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    _id: 'pkr_seed_3',
    title: 'Car Fuel & Petrol Tank',
    amount: 10500,
    category: 'Transport',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    notes: 'Full tank unleaded petrol',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString()
  },
  {
    _id: 'pkr_seed_4',
    title: 'Ergonomic Desk & Office Setup',
    amount: 32000,
    category: 'Shopping',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    notes: 'Work from home equipment',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString()
  },
  {
    _id: 'pkr_seed_5',
    title: 'Fiber Optic High-Speed Internet',
    amount: 4800,
    category: 'Bills',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    notes: 'Unlimited 50 Mbps fiber package',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString()
  },
  {
    _id: 'pkr_seed_6',
    title: 'Gym Membership & Health Checkup',
    amount: 8500,
    category: 'Health',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    notes: 'Fitness center fee + vitamins',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString()
  },
  {
    _id: 'pkr_seed_7',
    title: 'Weekend Family Dinner Buffet',
    amount: 9400,
    category: 'Food',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    notes: 'Dinner at Continental buffet',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString()
  },
  {
    _id: 'pkr_seed_8',
    title: 'Ride Hailing & Careem Trips',
    amount: 3600,
    category: 'Transport',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    notes: 'Weekly city commutes',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString()
  },
  {
    _id: 'pkr_seed_9',
    title: 'Formal Attire & Footwear',
    amount: 16500,
    category: 'Shopping',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22).toISOString(),
    notes: 'New clothing and shoes',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22).toISOString()
  },
  {
    _id: 'pkr_seed_10',
    title: 'Cinema IMAX & Entertainment',
    amount: 4200,
    category: 'Entertainment',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(),
    notes: 'Weekend 3D movie with snacks',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString()
  }
];

const INITIAL_FILTERS = {
  category: 'All',
  search: '',
  startDate: '',
  endDate: '',
  sortBy: 'date',
  order: 'desc'
};

export const useExpenses = (user = null, initialBudget = 150000) => {
  // Derive user-scoped storage keys
  const userId = user?._id || user?.id || 'guest';
  const storageKey = `finflow_expenses_${userId}`;
  const budgetKey = `finflow_budget_${userId}`;

  // State: Hydrate strictly from active user's local storage key
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_PKR_EXPENSES;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [editingExpense, setEditingExpense] = useState(null);
  const [lastAddedId, setLastAddedId] = useState(null);
  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const saved = localStorage.getItem(budgetKey);
    return saved ? Number(saved) : (user?.monthlyBudget || initialBudget);
  });
  const [toasts, setToasts] = useState([]);

  // When user changes (Login/Logout/Switch account), switch dataset immediately
  useEffect(() => {
    try {
      const savedExpenses = localStorage.getItem(storageKey);
      if (savedExpenses) {
        const parsed = JSON.parse(savedExpenses);
        if (Array.isArray(parsed)) {
          setExpenses(parsed);
        }
      } else {
        // Initial setup for new user
        setExpenses(DEFAULT_PKR_EXPENSES);
        localStorage.setItem(storageKey, JSON.stringify(DEFAULT_PKR_EXPENSES));
      }

      const savedBudget = localStorage.getItem(budgetKey);
      setMonthlyBudget(savedBudget ? Number(savedBudget) : (user?.monthlyBudget || initialBudget));
    } catch (e) {
      console.warn('Account dataset switch error:', e);
    }
  }, [storageKey, budgetKey, user, initialBudget]);

  // Auto-sync expenses to user-specific localStorage key
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(expenses));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  }, [expenses, storageKey]);

  // Sync budget to user-specific localStorage key
  useEffect(() => {
    localStorage.setItem(budgetKey, monthlyBudget);
  }, [monthlyBudget, budgetKey]);

  // Toast notification helper
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // --- Background fetch function (Syncs with Express/MongoDB if online) ---
  const fetchExpenses = useCallback(async (signal) => {
    try {
      const response = await expenseApi.getExpenses({}, signal);
      if (response && response.data && response.data.length > 0) {
        setExpenses(response.data);
      }
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        return;
      }
      console.info('FinFlow operating in persistent offline mode (LocalStorage).');
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchExpenses(controller.signal);
    return () => {
      controller.abort();
    };
  }, [fetchExpenses, userId]);

  // --- CRUD Handlers with Guaranteed LocalStorage Persistence ---

  // Add Expense
  const handleAddExpense = useCallback(async (expenseData) => {
    const newId = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newExpense = {
      _id: newId,
      ...expenseData,
      user: userId !== 'guest' ? userId : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setExpenses((prev) => {
      const updated = [newExpense, ...prev];
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });

    setLastAddedId(newId);
    addToast(`Added "${newExpense.title}" (PKR ${Number(newExpense.amount).toLocaleString()})`, 'success');

    setTimeout(() => {
      setLastAddedId((curr) => (curr === newId ? null : curr));
    }, 3000);

    // Background attempt to sync with backend API if online
    try {
      await expenseApi.createExpense(expenseData);
    } catch {
      // Saved in user's localStorage
    }

    return { success: true, data: newExpense };
  }, [addToast, storageKey, userId]);

  // Edit / Update Expense
  const handleUpdateExpense = useCallback(async (id, updateData) => {
    setExpenses((prev) => {
      const updatedList = prev.map((item) =>
        item._id === id ? { ...item, ...updateData, updatedAt: new Date().toISOString() } : item
      );
      try {
        localStorage.setItem(storageKey, JSON.stringify(updatedList));
      } catch (e) {
        console.warn(e);
      }
      return updatedList;
    });

    setEditingExpense(null);
    addToast(`Updated expense details`, 'success');

    try {
      await expenseApi.updateExpense(id, updateData);
    } catch {
      // Saved locally
    }

    return { success: true };
  }, [addToast, storageKey]);

  // Set active item to edit
  const handleStartEdit = useCallback((expense) => {
    setEditingExpense(expense);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingExpense(null);
  }, []);

  // Delete Expense
  const handleDeleteExpense = useCallback(async (id) => {
    setExpenses((prev) => {
      const updatedList = prev.filter((item) => item._id !== id);
      try {
        localStorage.setItem(storageKey, JSON.stringify(updatedList));
      } catch (e) {
        console.warn(e);
      }
      return updatedList;
    });

    addToast('Expense removed', 'info');

    try {
      await expenseApi.deleteExpense(id);
    } catch {
      // Deleted locally
    }
  }, [addToast, storageKey]);

  // Filter change handler
  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Reset filters handler
  const handleResetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  // Seed sample expenses handler
  const handleSeedData = useCallback(async () => {
    setExpenses(DEFAULT_PKR_EXPENSES);
    try {
      localStorage.setItem(storageKey, JSON.stringify(DEFAULT_PKR_EXPENSES));
    } catch (e) {
      console.warn(e);
    }
    addToast('Sample PKR financial dataset restored!', 'success');

    try {
      await expenseApi.seedSampleExpenses();
    } catch {
      // Loaded locally
    }
  }, [addToast, storageKey]);

  // --- useMemo: Derived Filtered & Sorted Expenses List ---
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // Category Filter
    if (filters.category && filters.category !== 'All') {
      result = result.filter(
        (item) => item.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Search Query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(q)) ||
          (item.notes && item.notes.toLowerCase().includes(q))
      );
    }

    // Date Range Filters
    if (filters.startDate) {
      const start = new Date(filters.startDate).getTime();
      result = result.filter((item) => new Date(item.date).getTime() >= start);
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate).getTime() + (24 * 60 * 60 * 1000 - 1);
      result = result.filter((item) => new Date(item.date).getTime() <= end);
    }

    // Sorting
    result.sort((a, b) => {
      let valA = a[filters.sortBy];
      let valB = b[filters.sortBy];

      if (filters.sortBy === 'date' || filters.sortBy === 'createdAt') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else if (filters.sortBy === 'amount') {
        valA = Number(valA || 0);
        valB = Number(valB || 0);
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (filters.order === 'asc') {
        return valA > valB ? 1 : -1;
      }
      return valA < valB ? 1 : -1;
    });

    return result;
  }, [expenses, filters]);

  // --- useMemo: Derived Summary Card Statistics ---
  const summaryMetrics = useMemo(() => {
    const totalSpent = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const thisMonthExpenses = expenses.filter((item) => {
      const d = new Date(item.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });

    const thisMonthSpent = thisMonthExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    // Group by category
    const categoryTotals = {};
    CATEGORIES.forEach((cat) => {
      categoryTotals[cat] = 0;
    });

    expenses.forEach((item) => {
      const cat = item.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(item.amount || 0);
    });

    let topCategory = { category: 'None', amount: 0 };
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > topCategory.amount) {
        topCategory = { category: cat, amount: amt };
      }
    });

    const count = expenses.length;
    const averageExpense = count > 0 ? totalSpent / count : 0;
    const remainingBudget = Math.max(0, monthlyBudget - thisMonthSpent);
    const budgetPercent = monthlyBudget > 0 ? Math.min(100, Math.round((thisMonthSpent / monthlyBudget) * 100)) : 0;

    return {
      totalSpent,
      thisMonthSpent,
      count,
      averageExpense,
      topCategory,
      remainingBudget,
      budgetPercent,
      isOverBudget: thisMonthSpent > monthlyBudget
    };
  }, [expenses, monthlyBudget]);

  // --- useMemo: Derived Chart.js Data ---
  const chartData = useMemo(() => {
    // 1. Category Distribution
    const catMap = {};
    CATEGORIES.forEach((cat) => {
      catMap[cat] = 0;
    });

    expenses.forEach((item) => {
      const cat = item.category || 'Other';
      catMap[cat] = (catMap[cat] || 0) + Number(item.amount || 0);
    });

    const activeCategories = CATEGORIES.filter((cat) => catMap[cat] > 0);
    const donutData = {
      labels: activeCategories.length > 0 ? activeCategories : ['No Data'],
      datasets: [
        {
          data: activeCategories.length > 0 ? activeCategories.map((c) => catMap[c]) : [1],
          backgroundColor: activeCategories.length > 0
            ? activeCategories.map((c) => CATEGORY_COLORS[c] || '#64748B')
            : ['#E2E8F0'],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 6
        }
      ]
    };

    // 2. 6-Month Monthly Trend
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const monthlyLabels = [];
    const monthlyTotals = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const monthShort = d.toLocaleString('default', { month: 'short' });
      monthlyLabels.push(monthShort);

      const targetYear = d.getFullYear();
      const targetMonth = d.getMonth();

      const total = expenses
        .filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate.getFullYear() === targetYear && itemDate.getMonth() === targetMonth;
        })
        .reduce((sum, item) => sum + Number(item.amount || 0), 0);

      monthlyTotals.push(Number(total.toFixed(2)));
    }

    const barData = {
      labels: monthlyLabels,
      datasets: [
        {
          label: 'Monthly Spending (PKR)',
          data: monthlyTotals,
          backgroundColor: 'rgba(99, 102, 241, 0.85)',
          hoverBackgroundColor: '#6366F1',
          borderRadius: 8,
          borderSkipped: false
        }
      ]
    };

    // 3. Current Month Cumulative Progress
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dailyLineLabels = [];
    const cumulativeTotals = [];
    let runningSum = 0;

    const dayMap = {};
    expenses.forEach((item) => {
      const d = new Date(item.date);
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        const day = d.getDate();
        dayMap[day] = (dayMap[day] || 0) + Number(item.amount || 0);
      }
    });

    const todayDate = now.getDate();
    for (let day = 1; day <= Math.min(todayDate, daysInCurrentMonth); day++) {
      dailyLineLabels.push(`Day ${day}`);
      runningSum += dayMap[day] || 0;
      cumulativeTotals.push(Number(runningSum.toFixed(2)));
    }

    const lineData = {
      labels: dailyLineLabels.length > 0 ? dailyLineLabels : ['Day 1'],
      datasets: [
        {
          label: 'Cumulative Spent (PKR)',
          data: cumulativeTotals.length > 0 ? cumulativeTotals : [0],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#10B981'
        }
      ]
    };

    return { donutData, barData, lineData, catMap };
  }, [expenses]);

  return {
    expenses,
    filteredExpenses,
    loading,
    error,
    filters,
    editingExpense,
    lastAddedId,
    monthlyBudget,
    toasts,
    summaryMetrics,
    chartData,
    setMonthlyBudget,
    handleAddExpense,
    handleUpdateExpense,
    handleStartEdit,
    handleCancelEdit,
    handleDeleteExpense,
    handleFilterChange,
    handleResetFilters,
    handleSeedData,
    handleRefresh: fetchExpenses,
    removeToast,
    addToast
  };
};

export default useExpenses;
