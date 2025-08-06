import { createContext, useContext, useState, useEffect } from 'react'

const StorageContext = createContext()

export const useStorage = () => {
  const context = useContext(StorageContext)
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider')
  }
  return context
}

export const StorageProvider = ({ children }) => {
  const [data, setData] = useState({
    tasks: [],
    journal: [],
    finances: { transactions: [], budgets: [] },
    period: { cycles: [], symptoms: [] },
    chat: { conversations: [], messages: [] }
  })

  useEffect(() => {
    // Load data from localStorage on mount
    const storedData = localStorage.getItem('personalOrganiser')
    if (storedData) {
      try {
        setData(JSON.parse(storedData))
      } catch (error) {
        console.error('Error parsing stored data:', error)
      }
    }
  }, [])

  useEffect(() => {
    // Save data to localStorage whenever data changes
    localStorage.setItem('personalOrganiser', JSON.stringify(data))
  }, [data])

  const updateData = (section, newData) => {
    setData(prev => ({
      ...prev,
      [section]: newData
    }))
  }

  const addItem = (section, item) => {
    setData(prev => ({
      ...prev,
      [section]: Array.isArray(prev[section]) 
        ? [...prev[section], { ...item, id: Date.now().toString() }]
        : { ...prev[section], [Date.now().toString()]: item }
    }))
  }

  const updateItem = (section, itemId, updatedItem) => {
    setData(prev => ({
      ...prev,
      [section]: Array.isArray(prev[section])
        ? prev[section].map(item => item.id === itemId ? { ...item, ...updatedItem } : item)
        : { ...prev[section], [itemId]: { ...prev[section][itemId], ...updatedItem } }
    }))
  }

  const deleteItem = (section, itemId) => {
    setData(prev => ({
      ...prev,
      [section]: Array.isArray(prev[section])
        ? prev[section].filter(item => item.id !== itemId)
        : Object.fromEntries(Object.entries(prev[section]).filter(([key]) => key !== itemId))
    }))
  }

  const value = {
    data,
    updateData,
    addItem,
    updateItem,
    deleteItem
  }

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  )
}