#!/usr/bin/env python3
"""
Start script for Walmart Voice Shopping Bot
This script starts the Flask backend server
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def check_dependencies():
    """Check if required Python packages are installed"""
    required_packages = ['flask', 'flask-cors', 'omnidimension', 'python-dotenv']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"Missing required packages: {', '.join(missing_packages)}")
        print("Please install them using: pip install -r requirements.txt")
        return False
    
    return True

def start_backend():
    """Start the Flask backend server"""
    print("🚀 Starting Walmart Voice Shopping Bot Backend...")
    print("=" * 50)
    
    # Check if app.py exists
    if not Path("app.py").exists():
        print("❌ Error: app.py not found!")
        print("Please make sure you're in the correct directory.")
        return False
    
    # Check dependencies
    if not check_dependencies():
        return False
    
    try:
        print("✅ Dependencies check passed")
        print("🌐 Starting Flask server on http://localhost:5000")
        print("📱 Frontend will be available on http://localhost:5173")
        print("=" * 50)
        print("💡 To start the frontend, run: npm run dev")
        print("=" * 50)
        
        # Start the Flask app
        from app import app
        app.run(debug=True, host='0.0.0.0', port=5000)
        
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        return False
    
    return True

if __name__ == "__main__":
    start_backend() 