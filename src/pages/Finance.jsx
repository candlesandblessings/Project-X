import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStorage } from '../contexts/StorageContext'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Plus,
  Search,
  Calendar,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  BarChart3,
  CreditCard,
  Target
} from 'lucide-react'

const Finance = () => {
  const { data, addItem, updateItem, deleteItem } = useStorage()
  const [activeTab, setActiveTab] = useState('transactions')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'other',
    date: new Date().toISOString().split('T')[0]
  })

  const [newBudget, setNewBudget] = useState({
    category: 'other',
    amount: '',
    period: 'monthly'
  })

  const categories = [
    { value: 'food', label: 'Food & Dining', color: '#FF9500' },
    { value: 'transport', label: 'Transportation', color: '#007AFF' },
    { value: 'entertainment', label: 'Entertainment', color: '#AF52DE' },
    { value: 'shopping', label: 'Shopping', color: '#FF2D92' },
    { value: 'bills', label: 'Bills & Utilities', color: '#FF3B30' },
    { value: 'health', label: 'Healthcare', color: '#34C759' },
    { value: 'education', label: 'Education', color: '#5856D6' },
    { value: 'salary', label: 'Salary', color: '#34C759' },
    { value: 'freelance', label: 'Freelance', color: '#5AC8FA' },
    { value: 'investment', label: 'Investment', color: '#FFCC00' },
    { value: 'other', label: 'Other', color: '#8E8E93' }
  ]

  const transactions = data.finances?.transactions || []
  const budgets = data.finances?.budgets || []

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || transaction.type === filterType
      
      return matchesSearch && matchesType
    }).sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [transactions, searchTerm, filterType])

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    
    const balance = totalIncome - totalExpenses

    const categoryExpenses = categories.map(category => {
      const amount = transactions
        .filter(t => t.type === 'expense' && t.category === category.value)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
      
      return {
        name: category.label,
        value: amount,
        color: category.color
      }
    }).filter(item => item.value > 0)

    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = date.toISOString().slice(0, 7)
      
      const monthTransactions = transactions.filter(t => t.date.startsWith(monthKey))
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
      
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        income,
        expenses
      }
    }).reverse()

    return {
      totalIncome,
      totalExpenses,
      balance,
      categoryExpenses,
      monthlyData
    }
  }, [transactions])

  const handleAddTransaction = () => {
    if (newTransaction.description.trim() && newTransaction.amount) {
      const financeData = data.finances || { transactions: [], budgets: [] }
      updateData('finances', {
        ...financeData,
        transactions: [...financeData.transactions, {
          ...newTransaction,
          amount: parseFloat(newTransaction.amount),
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }]
      })
      setNewTransaction({
        description: '',
        amount: '',
        type: 'expense',
        category: 'other',
        date: new Date().toISOString().split('T')[0]
      })
      setShowAddForm(false)
    }
  }

  const handleAddBudget = () => {
    if (newBudget.category && newBudget.amount) {
      const financeData = data.finances || { transactions: [], budgets: [] }
      updateData('finances', {
        ...financeData,
        budgets: [...financeData.budgets, {
          ...newBudget,
          amount: parseFloat(newBudget.amount),
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }]
      })
      setNewBudget({
        category: 'other',
        amount: '',
        period: 'monthly'
      })
      setShowAddForm(false)
    }
  }

  const { updateData } = useStorage()

  const getCategoryInfo = (categoryValue) => {
    return categories.find(c => c.value === categoryValue) || categories.find(c => c.value === 'other')
  }

  const tabs = [
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'budgets', label: 'Budgets', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ios-gray-900">Finance</h1>
          <p className="text-ios-gray-600">Track your income, expenses, and budgets</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null)
            if (activeTab === 'budgets') {
              setNewBudget({
                category: 'other',
                amount: '',
                period: 'monthly'
              })
            } else {
              setNewTransaction({
                description: '',
                amount: '',
                type: 'expense',
                category: 'other',
                date: new Date().toISOString().split('T')[0]
              })
            }
            setShowAddForm(true)
          }}
          className="ios-button ios-button-primary flex items-center justify-center md:justify-start"
        >
          <Plus size={20} className="mr-2" />
          Add {activeTab === 'budgets' ? 'Budget' : 'Transaction'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="ios-card text-center">
          <TrendingUp className="w-8 h-8 text-ios-green mx-auto mb-2" />
          <div className="text-2xl font-bold text-ios-green">${stats.totalIncome.toFixed(2)}</div>
          <div className="text-sm text-ios-gray-600">Total Income</div>
        </div>
        <div className="ios-card text-center">
          <TrendingDown className="w-8 h-8 text-ios-red mx-auto mb-2" />
          <div className="text-2xl font-bold text-ios-red">${stats.totalExpenses.toFixed(2)}</div>
          <div className="text-sm text-ios-gray-600">Total Expenses</div>
        </div>
        <div className="ios-card text-center">
          <DollarSign className="w-8 h-8 text-ios-blue mx-auto mb-2" />
          <div className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-ios-green' : 'text-ios-red'}`}>
            ${stats.balance.toFixed(2)}
          </div>
          <div className="text-sm text-ios-gray-600">Balance</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-ios-gray-100 p-1 rounded-ios">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center px-4 py-2 rounded-ios font-medium transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-surface text-ios-blue shadow-ios'
                  : 'text-ios-gray-600 hover:text-ios-gray-900'
                }
              `}
            >
              <Icon size={16} className="mr-2" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'transactions' && (
          <motion.div
            key="transactions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Search and Filters */}
            <div className="ios-card space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ios-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ios-input pl-10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ios-gray-700 mb-2">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="ios-input"
                >
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expenses</option>
                </select>
              </div>
            </div>

            {/* Add Transaction Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ios-card"
                >
                  <h3 className="text-lg font-semibold text-ios-gray-900 mb-4">
                    Add New Transaction
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-ios-gray-700 mb-2">Description</label>
                        <input
                          type="text"
                          value={newTransaction.description}
                          onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                          placeholder="Enter description..."
                          className="ios-input"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-ios-gray-700 mb-2">Amount</label>
                        <input
                          type="number"
                          value={newTransaction.amount}
                          onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                          placeholder="0.00"
                          className="ios-input"
                          step="0.01"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-ios-gray-700 mb-2">Type</label>
                        <select
                          value={newTransaction.type}
                          onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                          className="ios-input"
                        >
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-ios-gray-700 mb-2">Category</label>
                        <select
                          value={newTransaction.category}
                          onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                          className="ios-input"
                        >
                          {categories.map(category => (
                            <option key={category.value} value={category.value}>{category.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-ios-gray-700 mb-2">Date</label>
                        <input
                          type="date"
                          value={newTransaction.date}
                          onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                          className="ios-input"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddTransaction}
                        className="ios-button ios-button-primary flex-1"
                      >
                        Add Transaction
                      </button>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="ios-button ios-button-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Transactions List */}
            <div className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <div className="ios-card text-center py-12">
                  <CreditCard className="w-16 h-16 text-ios-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-ios-gray-600 mb-2">No transactions found</h3>
                  <p className="text-ios-gray-500">
                    {transactions.length === 0 ? 'Add your first transaction to get started!' : 'Try adjusting your search or filters.'}
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredTransactions.map((transaction, index) => {
                    const categoryInfo = getCategoryInfo(transaction.category)
                    
                    return (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="ios-card"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: categoryInfo.color }}
                            />
                            <div>
                              <h3 className="font-medium text-ios-gray-900">{transaction.description}</h3>
                              <div className="flex items-center gap-4 text-sm text-ios-gray-600">
                                <span>{categoryInfo.label}</span>
                                <span className="flex items-center gap-1">
                                  <Calendar size={12} />
                                  {new Date(transaction.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className={`text-lg font-semibold ${
                              transaction.type === 'income' ? 'text-ios-green' : 'text-ios-red'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Monthly Trends */}
            <div className="ios-card">
              <h3 className="text-lg font-semibold text-ios-gray-900 mb-4">Monthly Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Bar dataKey="income" fill="#34C759" />
                  <Bar dataKey="expenses" fill="#FF3B30" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Breakdown */}
            <div className="ios-card">
              <h3 className="text-lg font-semibold text-ios-gray-900 mb-4">Expense Categories</h3>
              {stats.categoryExpenses.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.categoryExpenses}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({name, value}) => `${name}: $${value.toFixed(2)}`}
                    >
                      {stats.categoryExpenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-ios-gray-500">
                  No expense data available
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Finance