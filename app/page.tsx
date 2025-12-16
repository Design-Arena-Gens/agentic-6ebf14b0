'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Other']

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(categories[0])

  useEffect(() => {
    const saved = localStorage.getItem('expenses')
    if (saved) {
      setExpenses(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0]
    }

    setExpenses([newExpense, ...expenses])
    setDescription('')
    setAmount('')
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id))
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  const expensesByCategory = categories.map(cat => ({
    category: cat,
    total: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
  })).filter(c => c.total > 0)

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Expense Tracker</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.summary}>
          <div className={styles.totalCard}>
            <div className={styles.totalLabel}>Total Expenses</div>
            <div className={styles.totalAmount}>${totalExpenses.toFixed(2)}</div>
          </div>

          {expensesByCategory.length > 0 && (
            <div className={styles.categoryBreakdown}>
              <h3>By Category</h3>
              <div className={styles.categoryGrid}>
                {expensesByCategory.map(({ category, total }) => (
                  <div key={category} className={styles.categoryCard}>
                    <div className={styles.categoryName}>{category}</div>
                    <div className={styles.categoryAmount}>${total.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.addExpense}>
          <h2>Add Expense</h2>
          <form onSubmit={addExpense} className={styles.form}>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={styles.input}
              step="0.01"
              min="0"
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.select}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button type="submit" className={styles.addButton}>Add Expense</button>
          </form>
        </div>

        <div className={styles.expenseList}>
          <h2>Recent Expenses</h2>
          {expenses.length === 0 ? (
            <p className={styles.emptyState}>No expenses yet. Add your first expense above.</p>
          ) : (
            <div className={styles.expenses}>
              {expenses.map(expense => (
                <div key={expense.id} className={styles.expenseItem}>
                  <div className={styles.expenseInfo}>
                    <div className={styles.expenseDescription}>{expense.description}</div>
                    <div className={styles.expenseMeta}>
                      <span className={styles.expenseCategory}>{expense.category}</span>
                      <span className={styles.expenseDate}>{expense.date}</span>
                    </div>
                  </div>
                  <div className={styles.expenseRight}>
                    <div className={styles.expenseAmount}>${expense.amount.toFixed(2)}</div>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className={styles.deleteButton}
                      aria-label="Delete expense"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
