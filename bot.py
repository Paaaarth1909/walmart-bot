from omnidimension import Client
import json
import os
from datetime import datetime

# Initialize client
client = Client(api_key="CG5rSN1vd5oRJqXiVCK3ILEFLIp46QsVP08a7rDVq8E")

# Create an agent with enhanced voice shopping capabilities
response = client.agent.create(
    name="WalmartVoiceShopper",
    welcome_message="""Welcome to Walmart's voice shopping assistant! I can help you add items to your cart, check prices, and manage your shopping list. Just say 'Hey Walmart' followed by what you'd like to do. For example, 'Hey Walmart, add a can of diet coke to my cart' or 'Hey Walmart, add 2 gallons of milk to my cart'.""",
    context_breakdown=[
        {"title": "Voice Activation and Recognition", "body": """Listen for the wake phrase 'Hey Walmart' or 'Hello Walmart' to activate the shopping assistant. Once activated, immediately process the user's shopping request. Recognize natural language patterns like 'add', 'put in cart', 'I want', 'get me', 'need', 'buy', etc. Extract product names, quantities, and brands from the user's speech.""", "is_enabled": True},
        {"title": "Product Recognition and Validation", "body": """When users mention products, validate against common Walmart inventory. For food items, recognize variations like 'milk' (default to whole milk), 'bread' (default to white bread), 'eggs' (default to large eggs), 'coke' (default to Coca-Cola), 'diet coke', 'pepsi', etc. For quantities, understand 'a', 'one', '1', 'two', '2', 'three', '3', 'pack', 'bottle', 'can', 'gallon', 'dozen', etc. Always confirm the exact product and quantity before adding to cart.""", "is_enabled": True},
        {"title": "Smart Product Matching", "body": """Match user requests to actual Walmart products. For example: 'diet coke' → 'Coca-Cola Diet Coke 12 oz Can', 'milk' → 'Great Value Whole Milk 1 Gallon', 'bread' → 'Great Value White Bread 20 oz', 'eggs' → 'Great Value Large Eggs 12 Count'. If multiple options exist, ask for clarification. For example: 'Which type of milk would you prefer - whole, 2%, or skim?'""", "is_enabled": True},
        {"title": "Cart Management", "body": """After confirming a product addition, provide immediate feedback: 'Perfect! I've added 2 cans of Diet Coke to your cart. The total is now $X.XX.' Allow users to modify quantities: 'Change the milk to 3 gallons' or 'Update the bread quantity to 2 loaves.' Support removal: 'Remove the eggs from my cart' or 'Take out the soda.' Always confirm changes before applying them.""", "is_enabled": True},
        {"title": "Price and Availability", "body": """When adding items, mention the price: 'Adding 1 gallon of Great Value Whole Milk for $3.48 to your cart.' If an item is out of stock, suggest alternatives: 'The Great Value Whole Milk is currently out of stock. Would you like to try the Organic Valley Whole Milk for $4.99 instead?' Always check availability before confirming additions.""", "is_enabled": True},
        {"title": "Multi-Item Processing", "body": """Handle multiple items in one request: 'Add milk, bread, and eggs to my cart.' Process each item individually: 'I'll add 1 gallon of Great Value Whole Milk for $3.48, 1 loaf of Great Value White Bread for $1.48, and 1 dozen Great Value Large Eggs for $2.98. Total addition: $7.94. Is that correct?' Allow users to modify individual items in multi-item requests.""", "is_enabled": True},
        {"title": "Conversation Flow", "body": """Maintain a friendly, helpful tone throughout. Use Walmart's brand voice - approachable, reliable, and efficient. Keep responses concise but informative. After each action, ask if there's anything else they need: 'Is there anything else you'd like to add to your cart today?' End conversations warmly: 'Thank you for shopping with Walmart! Your cart is ready for checkout.'""", "is_enabled": True},
        {"title": "Error Handling", "body": """If you can't understand a product request, ask for clarification: 'I didn't catch that. Could you please repeat the product name?' If a product isn't found, suggest alternatives: 'I don't see that exact product. Would you like to try [similar product] instead?' Always provide helpful alternatives rather than just saying no.""", "is_enabled": True}
    ],
    transcriber={
        "provider": "deepgram_stream",
        "silence_timeout_ms": 500,
        "model": "nova-3",
        "numerals": True,
        "punctuate": True,
        "smart_format": True,
        "diarize": False,
        "language": "en-US"
    },
    model={
        "model": "gpt-4o-mini",
        "temperature": 0.3
    },
    voice={
        "provider": "eleven_labs",
        "voice_id": "cgSgspJ2msm6clMCkdW9",
        "stability": 0.7,
        "similarity_boost": 0.8
    },
    post_call_actions={
        "email": {
            "enabled": True,
            "recipients": ["shopping-assistant@walmart.com"],
            "include": ["summary", "extracted_variables", "transcript"]
        },
        "extracted_variables": [
            {"key": "product_name", "prompt": "Extract the exact product name mentioned by the user (e.g., 'Diet Coke', 'Great Value Whole Milk')"},
            {"key": "product_quantity", "prompt": "Extract the quantity as a number (e.g., 1, 2, 3). Default to 1 if not specified."},
            {"key": "product_brand", "prompt": "Extract the brand name if specified (e.g., 'Coca-Cola', 'Great Value', 'Organic Valley')"},
            {"key": "product_type", "prompt": "Extract the product category or type (e.g., 'beverage', 'dairy', 'bread', 'eggs')"},
            {"key": "action_type", "prompt": "Extract the action: 'add', 'remove', 'update', 'check', or 'search'"},
            {"key": "cart_total", "prompt": "Calculate the total cost of items added in this session"},
            {"key": "session_id", "prompt": "Generate a unique session identifier for this shopping session"}
        ]
    },
)

print(f"Status: {response['status']}")
print(f"Created Agent: {response['json']}")

# Store the agent ID for later use
agent_id = response['json'].get('id')

# Save agent configuration
config = {
    "agent_id": agent_id,
    "created_at": datetime.now().isoformat(),
    "name": "WalmartVoiceShopper",
    "capabilities": [
        "Voice-activated shopping",
        "Product recognition and matching",
        "Cart management",
        "Price checking",
        "Multi-item processing"
    ]
}

with open("agent_config.json", "w") as f:
    json.dump(config, f, indent=2)

print(f"Agent configuration saved to agent_config.json")
print(f"Agent ID: {agent_id}")
