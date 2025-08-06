import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useStorage } from '../contexts/StorageContext'
import {
  CheckSquare,
  BookOpen,
  DollarSign,
  Calendar,
  MessageCircle,
  Plus,
  TrendingUp,
  Target,
  Heart
} from 'lucide-react'

const Dashboard = () => {
  const { data } = useStorage()

  const stats = {
    tasks: {
      total: data.tasks?.length || 0,
      completed: data.tasks?.filter(task => task.completed)?.length || 0
    },
    journal: {
      entries: data.journal?.length || 0,
      thisWeek: data.journal?.filter(entry => {
        const entryDate = new Date(entry.date)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return entryDate >= weekAgo
      })?.length || 0
    },
    finance: {
      transactions: data.finances?.transactions?.length || 0,
      balance: data.finances?.transactions?.reduce((sum, t) => 
        sum + (t.type === 'income' ? t.amount : -t.amount), 0) || 0
    },
    period: {
      cycles: data.period?.cycles?.length || 0,
      nextPredicted: 'N/A'
    },
    chat: {
      conversations: data.chat?.conversations?.length || 0,
      messages: data.chat?.messages?.length || 0
    }
  }

  const cards = [
    {
      title: 'Organiser',
      href: '/organiser',
      icon: CheckSquare,
      color: 'bg-ios-blue',
      stats: [`${stats.tasks.completed}/${stats.tasks.total} completed`, `${stats.tasks.total - stats.tasks.completed} pending`],
      description: 'Manage your tasks and todos'
    },
    {
      title: 'Journal',
      href: '/journal',
      icon: BookOpen,
      color: 'bg-ios-green',
      stats: [`${stats.journal.entries} total entries`, `${stats.journal.thisWeek} this week`],
      description: 'Write and reflect on your thoughts'
    },
    {
      title: 'Finance',
      href: '/finance',
      icon: DollarSign,
      color: 'bg-ios-orange',
      stats: [`${stats.finance.transactions} transactions`, `$${stats.finance.balance.toFixed(2)} balance`],
      description: 'Track expenses and income'
    },
    {
      title: 'Period Tracker',
      href: '/period',
      icon: Calendar,
      color: 'bg-ios-pink',
      stats: [`${stats.period.cycles} cycles tracked`, `Next: ${stats.period.nextPredicted}`],
      description: 'Monitor your menstrual health'
    },
    {
      title: 'Chat',
      href: '/chat',
      icon: MessageCircle,
      color: 'bg-ios-purple',
      stats: [`${stats.chat.conversations} conversations`, `${stats.chat.messages} messages`],
      description: 'Chat and messaging'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-ios-gray-900 mb-2"
        >
          Welcome back!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-ios-gray-600"
        >
          Here's what's happening in your personal organiser
        </motion.p>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="ios-card text-center">
          <Target className="w-8 h-8 text-ios-blue mx-auto mb-2" />
          <div className="text-2xl font-bold text-ios-gray-900">{stats.tasks.total}</div>
          <div className="text-sm text-ios-gray-600">Total Tasks</div>
        </div>
        <div className="ios-card text-center">
          <BookOpen className="w-8 h-8 text-ios-green mx-auto mb-2" />
          <div className="text-2xl font-bold text-ios-gray-900">{stats.journal.entries}</div>
          <div className="text-sm text-ios-gray-600">Journal Entries</div>
        </div>
        <div className="ios-card text-center">
          <TrendingUp className="w-8 h-8 text-ios-orange mx-auto mb-2" />
          <div className="text-2xl font-bold text-ios-gray-900">${Math.abs(stats.finance.balance).toFixed(0)}</div>
          <div className="text-sm text-ios-gray-600">Balance</div>
        </div>
        <div className="ios-card text-center">
          <Heart className="w-8 h-8 text-ios-pink mx-auto mb-2" />
          <div className="text-2xl font-bold text-ios-gray-900">{stats.period.cycles}</div>
          <div className="text-sm text-ios-gray-600">Cycles Tracked</div>
        </div>
      </motion.div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Link
                to={card.href}
                className="block ios-card hover:shadow-ios-lg transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  <div className={`${card.color} p-3 rounded-ios mr-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-ios-gray-900">{card.title}</h3>
                    <p className="text-sm text-ios-gray-600">{card.description}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {card.stats.map((stat, i) => (
                    <div key={i} className="text-sm text-ios-gray-700">{stat}</div>
                  ))}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard