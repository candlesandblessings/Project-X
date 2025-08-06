import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStorage } from '../contexts/StorageContext'
import {
  Plus,
  Send,
  Search,
  MoreVertical,
  MessageCircle,
  User,
  Bot,
  Trash2,
  Edit
} from 'lucide-react'

const Chat = () => {
  const { data, updateData } = useStorage()
  const [activeConversation, setActiveConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewChatForm, setShowNewChatForm] = useState(false)
  const [newChatName, setNewChatName] = useState('')
  const messagesEndRef = useRef(null)

  const conversations = data.chat?.conversations || []
  const messages = data.chat?.messages || []

  const activeMessages = messages.filter(msg => msg.conversationId === activeConversation?.id)

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    scrollToBottom()
  }, [activeMessages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCreateConversation = () => {
    if (newChatName.trim()) {
      const chatData = data.chat || { conversations: [], messages: [] }
      const newConversation = {
        id: Date.now().toString(),
        name: newChatName,
        createdAt: new Date().toISOString(),
        lastMessage: '',
        lastMessageTime: new Date().toISOString()
      }
      
      updateData('chat', {
        ...chatData,
        conversations: [...chatData.conversations, newConversation]
      })
      
      setActiveConversation(newConversation)
      setNewChatName('')
      setShowNewChatForm(false)
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && activeConversation) {
      const chatData = data.chat || { conversations: [], messages: [] }
      const message = {
        id: Date.now().toString(),
        conversationId: activeConversation.id,
        content: newMessage,
        sender: 'user',
        timestamp: new Date().toISOString()
      }

      // Update messages
      const updatedMessages = [...chatData.messages, message]
      
      // Update conversation last message
      const updatedConversations = chatData.conversations.map(conv =>
        conv.id === activeConversation.id
          ? {
              ...conv,
              lastMessage: newMessage,
              lastMessageTime: new Date().toISOString()
            }
          : conv
      )

      updateData('chat', {
        conversations: updatedConversations,
        messages: updatedMessages
      })

      setNewMessage('')

      // Simulate bot response after a delay
      setTimeout(() => {
        const botResponse = generateBotResponse(newMessage)
        const botMessage = {
          id: (Date.now() + 1).toString(),
          conversationId: activeConversation.id,
          content: botResponse,
          sender: 'bot',
          timestamp: new Date().toISOString()
        }

        const currentData = JSON.parse(localStorage.getItem('personalOrganiser')) || { chat: { conversations: [], messages: [] } }
        const finalMessages = [...currentData.chat.messages, botMessage]
        const finalConversations = currentData.chat.conversations.map(conv =>
          conv.id === activeConversation.id
            ? {
                ...conv,
                lastMessage: botResponse,
                lastMessageTime: new Date().toISOString()
              }
            : conv
        )

        updateData('chat', {
          conversations: finalConversations,
          messages: finalMessages
        })
      }, 1000)
    }
  }

  const generateBotResponse = (userMessage) => {
    const responses = [
      "That's interesting! Tell me more about that.",
      "I understand. How does that make you feel?",
      "Thanks for sharing that with me.",
      "That sounds important to you. Can you elaborate?",
      "I see. What would you like to do about that?",
      "How has that been affecting you lately?",
      "That's a great point. What are your thoughts on it?",
      "I appreciate you opening up about that.",
      "What do you think the next step should be?",
      "That's quite thoughtful of you to consider."
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleDeleteConversation = (conversationId) => {
    const chatData = data.chat || { conversations: [], messages: [] }
    const updatedConversations = chatData.conversations.filter(conv => conv.id !== conversationId)
    const updatedMessages = chatData.messages.filter(msg => msg.conversationId !== conversationId)
    
    updateData('chat', {
      conversations: updatedConversations,
      messages: updatedMessages
    })
    
    if (activeConversation?.id === conversationId) {
      setActiveConversation(null)
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ios-gray-900">Chat</h1>
          <p className="text-ios-gray-600">Have conversations and get support</p>
        </div>
        <button
          onClick={() => setShowNewChatForm(true)}
          className="ios-button ios-button-primary flex items-center justify-center md:justify-start"
        >
          <Plus size={20} className="mr-2" />
          New Chat
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations Sidebar */}
        <div className="lg:col-span-1 ios-card p-0 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-ios-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ios-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ios-input pl-10"
              />
            </div>
          </div>

          {/* New Chat Form */}
          <AnimatePresence>
            {showNewChatForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 border-b border-ios-gray-200 bg-ios-gray-50"
              >
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Chat name..."
                    value={newChatName}
                    onChange={(e) => setNewChatName(e.target.value)}
                    className="ios-input"
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateConversation()}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateConversation}
                      className="ios-button ios-button-primary flex-1 text-sm py-2"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowNewChatForm(false)}
                      className="ios-button ios-button-secondary flex-1 text-sm py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-ios-gray-400 mx-auto mb-3" />
                <p className="text-ios-gray-500 text-sm">
                  {conversations.length === 0 ? 'No conversations yet' : 'No conversations match your search'}
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredConversations
                  .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime))
                  .map((conversation, index) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`
                        p-4 border-b border-ios-gray-100 cursor-pointer transition-colors hover:bg-ios-gray-50
                        ${activeConversation?.id === conversation.id ? 'bg-ios-blue bg-opacity-10' : ''}
                      `}
                      onClick={() => setActiveConversation(conversation)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-ios-gray-900 truncate">{conversation.name}</h3>
                          <p className="text-sm text-ios-gray-600 truncate mt-1">
                            {conversation.lastMessage || 'No messages yet'}
                          </p>
                          <p className="text-xs text-ios-gray-500 mt-1">
                            {formatDate(conversation.lastMessageTime)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteConversation(conversation.id)
                          }}
                          className="p-1 text-ios-gray-400 hover:text-ios-red transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 ios-card p-0 flex flex-col">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-ios-gray-200">
                <h2 className="text-lg font-semibold text-ios-gray-900">{activeConversation.name}</h2>
                <p className="text-sm text-ios-gray-600">
                  Created {formatDate(activeConversation.createdAt)}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeMessages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="w-16 h-16 text-ios-gray-400 mx-auto mb-4" />
                      <p className="text-ios-gray-500">Start a conversation</p>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence>
                    {activeMessages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start gap-2 max-w-xs lg:max-w-md ${
                          message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}>
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                            ${message.sender === 'user' ? 'bg-ios-blue' : 'bg-ios-gray-400'}
                          `}>
                            {message.sender === 'user' ? (
                              <User size={16} className="text-white" />
                            ) : (
                              <Bot size={16} className="text-white" />
                            )}
                          </div>
                          
                          <div className={`
                            p-3 rounded-ios-lg max-w-full
                            ${message.sender === 'user' 
                              ? 'bg-ios-blue text-white rounded-br-md' 
                              : 'bg-ios-gray-100 text-ios-gray-900 rounded-bl-md'
                            }
                          `}>
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender === 'user' ? 'text-ios-blue-100' : 'text-ios-gray-500'
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-ios-gray-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 ios-input"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="ios-button ios-button-primary px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-24 h-24 text-ios-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-ios-gray-600 mb-2">Select a conversation</h3>
                <p className="text-ios-gray-500">Choose a conversation from the sidebar or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chat