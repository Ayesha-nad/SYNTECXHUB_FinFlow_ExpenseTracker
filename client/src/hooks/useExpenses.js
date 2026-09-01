import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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

const INITIAL_FILTERS = {
  category: 'All',
  search: '',
  startDate: '',
  endDate: '',
  sortBy: 'date',
  order: 'desc'
};

export const useExpenses = (initialBudget = 150000) => {
  // --- useState: Core State Variables ---
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [editingExpense, setEditingExpense] = useState(null);
  const [lastAddedId, setLastAddedId] = useState(null);
  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const saved = localStorage.getItem('finflow_budget_pkr');
    return saved ? Number(saved) : initialBudget;
  });
  const [toasts, setToasts] = useState([]);

  // Sync budget to localStorage
  useEffect(() => {
    localStorage.setItem('finflow_budget_pkr', monthlyBudget);
  }, [monthlyBudget]);

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

  // --- useCallback: Memoized fetch function with AbortController ---
  const fetchExpenses = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await expenseApi.getExpenses({}, signal);
      if (response && response.data) {
        setExpenses(response.data);
      }
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        return;
      }
      console.error('Error fetching expenses:', err);
      setError('Could not connect to expense server. Using offline data.');
      addToast('Offline mode: Could not reach backend server', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // --- useEffect: Fetch expenses on mount with AbortController cleanup ---
  useEffect(() => {
    const controller = new AbortController();
    fetchExpenses(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchExpenses]);

  // --- useCallback: Memoized CRUD Action Handlers ---

  // Add Expense
  const handleAddExpense = useCallback(async (expenseData) => {
    try {
      const res = await expenseApi.createExpense(expenseData);
      const newExpense = res.data;

      setExpenses((prev) => [newExpense, ...prev]);
      setLastAddedId(newExpense._id);
      addToast(`Added "${newExpense.title}" (PKR ${Number(newExpense.amount).toLocaleString()})`, 'success');

      setTimeout(() => {
        setLastAddedId((curr) => (curr === newExpense._id ? null : curr));
      }, 3000);

      return { success: true, data: newExpense };
    } catch (err) {
      console.error('Error adding expense:', err);
      const fallbackExpense = {
        _id: `local_${Date.now()}`,
        ...expenseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setExpenses((prev) => [fallbackExpense, ...prev]);
      setLastAddedId(fallbackExpense._id);
      addToast(`Added locally: "${fallbackExpense.title}"`, 'info');
      return { success: true, data: fallbackExpense };
    }
  }, [addToast]);

  // Edit/Update Expense
  const handleUpdateExpense = useCallback(async (id, updateData) => {
    try {
      const res = await expenseApi.updateExpense(id, updateData);
      const updated = res.data;

      setExpenses((prev) =>
        prev.map((item) => (item._id === id ? updated : item))
      );
      setEditingExpense(null);
      addToast(`Updated "${updated.title}"`, 'success');
      return { success: true };
    } catch (err) {
      console.error('Error updating expense:', err);
      setExpenses((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, ...updateData, updatedAt: new Date().toISOString() } : item
        )
      );
      setEditingExpense(null);
      addToast('Updated locally', 'info');
      return { success: true };
    }
  }, [addToast]);

  // Set active item to edit
  const handleStartEdit = useCallback((expense) => {
    setEditingExpense(expense);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingExpense(null);
  }, []);

  // Delete Expense
  const handleDeleteExpense = useCallback(async (id) => {
    try {
      await expenseApi.deleteExpense(id);
      setExpenses((prev) => prev.filter((item) => item._id !== id));
      addToast('Expense deleted', 'info');
    } catch (err) {
      console.error('Error deleting expense:', err);
      setExpenses((prev) => prev.filter((item) => item._id !== id));
      addToast('Deleted locally', 'info');
    }
  }, [addToast]);

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
    setLoading(true);
    try {
      const res = await expenseApi.seedSampleExpenses();
      if (res && res.data) {
        setExpenses(res.data);
        addToast('Sample PKR financial data loaded successfully!', 'success');
      }
    } catch (err) {
      console.error('Seed failed, generating locally:', err);
      fetchExpenses();
      addToast('Refreshed data', 'info');
    } finally {
      setLoading(false);
    }
  }, [addToast, fetchExpenses]);

  // --- useMemo: Derived Filtered & Sorted Expenses List ---
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // Category Filter
    if (filters.category && filters.category !== 'All') {
      result = result.filter(
        (item) => item.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Search Query (title or notes)
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

    // 3. Current Month Cumulative Progress (Line Chart)
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
