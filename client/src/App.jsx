import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Sparkles,
} from 'lucide-react';
import useExpenses from './hooks/useExpenses';
import Navbar, { COLOR_THEMES } from './components/Navbar';
import AnimatedBackground from './components/AnimatedBackground';
import FintechHeroBanner from './components/FintechHeroBanner';
import SummaryCards from './components/SummaryCards';
import ExpenseForm from './components/ExpenseForm';
import ExpenseFilters from './components/ExpenseFilters';
import ExpenseList from './components/ExpenseList';
import ChartPanel from './components/ChartPanel';
import BudgetModal from './components/BudgetModal';
import { SummaryCardSkeleton } from './components/Loader';
import confetti from 'canvas-confetti';

function App() {
  // Theme state with local persistence
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('finflow_theme') || 'light';
  });

  // Interactive Accent Color state
  const [currentAccent, setCurrentAccent] = useState(() => {
    const saved = localStorage.getItem('finflow_accent');
    if (saved) {
      const found = COLOR_THEMES.find((t) => t.id === saved);
      if (found) return found;
    }
    return COLOR_THEMES[0]; // Default Electric Indigo
  });

  // Budget modal state
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Mobile add expense modal state
  const [isMobileFormOpen, setIsMobileFormOpen] = useState(false);

  // Initialize custom hook
  const {
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
    handleRefresh,
    removeToast,
    addToast,
  } = useExpenses(1500);

  // Sync theme with DOM attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('finflow_theme', theme);
  }, [theme]);

  // Apply interactive accent color to CSS root variables dynamically
  useEffect(() => {
    if (currentAccent) {
      document.documentElement.style.setProperty('--color-primary', currentAccent.primary);
      document.documentElement.style.setProperty('--color-primary-glow', currentAccent.glow);
      document.documentElement.style.setProperty('--shadow-primary', `0 8px 24px ${currentAccent.glow}`);
      document.documentElement.style.setProperty('--color-primary-light', `${currentAccent.primary}1f`);
      localStorage.setItem('finflow_accent', currentAccent.id);
    }
  }, [currentAccent]);

  // Toggle Light/Dark Theme
  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Change Accent Color Handler
  const handleChangeAccent = useCallback((newAccent) => {
    setCurrentAccent(newAccent);
    addToast(`Theme accent set to ${newAccent.name}`, 'info');
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.1 },
        colors: [newAccent.primary, '#FFFFFF', '#34D399'],
      });
    } catch {
      // ignore
    }
  }, [addToast]);

  // Seed sample data with celebratory confetti
  const handleSeedDataWithCelebration = useCallback(async () => {
    await handleSeedData();
    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: [currentAccent.primary, '#10B981', '#F59E0B', '#EC4899'],
      });
    } catch {
      // ignore
    }
  }, [handleSeedData, currentAccent]);

  // Export CSV Handler
  const handleExportCSV = useCallback(() => {
    if (expenses.length === 0) {
      addToast('No expenses available to export', 'info');
      return;
    }

    const headers = ['Title', 'Amount', 'Category', 'Date', 'Notes'];
    const rows = expenses.map((e) => [
      `"${(e.title || '').replace(/"/g, '""')}"`,
      e.amount,
      `"${e.category}"`,
      `"${new Date(e.date).toISOString().split('T')[0]}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `expenses_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('CSV export downloaded successfully', 'success');
  }, [expenses, addToast]);

  // Wrapped edit starter
  const onStartEditWrapped = useCallback(
    (expense) => {
      handleStartEdit(expense);
      setIsMobileFormOpen(true);
    },
    [handleStartEdit]
  );

  return (
    <div className="app-container">
      {/* Immersive High-Tech Animated Background */}
      <AnimatedBackground currentAccent={currentAccent} />

      {/* Top Navigation */}
      <Navbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        currentAccent={currentAccent}
        onChangeAccent={handleChangeAccent}
        onSeedData={handleSeedDataWithCelebration}
        onRefresh={handleRefresh}
        onExportCSV={handleExportCSV}
        onOpenMobileForm={() => setIsMobileFormOpen(true)}
        loading={loading}
      />

      {/* Main Dashboard Container */}
      <main className="main-content">
        {/* Error banner if backend disconnects */}
        {error && (
          <div
            style={{
              padding: '0.9rem 1.35rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: 'var(--color-danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              fontSize: '0.88rem',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
            <button
              type="button"
              className="nav-btn"
              onClick={handleRefresh}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Dynamic Graphical Hero Banner with Interactive Canvas & Live Waveform */}
        <FintechHeroBanner
          summaryMetrics={summaryMetrics}
          monthlyBudget={monthlyBudget}
        />

        {/* 1. Top Summary Cards Row */}
        {loading && expenses.length === 0 ? (
          <SummaryCardSkeleton />
        ) : (
          <SummaryCards
            summaryMetrics={summaryMetrics}
            monthlyBudget={monthlyBudget}
            onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
          />
        )}

        {/* 2. Main Dashboard Grid (Form + List on left, Charts on right) */}
        <div className="dashboard-grid">
          {/* Left Column: Form & Transactions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Desktop Add/Edit Form */}
            <div className="desktop-form-wrapper">
              <ExpenseForm
                onAddExpense={handleAddExpense}
                onUpdateExpense={handleUpdateExpense}
                editingExpense={editingExpense}
                onCancelEdit={handleCancelEdit}
              />
            </div>

            {/* Filter Controls */}
            <ExpenseFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              totalCount={expenses.length}
              filteredCount={filteredExpenses.length}
            />

            {/* Transactions List */}
            <ExpenseList
              expenses={filteredExpenses}
              loading={loading}
              lastAddedId={lastAddedId}
              onEditExpense={onStartEditWrapped}
              onDeleteExpense={handleDeleteExpense}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Right Column: Visualizations & Analytics Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <ChartPanel
              chartData={chartData}
              summaryMetrics={summaryMetrics}
              monthlyBudget={monthlyBudget}
            />
          </div>
        </div>
      </main>

      {/* Floating Action Button for Mobile Add Expense */}
      <button
        type="button"
        className="fab-btn"
        onClick={() => setIsMobileFormOpen(true)}
        title="Add new expense"
      >
        <Plus size={26} />
      </button>

      {/* Mobile Slide-Up Modal / Drawer for Expense Form */}
      {isMobileFormOpen && (
        <div className="modal-backdrop" onClick={() => setIsMobileFormOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px' }}
          >
            <div className="card-header">
              <div className="card-title">
                <Sparkles size={20} style={{ color: 'var(--color-primary)' }} />
                <span>{editingExpense ? 'Edit Expense' : 'Quick Add Expense'}</span>
              </div>
              <button
                type="button"
                className="action-btn"
                onClick={() => {
                  setIsMobileFormOpen(false);
                  handleCancelEdit();
                }}
              >
                <X size={16} />
              </button>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <ExpenseForm
                onAddExpense={async (data) => {
                  await handleAddExpense(data);
                  setIsMobileFormOpen(false);
                }}
                onUpdateExpense={async (id, data) => {
                  await handleUpdateExpense(id, data);
                  setIsMobileFormOpen(false);
                }}
                editingExpense={editingExpense}
                onCancelEdit={() => {
                  handleCancelEdit();
                  setIsMobileFormOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Monthly Budget Adjustment Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        currentBudget={monthlyBudget}
        onSaveBudget={(newVal) => {
          setMonthlyBudget(newVal);
          addToast(`Monthly budget set to $${newVal.toFixed(2)}`, 'success');
          try {
            confetti({
              particleCount: 40,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#10B981', currentAccent.primary],
            });
          } catch {
            // ignore
          }
        }}
      />

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.type === 'success' && (
              <CheckCircle2 size={20} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
            )}
            {toast.type === 'error' && (
              <AlertCircle size={20} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
            )}
            {toast.type === 'info' && (
              <Info size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            )}
            <span style={{ fontSize: '0.88rem', fontWeight: 600, flex: 1 }}>{toast.message}</span>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '3px',
              }}
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
