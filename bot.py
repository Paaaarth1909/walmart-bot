from omnidimension import Client

# Initialize client
client = Client(api_key="CG5rSN1vd5oRJqXiVCK3ILEFLIp46QsVP08a7rDVq8E")

# Create an agent
response = client.agent.create(
    name="WalmartVoiceShopper",
    welcome_message="""Welcome to Walmart shopping assistant. What would you like to add to your cart today?""",
    context_breakdown=[
                {"title": "Voice Interaction Initialization", "body": """ Start by welcoming the user to the Walmart shopping assistant. Prompt them to name items they wish to add to their cart. Use phrases like: "Welcome to Walmart shopping assistant. What would you like to add to your cart today?" Listen for keywords such as 'add', 'want', or 'put'. Encourage them to provide the quantity and product type if applicable. """ , 
                "is_enabled" : True},
                {"title": "Product Recognition and Confirmation", "body": """ When the user provides a product command, like 'Add [product] to my cart', immediately confirm the product name and quantity to avoid errors. If the statement includes a specific brand or type, verify it, e.g., "You'd like 2 bottles of A2 milk, is that correct?" Continue by allowing the user to refine their selection or confirm. """ , 
                "is_enabled" : True},
                {"title": "Handling Ambiguities", "body": """ Listen carefully for potential ambiguities in the user's request. For example, if the user says, 'I need milk', ask clarifying questions like "Which brand or type of milk would you prefer?" or "How many cartons would you like to add?" This encourages specific user input and ensures accurate cart additions. """ , 
                "is_enabled" : True},
                {"title": "Multi-Item Recognition and Handling", "body": """ If the user lists multiple items, recognize each item and confirm collectively for a seamless experience. For instance, if they say, 'Add bread, butter, and eggs', reply with: "Adding bread, butter, and eggs. Please confirm the quantities you need for each item." This approach allows for clear verification and any necessary adjustments. """ , 
                "is_enabled" : True},
                {"title": "Quantity and Item Management", "body": """ To update an item quantity or remove an item, recognize phrases like 'Change quantity to', 'update to', or 'remove'. Confirm their request by saying, "You'd like to update milk to 3 cartons?" or "Removing eggs from your cart, is that right?" Prompt the user for corrections if needed. """ , 
                "is_enabled" : True},
                {"title": "Feedback and Confirmation", "body": """ After processes like adding or adjusting items, provide immediate and concise feedback. For successful actions, respond with "Got it, 2 cartons of almond milk added to your cart." Praise their choices to maintain a friendly tone, like "Perfect! 3 packs of your favorite cereal are added." Guidance continues by preparing the user for next steps. """ , 
                "is_enabled" : True},
                {"title": "Speech Style and Delivery", "body": """ Maintain a friendly and efficient tone throughout the conversation. Speak clearly and at a moderate pace. Use natural language patterns and keep sentences concise to suit a mobile platform. Avoid overly technical terms and focus on helpful, straightforward dialogue. """ , 
                "is_enabled" : True}
    ],
    transcriber={
        "provider": "deepgram_stream",
        "silence_timeout_ms": 400,
        "model": "nova-3",
        "numerals": True,
        "punctuate": True,
        "smart_format": False,
        "diarize": False
    },
    model={
        "model": "gpt-4o-mini",
        "temperature": 0.7
    },
    voice={
        "provider": "eleven_labs",
        "voice_id": "cgSgspJ2msm6clMCkdW9"
    },
    post_call_actions={
        "email": {
            "enabled": True,
            "recipients": ["example@example.com"],
            "include": ["summary", "extracted_variables"]
        },
        "extracted_variables": [
                    {"key": "product_name", "prompt": "Extract or Generate the product name from conversation."},
                    {"key": "product_quantity", "prompt": "Extract or Generate the product quantity from conversation."},
                    {"key": "product_type", "prompt": "Extract or Generate the product type or brand if specified in conversation."},
                    {"key": "action_type", "prompt": "Extract or Confirm the action type: add, update, or remove."}
        ]
    },
)

print(f"Status: {response['status']}")
print(f"Created Agent: {response['json']}")

# Store the agent ID for later examples
agent_id = response['json'].get('id')
