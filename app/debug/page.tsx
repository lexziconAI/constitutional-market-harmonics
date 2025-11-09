'use client';

import { useState, useEffect } from "react";

export default function DebugPage() {
  const [status, setStatus] = useState({
    backend: "Checking...",
    websocket: "Checking...",
    database: "Checking..."
  });

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch("http://localhost:3001/api/dashboard");
        setStatus(prev => ({
          ...prev,
          backend: res.ok ? " Connected" : " Error"
        }));
      } catch (e) {
        setStatus(prev => ({
          ...prev,
          backend: " Offline"
        }));
      }
    }
    
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">System Status</h1>
      <div className="space-y-4">
        <div className="border rounded p-4 bg-gray-50">
          <p className="font-semibold">Backend API: {status.backend}</p>
        </div>
        <div className="border rounded p-4 bg-gray-50">
          <p className="font-semibold">WebSocket: {status.websocket}</p>
        </div>
        <div className="border rounded p-4 bg-gray-50">
          <p className="font-semibold">Database: {status.database}</p>
        </div>
      </div>
    </div>
  );
}
