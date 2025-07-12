# Walmart Voice Shopping Application

A React-based voice shopping application that simulates Walmart's voice shopping experience. Users can add items to their cart using voice commands or text input.

## Features

- **Voice Recognition**: Uses Web Speech API for voice commands
- **Voice Shopping**: Say "Hey Walmart" followed by product requests
- **Product Database**: Includes common grocery items with prices
- **Cart Management**: Add, remove, and update quantities
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Walmart-style design with smooth animations

## Voice Commands

The application recognizes voice commands in the format:
- "Hey Walmart, add a can of diet coke to my cart"
- "Hey Walmart, add 2 gallons of milk to my cart"
- "Hey Walmart, add bread, eggs, and butter"

## Supported Products

- Diet Coke ($1.48)
- Milk ($3.48)
- Bread ($1.48)
- Eggs ($2.98)
- Butter ($2.48)
- Cheese ($2.18)
- Bananas ($0.58)
- Apples ($3.98)
- Chicken ($4.98)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd walmart-voice-shopping
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

1. **Voice Shopping**: Click the "Voice Shop" button in the bottom right corner
2. **Activate**: Say "Hey Walmart" to activate the voice assistant
3. **Add Items**: Speak your product request (e.g., "add a can of diet coke to my cart")
4. **Text Input**: Alternatively, type your request in the text input field
5. **Manage Cart**: View and modify items in your cart

## Browser Compatibility

The voice recognition feature requires a modern browser that supports the Web Speech API:
- Chrome (recommended)
- Edge
- Safari (limited support)

## Project Structure

```
src/
├── components/
│   ├── Header.js          # Navigation and search
│   ├── Hero.js           # Main landing section
│   ├── Categories.js     # Product categories
│   ├── VoiceDemo.js      # Voice shopping examples
│   ├── CartPreview.js    # Shopping cart display
│   ├── VoiceBot.js       # Voice assistant interface
│   ├── Footer.js         # Footer links
│   └── *.css             # Component styles
├── App.js                # Main application component
├── index.js              # React entry point
└── index.css             # Global styles
```

## Technologies Used

- **React 18**: Modern React with hooks
- **FontAwesome**: Icons
- **Web Speech API**: Voice recognition
- **CSS3**: Styling and animations
- **Responsive Design**: Mobile-first approach

## Voice Recognition Implementation

The application uses the Web Speech API's `webkitSpeechRecognition` for voice input:

```javascript
const recognition = new window.webkitSpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';
```

## Cart State Management

Cart state is managed using React hooks in the main App component:

```javascript
const [cartItems, setCartItems] = useState([]);
const addToCart = (item) => {
  // Add or update cart items
};
```

## Customization

### Adding New Products

To add new products, modify the `products` object in `VoiceBot.js`:

```javascript
const products = {
  'new-product': { 
    id: 'new-product-1', 
    name: 'Product Name', 
    price: 1.99, 
    quantity: 1 
  }
};
```

### Styling

The application uses CSS modules and follows Walmart's brand colors:
- Primary Blue: `#0071ce`
- Red: `#ff4444`
- Gray: `#f8f9fa`

## Development

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

### Environment Variables

Create a `.env` file in the root directory for environment variables:

```
REACT_APP_API_URL=your_api_url_here
```

## Deployment

1. Build the production version:
```bash
npm run build
```

2. Deploy the `build` folder to your hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes and is not affiliated with Walmart Inc.

## Troubleshooting

### Voice Recognition Not Working

1. Ensure you're using a supported browser (Chrome recommended)
2. Check that your microphone permissions are enabled
3. Try refreshing the page
4. Use the text input as an alternative

### Build Errors

1. Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

2. Clear React cache:
```bash
npm start -- --reset-cache
```

## Future Enhancements

- Integration with real Walmart API
- User authentication
- Order history
- Payment processing
- Advanced voice commands
- Product recommendations
- Multi-language support 