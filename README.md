# Walmart Voice Shopping Bot

A modern voice-enabled shopping application that integrates a Python backend with a React frontend for seamless voice shopping experiences.

## 🚀 Features

- **Voice Shopping**: Use natural language to add items to your cart
- **Smart Product Recognition**: Recognizes common grocery items and quantities
- **Real-time Cart Management**: Add, remove, and update items via voice commands
- **Modern UI**: Beautiful dark theme with smooth animations
- **Responsive Design**: Works on desktop and mobile devices
- **Python Backend**: Powered by Flask and OmniDimension for advanced voice processing

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **CSS3** with modern animations and gradients
- **FontAwesome** icons
- **Web Speech API** for voice recognition

### Backend
- **Python Flask** server
- **OmniDimension** for advanced voice processing
- **CORS** enabled for frontend communication
- **Product database** with real Walmart pricing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- pip (Python package manager)

### Backend Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the Python backend:**
   ```bash
   python start.py
   ```
   Or directly:
   ```bash
   python app.py
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## 🎯 Usage

### Voice Commands

The voice bot understands natural language commands:

- **Add items**: "Add milk to my cart", "Add 2 cans of diet coke"
- **Remove items**: "Remove bread from my cart", "Take out the eggs"
- **Check cart**: "Show my cart", "What's in my cart"
- **Get help**: "What can you do?", "Help"

### Supported Products

The bot recognizes common grocery items:
- **Dairy**: Milk, Cheese, Butter, Eggs
- **Beverages**: Coke, Diet Coke, Pepsi
- **Produce**: Bananas, Apples
- **Meat**: Chicken Breast
- **Pantry**: Bread, Rice

### Voice Shopping Flow

1. Click the "Voice Shop" button in the header
2. Click "Start Voice Shopping" in the modal
3. Say "Hey Walmart" followed by your request
4. The bot will process your command and add items to your cart
5. View your cart in real-time or navigate to the cart page

## 🏗️ Project Structure

```
walmart-bot/
├── app.py                 # Flask backend server
├── bot.py                 # Original OmniDimension bot setup
├── start.py              # Backend startup script
├── requirements.txt       # Python dependencies
├── package.json          # Node.js dependencies
├── vite.config.js        # Vite configuration
├── index.html            # Main HTML file
├── src/
│   ├── main.jsx         # React entry point
│   ├── App.jsx          # Main React component
│   ├── App.css          # App styles
│   ├── index.css        # Global styles
│   └── components/      # React components
│       ├── Header.jsx   # Navigation header
│       ├── Hero.jsx     # Hero section
│       ├── Categories.jsx # Product categories
│       ├── VoiceDemo.jsx # Voice demo section
│       ├── CartPreview.jsx # Cart preview
│       ├── VoiceBot.jsx # Voice bot interface
│       ├── CartPage.jsx # Full cart page
│       ├── Footer.jsx   # Footer component
│       └── *.css        # Component styles
└── README.md            # This file
```

## 🔧 API Endpoints

### Backend API (Flask)

- `GET /api/health` - Health check
- `GET /api/cart` - Get cart contents
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove` - Remove item from cart
- `POST /api/cart/update` - Update item quantity
- `POST /api/voice/start` - Start voice session
- `POST /api/voice/process` - Process voice command

## 🎨 UI Features

- **Dark Theme**: Modern dark interface with blue accents
- **Smooth Animations**: CSS transitions and keyframe animations
- **Gradient Backgrounds**: Beautiful gradient effects
- **Responsive Design**: Works on all screen sizes
- **Voice Interface**: Modal-based voice shopping interface
- **Cart Management**: Full cart page with quantity controls

## 🚀 Development

### Running in Development Mode

1. **Terminal 1 - Backend:**
   ```bash
   python start.py
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Building for Production

```bash
npm run build
```

## 🔍 Troubleshooting

### Common Issues

1. **Backend won't start:**
   - Check if Python dependencies are installed: `pip install -r requirements.txt`
   - Ensure port 5000 is available

2. **Frontend can't connect to backend:**
   - Verify backend is running on http://localhost:5000
   - Check browser console for CORS errors

3. **Voice recognition not working:**
   - Ensure microphone permissions are granted
   - Try refreshing the page
   - Check if Web Speech API is supported in your browser

4. **Products not being added to cart:**
   - Check browser console for API errors
   - Verify the voice command format
   - Try the example commands listed above

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes. Walmart branding and trademarks belong to their respective owners.

## 🙏 Acknowledgments

- **OmniDimension** for voice processing capabilities
- **React** and **Vite** for the frontend framework
- **Flask** for the backend framework
- **FontAwesome** for the icons

---

**Note**: This is a demo application. For production use, implement proper security measures, database storage, and error handling. 