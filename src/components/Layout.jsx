import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  CheckSquare,
  BookOpen,
  DollarSign,
  Calendar,
  MessageCircle,
  Menu,
  X
} from 'lucide-react'

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Organiser', href: '/organiser', icon: CheckSquare },
    { name: 'Journal', href: '/journal', icon: BookOpen },
    { name: 'Finance', href: '/finance', icon: DollarSign },
    { name: 'Period', href: '/period', icon: Calendar },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
  ]

  const isActive = (href) => location.pathname === href

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden bg-surface shadow-ios px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ios-gray-900">Personal Organiser</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-ios hover:bg-ios-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isMobileMenuOpen ? 0 : '-100%'
        }}
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-surface shadow-ios-lg md:shadow-ios transform md:transform-none transition-transform duration-300 ease-in-out md:block`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-ios-gray-900 mb-8 hidden md:block">
            Personal Organiser
          </h1>
          
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center px-4 py-3 rounded-ios font-medium transition-all duration-200
                    ${isActive(item.href)
                      ? 'bg-ios-blue text-white shadow-ios'
                      : 'text-ios-gray-700 hover:bg-ios-gray-100 hover:text-ios-gray-900'
                    }
                  `}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-0">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout