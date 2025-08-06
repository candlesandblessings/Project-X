import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStorage } from '../contexts/StorageContext'
import {
  Plus,
  Check,
  X,
  Edit,
  Trash2,
  Calendar,
  Flag,
  Search,
  CheckSquare
} from 'lucide-react'

const Organiser = () => {
  const { data, addItem, updateItem, deleteItem } = useStorage()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    completed: false
  })

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-ios-green' },
    { value: 'medium', label: 'Medium', color: 'bg-ios-orange' },
    { value: 'high', label: 'High', color: 'bg-ios-red' }
  ]

  const tasks = data.tasks || []

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && task.completed) ||
                         (filterStatus === 'pending' && !task.completed)
    
    return matchesSearch && matchesPriority && matchesStatus
  })

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      addItem('tasks', {
        ...newTask,
        createdAt: new Date().toISOString()
      })
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        completed: false
      })
      setShowAddForm(false)
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setNewTask({...task})
    setShowAddForm(true)
  }

  const handleUpdateTask = () => {
    if (newTask.title.trim()) {
      updateItem('tasks', editingTask.id, newTask)
      setEditingTask(null)
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        completed: false
      })
      setShowAddForm(false)
    }
  }

  const toggleTaskComplete = (taskId, completed) => {
    updateItem('tasks', taskId, { completed: !completed })
  }

  const handleDeleteTask = (taskId) => {
    deleteItem('tasks', taskId)
  }

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority)
    return priorityObj?.color || 'bg-ios-gray-400'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ios-gray-900">Organiser</h1>
          <p className="text-ios-gray-600">Manage your tasks and stay organized</p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null)
            setNewTask({
              title: '',
              description: '',
              priority: 'medium',
              dueDate: '',
              completed: false
            })
            setShowAddForm(true)
          }}
          className="ios-button ios-button-primary flex items-center justify-center md:justify-start"
        >
          <Plus size={20} className="mr-2" />
          Add Task
        </button>
      </div>

      {/* Filters and Search */}
      <div className="ios-card space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ios-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ios-input pl-10"
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-ios-gray-700 mb-2">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="ios-input"
            >
              <option value="all">All Priorities</option>
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>{priority.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-ios-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="ios-input"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Task Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ios-card"
          >
            <h3 className="text-lg font-semibold text-ios-gray-900 mb-4">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ios-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Enter task title..."
                  className="ios-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ios-gray-700 mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Enter task description..."
                  rows="3"
                  className="ios-input resize-none"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ios-gray-700 mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="ios-input"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>{priority.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-ios-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="ios-input"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={editingTask ? handleUpdateTask : handleAddTask}
                  className="ios-button ios-button-primary flex-1"
                >
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingTask(null)
                  }}
                  className="ios-button ios-button-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="ios-card text-center py-12">
            <CheckSquare className="w-16 h-16 text-ios-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-ios-gray-600 mb-2">No tasks found</h3>
            <p className="text-ios-gray-500">
              {tasks.length === 0 ? 'Add your first task to get started!' : 'Try adjusting your search or filters.'}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`ios-card ${task.completed ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleTaskComplete(task.id, task.completed)}
                    className={`
                      flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                      ${task.completed 
                        ? 'bg-ios-green border-ios-green' 
                        : 'border-ios-gray-300 hover:border-ios-blue'
                      }
                    `}
                  >
                    {task.completed && <Check size={14} className="text-white" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-ios-gray-500' : 'text-ios-gray-900'}`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className={`text-sm mt-1 ${task.completed ? 'text-ios-gray-400' : 'text-ios-gray-600'}`}>
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                            <span className="text-xs text-ios-gray-500 capitalize">{task.priority}</span>
                          </div>
                          
                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-xs text-ios-gray-500">
                              <Calendar size={12} />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="p-2 text-ios-gray-500 hover:text-ios-blue hover:bg-ios-gray-100 rounded-ios transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 text-ios-gray-500 hover:text-ios-red hover:bg-ios-gray-100 rounded-ios transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

export default Organiser