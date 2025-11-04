// src/App.js

import React, { useState } from "react";
import EmailForm from "./EmailForm";
// REMOVED: import { SpeedInsights } from "@vercel/speed-insights/react"; // <--- REMOVE THIS LINE
// Import 'app' and 'firebaseConfig' from your firebase setup (firebaseConfig might not be directly used here, but good practice if other components need it)
import { app, firebaseConfig } from "./firebase"; // <--- Ensure firebaseConfig is imported if your app uses it


const App = () => {
  // Example state (replace with your real logic)
  const [results] = useState({
    initialScore: 600,
    projectedScore: 720,
    totalImprovement: 120,
    confidenceLevel: 90,
    timeline: 12
  });
  const [userData] = useState({
    programTimeline: 12,
    totalDebt: 10000
  });

  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleReset = () => {
    // Reset logic here
    window.location.reload(); // Or your actual reset logic
  };

  // --- IMPORTANT NOTE ---
  // If you had a 'useEffect' block elsewhere (e.g., in a separate authentication context)
  // that was showing the "Firebase configuration is missing or empty" error,
  // ensure 'firebaseConfig' is imported into *that* file and the condition handles it.
  // This App.js doesn't contain such a useEffect.

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-3">Your Results</h3>
        <div className="mb-6">
          <div className="text-lg font-semibold">
            Projected Score: <span className="text-blue-700">{results.projectedScore}</span>
          </div>
          <div className="text-lg font-semibold">
            Timeline: <span className="text-blue-700">{results.timeline || userData.programTimeline || "N/A"} months</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <button
            onClick={handleReset}
            className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
          >
            Run New Simulation
          </button>
          <button
            onClick={() => setShowEmailForm(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
          >
            Send Results
          </button>
        </div>
        {/* Show the email form when the button is clicked */}
        {showEmailForm && (
          <EmailForm results={results} userData={userData} />
        )}
      </div>
      {/* REMOVED: <SpeedInsights /> */} {/* <--- REMOVE THIS LINE */}
    </div>
  );
};

export default App;
