#!/usr/bin/env python3
"""
Simple Python API server for Constitutional Market Harmonics Dashboard
"""

from flask import Flask, jsonify
from flask_cors import CORS
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Mock data
DASHBOARD_DATA = {
    "success": True,
    "data": {
        "portfolio": {
            "total_value": 1250000,
            "cash": 50000,
            "positions": [
                {"symbol": "AAPL", "quantity": 100, "avgPrice": 150.25, "value": 17523, "weight": 0.35, "constitutionalScore": 0.92},
                {"symbol": "MSFT", "quantity": 75, "avgPrice": 380.50, "value": 28537.5, "weight": 0.25, "constitutionalScore": 0.88},
                {"symbol": "GOOGL", "quantity": 50, "avgPrice": 140.75, "value": 7037.5, "weight": 0.15, "constitutionalScore": 0.85},
                {"symbol": "TSLA", "quantity": 30, "avgPrice": 242.10, "value": 7263, "weight": 0.12, "constitutionalScore": 0.78},
                {"symbol": "AMZN", "quantity": 25, "avgPrice": 185.50, "value": 4637.5, "weight": 0.08, "constitutionalScore": 0.82}
            ]
        },
        "performance": {
            "roi": 0.156,
            "sharpe": 1.85,
            "constitutionalScore": 0.87,
            "volatility": 0.0245
        },
        "recentTrades": [
            {"symbol": "AAPL", "action": "BUY", "size": 10, "price": 152.30, "timestamp": datetime.now().isoformat(), "strategy": "Fractal Momentum"},
            {"symbol": "MSFT", "action": "SELL", "size": 5, "price": 385.20, "timestamp": datetime.now().isoformat(), "strategy": "Constitutional Exit"},
            {"symbol": "GOOGL", "action": "BUY", "size": 8, "price": 142.15, "timestamp": datetime.now().isoformat(), "strategy": "Chaos Signal"}
        ],
        "chaosSignals": {
            "lorenz": {"signal": 0.65, "confidence": 0.89},
            "chen": {"signal": 0.72, "confidence": 0.91},
            "rossler": {"signal": 0.58, "confidence": 0.76}
        }
    }
}

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard():
    return jsonify(DASHBOARD_DATA)

@app.route('/api/chat', methods=['POST'])
def chat():
    return jsonify({
        "success": True,
        "response": "Constitutional AI: Your portfolio shows strong fractal alignment with current market harmonics. The chaos signals indicate favorable entry conditions for additional positions."
    })

@app.route('/api/global-sentiment', methods=['GET'])
def get_sentiment():
    return jsonify({
        "success": True,
        "data": {
            "sentiment": 0.67,
            "bullish": 0.71,
            "bearish": 0.29,
            "timestamp": datetime.now().isoformat()
        }
    })

@app.route('/api/chaos', methods=['GET'])
def get_chaos():
    return jsonify({
        "success": True,
        "data": {
            "constitutionalScore": 0.87,
            "timestamp": datetime.now().isoformat()
        }
    })

if __name__ == '__main__':
    print("🌀 Constitutional Market Harmonics - Python API Server")
    print("Starting server on http://localhost:3002")
    app.run(host='127.0.0.1', port=3002, debug=False)