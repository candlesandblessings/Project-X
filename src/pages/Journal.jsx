import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStorage } from '../contexts/StorageContext'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {
  Plus,
  Search,
  Calendar,
  Edit,
  Trash2,
  BookOpen,
  Smile,
  Meh,
  Frown,
  Heart,
  Star
} from 'lucide-react'

const Journal = () => {
  const { data, addItem, updateItem, deleteItem } = useStorage()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMood, setSelectedMood] = useState('all')

  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'neutral',
    tags: '',
    date: new Date().toISOString().split('T')[0]
  })

  const moods = [
    { value: 'great', label: 'Great', icon: Star, color: 'text-ios-yellow' },
    { value: 'good', label: 'Good', icon: Smile, color: 'text-ios-green' },
    { value: 'neutral', label: 'Neutral', icon: Meh, color: 'text-ios-gray-500' },
    { value: 'sad', label: 'Sad', icon: Frown, color: 'text-ios-blue' },
    { value: 'stressed', label: 'Stressed', icon: Heart, color: 'text-ios-red' }
  ]

  const entries = data.journal || []

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entry.tags.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesMood = selectedMood === 'all' || entry.mood === selectedMood
      
      return matchesSearch && matchesMood
    }).sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [entries, searchTerm, selectedMood])

  const handleAddEntry = () => {
    if (newEntry.title.trim() && newEntry.content.trim()) {
      addItem('journal', {
        ...newEntry,
        createdAt: new Date().toISOString()
      })
      setNewEntry({
        title: '',
        content: '',
        mood: 'neutral',
        tags: '',
        date: new Date().toISOString().split('T')[0]
      })
      setShowAddForm(false)
    }
  }

  const handleEditEntry = (entry) => {
    setEditingEntry(entry)
    setNewEntry({...entry})
    setShowAddForm(true)
  }

  const handleUpdateEntry = () => {
    if (newEntry.title.trim() && newEntry.content.trim()) {
      updateItem('journal', editingEntry.id, newEntry)
      setEditingEntry(null)
      setNewEntry({
        title: '',
        content: '',
        mood: 'neutral',
        tags: '',
        date: new Date().toISOString().split('T')[0]
      })
      setShowAddForm(false)
    }
  }

  const handleDeleteEntry = (entryId) => {
    deleteItem('journal', entryId)
  }

  const getMoodIcon = (mood) => {
    const moodObj = moods.find(m => m.value === mood)
    return moodObj || moods.find(m => m.value === 'neutral')
  }

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'blockquote'],
      ['clean']
    ],
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ios-gray-900">Journal</h1>
          <p className="text-ios-gray-600">Capture your thoughts and feelings</p>
        </div>
        <button
          onClick={() => {
            setEditingEntry(null)
            setNewEntry({
              title: '',
              content: '',
              mood: 'neutral',
              tags: '',
              date: new Date().toISOString().split('T')[0]
            })
            setShowAddForm(true)
          }}
          className="ios-button ios-button-primary flex items-center justify-center md:justify-start"
        >
          <Plus size={20} className="mr-2" />
          New Entry
        </button>
      </div>

      {/* Search and Filters */}
      <div className="ios-card space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ios-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ios-input pl-10"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-ios-gray-700 mb-2">Filter by Mood</label>
          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            className="ios-input"
          >
            <option value="all">All Moods</option>
            {moods.map(mood => (
              <option key={mood.value} value={mood.value}>{mood.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add/Edit Entry Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ios-card"
          >
            <h3 className="text-lg font-semibold text-ios-gray-900 mb-4">
              {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ios-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                  placeholder="Enter entry title..."
                  className="ios-input"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ios-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                    className="ios-input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-ios-gray-700 mb-2">Mood</label>
                  <select
                    value={newEntry.mood}
                    onChange={(e) => setNewEntry({...newEntry, mood: e.target.value})}
                    className="ios-input"
                  >
                    {moods.map(mood => (
                      <option key={mood.value} value={mood.value}>{mood.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-ios-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={newEntry.tags}
                    onChange={(e) => setNewEntry({...newEntry, tags: e.target.value})}
                    placeholder="work, personal, travel..."
                    className="ios-input"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ios-gray-700 mb-2">Content</label>
                <div className="border border-ios-gray-200 rounded-ios">
                  <ReactQuill
                    theme="snow"
                    value={newEntry.content}
                    onChange={(content) => setNewEntry({...newEntry, content})}
                    modules={quillModules}
                    placeholder="Write your thoughts..."
                    style={{ height: '200px', marginBottom: '50px' }}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={editingEntry ? handleUpdateEntry : handleAddEntry}
                  className="ios-button ios-button-primary flex-1"
                >
                  {editingEntry ? 'Update Entry' : 'Save Entry'}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingEntry(null)
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

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="ios-card text-center py-12">
            <BookOpen className="w-16 h-16 text-ios-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-ios-gray-600 mb-2">No entries found</h3>
            <p className="text-ios-gray-500">
              {entries.length === 0 ? 'Start your journaling journey today!' : 'Try adjusting your search or filters.'}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredEntries.map((entry, index) => {
              const moodInfo = getMoodIcon(entry.mood)
              const MoodIcon = moodInfo.icon
              
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="ios-card"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-ios-gray-900 mb-1">{entry.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-ios-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MoodIcon size={14} className={moodInfo.color} />
                          {moodInfo.label}
                        </div>
                        {entry.tags && (
                          <div className="text-ios-blue">#{entry.tags.replace(/,\s*/g, ' #')}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditEntry(entry)}
                        className="p-2 text-ios-gray-500 hover:text-ios-blue hover:bg-ios-gray-100 rounded-ios transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-2 text-ios-gray-500 hover:text-ios-red hover:bg-ios-gray-100 rounded-ios transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div 
                    className="prose prose-sm max-w-none text-ios-gray-700"
                    dangerouslySetInnerHTML={{ 
                      __html: entry.content.length > 200 
                        ? entry.content.substring(0, 200) + '...' 
                        : entry.content 
                    }}
                  />
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

export default Journal