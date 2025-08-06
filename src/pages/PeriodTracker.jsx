import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStorage } from '../contexts/StorageContext'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import {
  Plus,
  Calendar as CalendarIcon,
  Heart,
  Thermometer,
  Zap,
  Droplets,
  Moon,
  Edit,
  Trash2,
  TrendingUp
} from 'lucide-react'

const PeriodTracker = () => {
  const { data, updateData } = useStorage()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeTab, setActiveTab] = useState('calendar')

  const [newCycle, setNewCycle] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    flow: 'medium',
    symptoms: []
  })

  const [newSymptom, setNewSymptom] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'cramps',
    severity: 'mild',
    notes: ''
  })

  const cycles = data.period?.cycles || []
  const symptoms = data.period?.symptoms || []

  const symptomTypes = [
    { value: 'cramps', label: 'Cramps', icon: Zap, color: 'text-ios-red' },
    { value: 'headache', label: 'Headache', icon: Heart, color: 'text-ios-purple' },
    { value: 'mood', label: 'Mood Changes', icon: Moon, color: 'text-ios-blue' },
    { value: 'bloating', label: 'Bloating', icon: Droplets, color: 'text-ios-orange' },
    { value: 'fatigue', label: 'Fatigue', icon: Thermometer, color: 'text-ios-gray-600' }
  ]

  const flowLevels = [
    { value: 'light', label: 'Light', color: 'bg-ios-pink opacity-40' },
    { value: 'medium', label: 'Medium', color: 'bg-ios-pink opacity-60' },
    { value: 'heavy', label: 'Heavy', color: 'bg-ios-pink opacity-80' }
  ]

  const predictions = useMemo(() => {
    if (cycles.length < 2) return null

    const avgCycleLength = cycles.reduce((sum, cycle, index, arr) => {
      if (index === 0) return 0
      const prev = new Date(arr[index - 1].startDate)
      const current = new Date(cycle.startDate)
      return sum + Math.floor((current - prev) / (1000 * 60 * 60 * 24))
    }, 0) / (cycles.length - 1)

    const lastCycle = cycles[cycles.length - 1]
    const nextPeriod = new Date(lastCycle.startDate)
    nextPeriod.setDate(nextPeriod.getDate() + Math.round(avgCycleLength))

    const fertile = new Date(nextPeriod)
    fertile.setDate(fertile.getDate() - 14)

    return {
      nextPeriod,
      fertile,
      avgCycleLength: Math.round(avgCycleLength)
    }
  }, [cycles])

  const handleAddCycle = () => {
    if (newCycle.startDate) {
      const periodData = data.period || { cycles: [], symptoms: [] }
      updateData('period', {
        ...periodData,
        cycles: [...periodData.cycles, {
          ...newCycle,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }]
      })
      setNewCycle({
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        flow: 'medium',
        symptoms: []
      })
      setShowAddForm(false)
    }
  }

  const handleAddSymptom = () => {
    if (newSymptom.date && newSymptom.type) {
      const periodData = data.period || { cycles: [], symptoms: [] }
      updateData('period', {
        ...periodData,
        symptoms: [...periodData.symptoms, {
          ...newSymptom,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }]
      })
      setNewSymptom({
        date: new Date().toISOString().split('T')[0],
        type: 'cramps',
        severity: 'mild',
        notes: ''
      })
      setShowAddForm(false)
    }
  }

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0]
      
      // Check for cycles
      const hasCycle = cycles.some(cycle => {
        const start = new Date(cycle.startDate)
        const end = cycle.endDate ? new Date(cycle.endDate) : new Date(start.getTime() + 5 * 24 * 60 * 60 * 1000)
        return date >= start && date <= end
      })

      // Check for symptoms
      const hasSymptom = symptoms.some(symptom => symptom.date === dateStr)

      // Check predictions
      if (predictions) {
        const isPredictedPeriod = Math.abs(date - predictions.nextPeriod) < 7 * 24 * 60 * 60 * 1000
        const isFertile = Math.abs(date - predictions.fertile) < 3 * 24 * 60 * 60 * 1000
        
        if (isPredictedPeriod) return 'predicted-period'
        if (isFertile) return 'fertile-window'
      }

      if (hasCycle) return 'period-day'
      if (hasSymptom) return 'symptom-day'
    }
    return null
  }

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0]
      const daySymptoms = symptoms.filter(s => s.date === dateStr)
      
      if (daySymptoms.length > 0) {
        return (
          <div className="flex justify-center">
            <div className="w-1 h-1 bg-ios-blue rounded-full" />
          </div>
        )
      }
    }
    return null
  }

  const tabs = [
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'cycles', label: 'Cycles', icon: Heart },
    { id: 'symptoms', label: 'Symptoms', icon: Thermometer },
    { id: 'insights', label: 'Insights', icon: TrendingUp }
  ]

  return (
    <div className="space-y-6">
      <style jsx>{`
        .period-day {
          background-color: #FF2D92 !important;
          color: white !important;
        }
        .symptom-day {
          background-color: #007AFF !important;
          color: white !important;
        }
        .predicted-period {
          background-color: #FF2D92 !important;
          opacity: 0.5 !important;
          color: white !important;
        }
        .fertile-window {
          background-color: #34C759 !important;
          opacity: 0.7 !important;
          color: white !important;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ios-gray-900">Period Tracker</h1>
          <p className="text-ios-gray-600">Monitor your menstrual health and cycles</p>
        </div>
        <button
          onClick={() => {
            if (activeTab === 'symptoms') {
              setNewSymptom({
                date: new Date().toISOString().split('T')[0],
                type: 'cramps',
                severity: 'mild',
                notes: ''
              })
            } else {
              setNewCycle({
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                flow: 'medium',
                symptoms: []
              })
            }
            setShowAddForm(true)
          }}
          className="ios-button ios-button-primary flex items-center justify-center md:justify-start"
        >
          <Plus size={20} className="mr-2" />
          Add {activeTab === 'symptoms' ? 'Symptom' : 'Cycle'}
        </button>
      </div>

      {/* Predictions Card */}
      {predictions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="ios-card bg-gradient-to-r from-ios-pink to-ios-purple text-white"
        >
          <h3 className="text-lg font-semibold mb-4">Predictions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{predictions.nextPeriod.toLocaleDateString()}</div>
              <div className="text-sm opacity-90">Next Period</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{predictions.fertile.toLocaleDateString()}</div>
              <div className="text-sm opacity-90">Fertile Window</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{predictions.avgCycleLength} days</div>
              <div className="text-sm opacity-90">Avg Cycle</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-ios-gray-100 p-1 rounded-ios overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center px-4 py-2 rounded-ios font-medium transition-all duration-200 whitespace-nowrap
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
        {activeTab === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="ios-card"
          >
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileClassName={tileClassName}
              tileContent={tileContent}
              className="w-full"
            />
            
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-ios-pink rounded" />
                <span className="text-sm text-ios-gray-700">Period Days</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-ios-blue rounded" />
                <span className="text-sm text-ios-gray-700">Symptoms Logged</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-ios-pink opacity-50 rounded" />
                <span className="text-sm text-ios-gray-700">Predicted Period</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-ios-green opacity-70 rounded" />
                <span className="text-sm text-ios-gray-700">Fertile Window</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'cycles' && (
          <motion.div
            key="cycles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Add Cycle Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ios-card"
                >
                  <h3 className="text-lg font-semibold text-ios-gray-900 mb-4">Add New Cycle</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-ios-gray-700 mb-2">Start Date</label>
                        <input
                          type="date"
                          value={newCycle.startDate}
                          onChange={(e) => setNewCycle({...newCycle, startDate: e.target.value})}
                          className="ios-input"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-ios-gray-700 mb-2">End Date (Optional)</label>
                        <input
                          type="date"
                          value={newCycle.endDate}
                          onChange={(e) => setNewCycle({...newCycle, endDate: e.target.value})}
                          className="ios-input"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-ios-gray-700 mb-2">Flow</label>
                      <select
                        value={newCycle.flow}
                        onChange={(e) => setNewCycle({...newCycle, flow: e.target.value})}
                        className="ios-input"
                      >
                        {flowLevels.map(flow => (
                          <option key={flow.value} value={flow.value}>{flow.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddCycle}
                        className="ios-button ios-button-primary flex-1"
                      >
                        Add Cycle
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

            {/* Cycles List */}
            <div className="space-y-4">
              {cycles.length === 0 ? (
                <div className="ios-card text-center py-12">
                  <Heart className="w-16 h-16 text-ios-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-ios-gray-600 mb-2">No cycles tracked</h3>
                  <p className="text-ios-gray-500">Start tracking your menstrual cycles to see patterns and predictions.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {cycles.map((cycle, index) => (
                    <motion.div
                      key={cycle.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="ios-card"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-ios-gray-900">
                            Cycle {cycles.length - index}
                          </h3>
                          <div className="text-sm text-ios-gray-600 space-y-1">
                            <div>Started: {new Date(cycle.startDate).toLocaleDateString()}</div>
                            {cycle.endDate && (
                              <div>Ended: {new Date(cycle.endDate).toLocaleDateString()}</div>
                            )}
                            <div className="flex items-center gap-2">
                              <span>Flow:</span>
                              <span className="capitalize font-medium text-ios-pink">{cycle.flow}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-semibold text-ios-gray-900">
                            {cycle.endDate 
                              ? `${Math.ceil((new Date(cycle.endDate) - new Date(cycle.startDate)) / (1000 * 60 * 60 * 24))} days`
                              : 'Ongoing'
                            }
                          </div>
                          <div className="text-sm text-ios-gray-500">Duration</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'symptoms' && (
          <motion.div
            key="symptoms"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Add Symptom Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ios-card"
                >
                  <h3 className="text-lg font-semibold text-ios-gray-900 mb-4">Log Symptom</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-ios-gray-700 mb-2">Date</label>
                        <input
                          type="date"
                          value={newSymptom.date}
                          onChange={(e) => setNewSymptom({...newSymptom, date: e.target.value})}
                          className="ios-input"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-ios-gray-700 mb-2">Type</label>
                        <select
                          value={newSymptom.type}
                          onChange={(e) => setNewSymptom({...newSymptom, type: e.target.value})}
                          className="ios-input"
                        >
                          {symptomTypes.map(symptom => (
                            <option key={symptom.value} value={symptom.value}>{symptom.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-ios-gray-700 mb-2">Severity</label>
                        <select
                          value={newSymptom.severity}
                          onChange={(e) => setNewSymptom({...newSymptom, severity: e.target.value})}
                          className="ios-input"
                        >
                          <option value="mild">Mild</option>
                          <option value="moderate">Moderate</option>
                          <option value="severe">Severe</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-ios-gray-700 mb-2">Notes (Optional)</label>
                      <textarea
                        value={newSymptom.notes}
                        onChange={(e) => setNewSymptom({...newSymptom, notes: e.target.value})}
                        placeholder="Additional notes..."
                        rows="3"
                        className="ios-input resize-none"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddSymptom}
                        className="ios-button ios-button-primary flex-1"
                      >
                        Log Symptom
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

            {/* Symptoms List */}
            <div className="space-y-4">
              {symptoms.length === 0 ? (
                <div className="ios-card text-center py-12">
                  <Thermometer className="w-16 h-16 text-ios-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-ios-gray-600 mb-2">No symptoms logged</h3>
                  <p className="text-ios-gray-500">Track your symptoms to identify patterns and triggers.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {symptoms
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((symptom, index) => {
                      const symptomInfo = symptomTypes.find(s => s.value === symptom.type)
                      const Icon = symptomInfo?.icon || Thermometer
                      
                      return (
                        <motion.div
                          key={symptom.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="ios-card"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <Icon size={20} className={symptomInfo?.color || 'text-ios-gray-500'} />
                              <div>
                                <h3 className="font-medium text-ios-gray-900">{symptomInfo?.label || symptom.type}</h3>
                                <div className="text-sm text-ios-gray-600 space-y-1">
                                  <div>{new Date(symptom.date).toLocaleDateString()}</div>
                                  <div className="flex items-center gap-2">
                                    <span>Severity:</span>
                                    <span className={`capitalize font-medium ${
                                      symptom.severity === 'severe' ? 'text-ios-red' :
                                      symptom.severity === 'moderate' ? 'text-ios-orange' :
                                      'text-ios-green'
                                    }`}>
                                      {symptom.severity}
                                    </span>
                                  </div>
                                  {symptom.notes && (
                                    <div className="mt-2 text-ios-gray-700">{symptom.notes}</div>
                                  )}
                                </div>
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

        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="ios-card">
                <h3 className="text-lg font-semibold text-ios-gray-900 mb-4">Cycle Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-ios-gray-600">Total Cycles:</span>
                    <span className="font-medium">{cycles.length}</span>
                  </div>
                  {predictions && (
                    <div className="flex justify-between">
                      <span className="text-ios-gray-600">Average Length:</span>
                      <span className="font-medium">{predictions.avgCycleLength} days</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-ios-gray-600">Symptoms Logged:</span>
                    <span className="font-medium">{symptoms.length}</span>
                  </div>
                </div>
              </div>

              <div className="ios-card">
                <h3 className="text-lg font-semibold text-ios-gray-900 mb-4">Common Symptoms</h3>
                <div className="space-y-2">
                  {symptomTypes.map(symptomType => {
                    const count = symptoms.filter(s => s.type === symptomType.value).length
                    const Icon = symptomType.icon
                    
                    return count > 0 ? (
                      <div key={symptomType.value} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon size={16} className={symptomType.color} />
                          <span className="text-ios-gray-700">{symptomType.label}</span>
                        </div>
                        <span className="font-medium">{count}</span>
                      </div>
                    ) : null
                  })}
                  {symptoms.length === 0 && (
                    <div className="text-center text-ios-gray-500 py-4">
                      No symptoms logged yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PeriodTracker