from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
from dotenv import load_dotenv

# Try to import OmniDimension, but don't fail if it's not available
try:
    from omnidimension import Client
    OMNIDIMENSION_AVAILABLE = True
except ImportError:
    OMNIDIMENSION_AVAILABLE = False
    print("Warning: OmniDimension not available. Using simplified voice processing.")

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize OmniDimension client only if available
if OMNIDIMENSION_AVAILABLE:
    try:
        client = Client(api_key=os.getenv("OMNIDIMENSION_API_KEY", "CG5rSN1vd5oRJqXiVCK3ILEFLIp46QsVP08a7rDVq8E"))
    except Exception as e:
        print(f"Warning: Could not initialize OmniDimension client: {e}")
        OMNIDIMENSION_AVAILABLE = False

# Store cart data in memory (in production, use a database)
cart_items = []
session_data = {}
next_item_id = 1  # Global counter for unique item IDs

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy", 
        "message": "Walmart Voice Bot API is running",
        "omnidimension_available": OMNIDIMENSION_AVAILABLE
    })

@app.route('/api/cart', methods=['GET'])
def get_cart():
    try:
        return jsonify({
            "items": cart_items,
            "total": sum(item['price'] * item['quantity'] for item in cart_items),
            "count": sum(item['quantity'] for item in cart_items)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    try:
        data = request.json
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        product_name = data.get('product_name')
        quantity = data.get('quantity', 1)
        price = data.get('price', 0)
        
        if not product_name:
            return jsonify({"success": False, "error": "Product name is required"}), 400
        
        # Find existing item
        existing_item = next((item for item in cart_items if item['name'] == product_name), None)
        
        if existing_item:
            existing_item['quantity'] += quantity
        else:
            global next_item_id
            cart_items.append({
                'id': next_item_id,
                'name': product_name,
                'quantity': quantity,
                'price': price
            })
            next_item_id += 1
        
        return jsonify({
            "success": True,
            "message": f"Added {quantity} {product_name} to cart",
            "cart": {
                "items": cart_items,
                "total": sum(item['price'] * item['quantity'] for item in cart_items),
                "count": sum(item['quantity'] for item in cart_items)
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/cart/remove', methods=['POST'])
def remove_from_cart():
    try:
        data = request.json
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        item_id = data.get('item_id')
        
        if item_id is None:
            return jsonify({"success": False, "error": "Item ID is required"}), 400
        
        global cart_items
        original_count = len(cart_items)
        cart_items = [item for item in cart_items if item['id'] != item_id]
        
        if len(cart_items) == original_count:
            return jsonify({"success": False, "error": "Item not found in cart"}), 404
        
        return jsonify({
            "success": True,
            "message": "Item removed from cart",
            "cart": {
                "items": cart_items,
                "total": sum(item['price'] * item['quantity'] for item in cart_items),
                "count": sum(item['quantity'] for item in cart_items)
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/cart/update', methods=['POST'])
def update_cart():
    try:
        data = request.json
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        item_id = data.get('item_id')
        quantity = data.get('quantity')
        
        if item_id is None or quantity is None:
            return jsonify({"success": False, "error": "Item ID and quantity are required"}), 400
        
        item_found = False
        for item in cart_items:
            if item['id'] == item_id:
                if quantity <= 0:
                    cart_items.remove(item)
                else:
                    item['quantity'] = quantity
                item_found = True
                break
        
        if not item_found:
            return jsonify({"success": False, "error": "Item not found in cart"}), 404
        
        return jsonify({
            "success": True,
            "message": "Cart updated",
            "cart": {
                "items": cart_items,
                "total": sum(item['price'] * item['quantity'] for item in cart_items),
                "count": sum(item['quantity'] for item in cart_items)
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/voice/start', methods=['POST'])
def start_voice_session():
    """Start a voice session with the OmniDimension bot"""
    try:
        # Create a new voice session
        session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        session_data[session_id] = {
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "messages": []
        }
        
        return jsonify({
            "success": True,
            "session_id": session_id,
            "message": "Voice session started. Say 'Hey Walmart' to begin shopping!"
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/voice/process', methods=['POST'])
def process_voice_command():
    """Process voice commands and return bot responses"""
    try:
        data = request.json
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        command = data.get('command', '').lower()
        session_id = data.get('session_id')
        
        if not command:
            return jsonify({"success": False, "error": "Command is required"}), 400
        
        # Process the command
        response = process_command(command)
        
        if session_id and session_id in session_data:
            session_data[session_id]['messages'].append({
                "timestamp": datetime.now().isoformat(),
                "user": command,
                "bot": response['message']
            })
        
        return jsonify(response)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

def process_command(command):
    """Process voice commands and return appropriate responses"""
    command = command.lower()
    
    # Product database (simplified)
    products = {
        'milk': {'name': 'Great Value Whole Milk', 'price': 3.48, 'unit': 'gallon'},
        'bread': {'name': 'Great Value White Bread', 'price': 1.48, 'unit': 'loaf'},
        'eggs': {'name': 'Great Value Large Eggs', 'price': 2.98, 'unit': 'dozen'},
        'diet coke': {'name': 'Coca-Cola Diet Coke', 'price': 0.99, 'unit': 'can'},
        'coke': {'name': 'Coca-Cola Classic', 'price': 0.99, 'unit': 'can'},
        'pepsi': {'name': 'Pepsi Cola', 'price': 0.99, 'unit': 'can'},
        'banana': {'name': 'Fresh Bananas', 'price': 1.99, 'unit': 'bunch'},
        'bananas': {'name': 'Fresh Bananas', 'price': 1.99, 'unit': 'bunch'},
        'apple': {'name': 'Fresh Apples', 'price': 2.99, 'unit': 'bag'},
        'apples': {'name': 'Fresh Apples', 'price': 2.99, 'unit': 'bag'},
        'chicken': {'name': 'Great Value Chicken Breast', 'price': 8.99, 'unit': 'package'},
        'rice': {'name': 'Great Value White Rice', 'price': 2.48, 'unit': 'bag'},
        'butter': {'name': 'Great Value Salted Butter', 'price': 2.48, 'unit': 'package'},
        'cheese': {'name': 'Great Value Cheddar Cheese', 'price': 2.18, 'unit': 'package'}
    }
    
    # Extract quantity and product
    quantity = 1
    product_name = None
    
    # Look for quantity indicators
    if 'two' in command or '2' in command:
        quantity = 2
    elif 'three' in command or '3' in command:
        quantity = 3
    elif 'four' in command or '4' in command:
        quantity = 4
    elif 'five' in command or '5' in command:
        quantity = 5
    elif 'six' in command or '6' in command:
        quantity = 6
    elif 'seven' in command or '7' in command:
        quantity = 7
    elif 'eight' in command or '8' in command:
        quantity = 8
    elif 'nine' in command or '9' in command:
        quantity = 9
    elif 'ten' in command or '10' in command:
        quantity = 10
    
    # Look for product names (improved matching)
    for product_key, product_info in products.items():
        if product_key in command:
            product_name = product_key
            break
    
    # Handle "add" commands
    if any(word in command for word in ['add', 'put', 'get', 'buy', 'need', 'want']):
        if product_name:
            # Add to cart
            product_info = products[product_name]
            add_to_cart_logic({
                'product_name': product_info['name'],
                'quantity': quantity,
                'price': product_info['price']
            })
            
            total_price = product_info['price'] * quantity
            cart_total = sum(item['price'] * item['quantity'] for item in cart_items)
            
            return {
                "success": True,
                "message": f"Perfect! I've added {quantity} {product_info['unit']} of {product_info['name']} to your cart for ${total_price:.2f}. The total is now ${cart_total:.2f}.",
                "action": "add_to_cart",
                "product": {
                    "name": product_info['name'],
                    "quantity": quantity,
                    "price": product_info['price']
                }
            }
        else:
            return {
                "success": False,
                "message": "I didn't catch that product. Could you please repeat what you'd like to add to your cart? Try saying 'add milk' or 'add bread'."
            }
    
    # Handle "remove" commands
    elif any(word in command for word in ['remove', 'take out', 'delete', 'drop']):
        if product_name:
            # Remove from cart
            product_info = products[product_name]
            removed = False
            for item in cart_items:
                if product_info['name'] in item['name']:
                    cart_items.remove(item)
                    removed = True
                    break
            
            if removed:
                return {
                    "success": True,
                    "message": f"I've removed {product_info['name']} from your cart.",
                    "action": "remove_from_cart"
                }
            else:
                return {
                    "success": False,
                    "message": f"I couldn't find {product_info['name']} in your cart."
                }
        else:
            return {
                "success": False,
                "message": "What would you like me to remove from your cart? Try saying 'remove milk' or 'remove bread'."
            }
    
    # Handle cart/checkout commands
    elif any(word in command for word in ['cart', 'checkout', 'total', 'items']):
        if cart_items:
            total = sum(item['price'] * item['quantity'] for item in cart_items)
            count = sum(item['quantity'] for item in cart_items)
            return {
                "success": True,
                "message": f"Your cart has {count} items with a total of ${total:.2f}. Ready for checkout!",
                "action": "show_cart"
            }
        else:
            return {
                "success": True,
                "message": "Your cart is empty. What would you like to add today?"
            }
    
    # Handle help commands
    elif any(word in command for word in ['help', 'what can you do', 'how does this work']):
        return {
            "success": True,
            "message": "I can help you add items to your cart, remove items, check your cart total, and help you checkout. Just say 'add milk' or 'remove bread' or 'show my cart'."
        }
    
    # Handle wake phrase
    elif 'hey walmart' in command or 'hello walmart' in command:
        return {
            "success": True,
            "message": "Hello! I'm your Walmart voice shopping assistant. What would you like to add to your cart today?"
        }
    
    # Default response for unrecognized commands
    else:
        return {
            "success": False,
            "message": "I didn't understand that. Try saying 'add milk' or 'remove bread' or 'show my cart'."
        }

def add_to_cart_logic(item_data):
    """Add item to cart (duplicate of the route function for internal use)"""
    product_name = item_data['product_name']
    quantity = item_data['quantity']
    price = item_data['price']
    
    existing_item = next((item for item in cart_items if item['name'] == product_name), None)
    
    if existing_item:
        existing_item['quantity'] += quantity
    else:
        global next_item_id
        cart_items.append({
            'id': next_item_id,
            'name': product_name,
            'quantity': quantity,
            'price': price
        })
        next_item_id += 1

if __name__ == '__main__':
    print("🚀 Starting Walmart Voice Bot Backend...")
    print("🌐 Server will be available at: http://localhost:5000")
    print("📱 Frontend should be running at: http://localhost:5173")
    print("=" * 50)
    app.run(debug=True, host='0.0.0.0', port=5000) 