# Personal Organiser - All-in-One Lifestyle Management App

A beautifully designed, fully functional organiser webapp with iOS-themed styling that combines journal writing, task management, financial tracking, period monitoring, and chat functionality in one seamless experience.

## ✨ Features

### 🎯 **Task Organiser**
- Create, edit, and delete tasks with priorities
- Mark tasks as complete/incomplete
- Filter by priority (low, medium, high) and status
- Search functionality across all tasks
- Due date tracking
- Smooth animations and iOS-style interactions

### 📖 **Journal**
- Rich text editor with formatting options
- Mood tracking with visual indicators
- Tag system for easy categorization
- Search through journal entries
- Filter by mood and date
- Responsive entries display

### 💰 **Finance Tracker**
- Income and expense tracking
- Category-based organization
- Interactive charts and analytics
- Monthly trends visualization
- Balance calculations
- Transaction search and filtering

### 🩸 **Period Tracker**
- Menstrual cycle tracking with calendar view
- Symptom logging with severity levels
- Cycle predictions based on historical data
- Fertile window calculations
- Visual calendar indicators
- Comprehensive insights and statistics

### 💬 **Chat Interface**
- Create multiple conversations
- AI-powered responses for self-reflection
- Message history with timestamps
- Conversation management
- Real-time messaging interface

## 🎨 Design Features

- **iOS-themed styling** with authentic colors and typography
- **Smooth animations** using Framer Motion
- **Responsive design** optimized for mobile and desktop
- **Consistent UI/UX** across all modules
- **Dark/light theme** with iOS color palette
- **Touch-friendly** interactions and gestures

## 🛠 Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom iOS theme
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Rich Text**: React Quill
- **Calendar**: React Calendar
- **Icons**: Lucide React
- **State Management**: React Context API
- **Data Persistence**: Local Storage

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-organiser
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 📱 Usage Guide

### Dashboard
The main dashboard provides an overview of all modules with quick stats and easy navigation.

### Task Management
1. Click "Add Task" to create new tasks
2. Set priority levels and due dates
3. Use filters to organize your view
4. Mark tasks complete with a single click

### Journaling
1. Create new entries with "New Entry"
2. Use the rich text editor for formatting
3. Set mood and add tags for organization
4. Search through past entries

### Finance Tracking
1. Add transactions with categories
2. View analytics and charts
3. Monitor monthly trends
4. Track income vs expenses

### Period Tracking
1. Log cycle start/end dates
2. Record symptoms and severity
3. View predictions on calendar
4. Monitor patterns and insights

### Chat Feature
1. Create new conversations
2. Type messages for AI responses
3. Manage multiple chat threads
4. Delete conversations when needed

## 🎯 Key Features

### Data Persistence
All data is automatically saved to browser's local storage, ensuring your information persists across sessions.

### Responsive Design
Optimized for all screen sizes from mobile phones to desktop computers.

### iOS Aesthetics
- SF Pro font family
- Authentic iOS color scheme
- Rounded corners and shadows
- Smooth transitions and animations

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios
- Touch-friendly controls

## 🔧 Customization

### Theme Colors
Modify colors in `tailwind.config.js`:
```javascript
colors: {
  ios: {
    blue: '#007AFF',
    green: '#34C759',
    // ... other colors
  }
}
```

### Animations
Adjust animations in `src/index.css` or component files using Framer Motion.

## 📊 Performance

- Fast loading with Vite bundling
- Optimized animations at 60fps
- Efficient re-renders with React optimization
- Minimal bundle size

## 🔐 Privacy

- All data stored locally in browser
- No external data transmission
- Complete privacy and control
- Export/import functionality ready

## 🛣 Roadmap

- [ ] Data export/import functionality
- [ ] Cloud sync capabilities
- [ ] Dark mode toggle
- [ ] Notification system
- [ ] PWA support
- [ ] Enhanced analytics
- [ ] Custom themes

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Apple for iOS design inspiration
- React team for the amazing framework
- Tailwind CSS for utility-first styling
- Framer Motion for smooth animations

---

**Built with ❤️ for productivity and wellness**
