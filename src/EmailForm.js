import React, { useState } from "react";
import emailjs from "emailjs-com";
import ReCAPTCHA from "react-google-recaptcha";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./firebase"; // Make sure this path matches your project

const EmailForm = ({ results, userData }) => {
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadState, setLeadState] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadStatus, setLeadStatus] = useState('');
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaValue) {
      setLeadStatus("Please complete the reCAPTCHA.");
      return;
    }
    setLeadStatus('Sending...');

    // --- Call Firebase Cloud Function (optional, if set up) ---
    try {
      const functions = getFunctions(app);
      const processRequest = httpsCallable(functions, "processUserRequest");
      await processRequest({
        name: leadName,
        email: leadEmail,
        resultsData: {
          initial_score: results.initialScore,
          projected_score: results.projectedScore,
          total_score_gain: results.totalImprovement,
          estimated_savings: (Number(userData.totalDebt) * 0.55).toLocaleString(),
          confidence_level: results.confidenceLevel,
          state: leadState,
          phone: leadPhone,
        }
      });
    } catch (error) {
      // This is optional: you can show an error or just log it
      console.error("Cloud Function error:", error);
    }

    // --- Send Email via EmailJS ---
    try {
      await emailjs.send(
        'service_afcxuea',        // Your Service ID
        'template_567twzd',       // Your Template ID
        {
          user_first_name: leadName,
          email: leadEmail,
          state: leadState,
          phone: leadPhone,
          initial_score: results.initialScore,
          projected_score: results.projectedScore,
          total_score_gain: results.totalImprovement,
          estimated_savings: (Number(userData.totalDebt) * 0.55).toLocaleString(),
          confidence_level: results.confidenceLevel,
          products_html: '', // Add HTML if you want to show products, else leave blank
          unsubscribe_url: 'https://credebtfree.com/unsubscribe' // Or your real unsubscribe link
        },
        'oVRNTMb5UrIgnZMKF'       // Your EmailJS Public Key
      );
      setLeadStatus('Thank you! Your results have been sent.');
    } catch (e) {
      setLeadStatus('Error. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-lg font-bold mb-2">FICO-Based Precision Recovery Solutions</h3>
      <form onSubmit={handleLeadSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={leadName}
          onChange={e => setLeadName(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={leadEmail}
          onChange={e => setLeadEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Your State"
          value={leadState}
          onChange={e => setLeadState(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="tel"
          placeholder="Your Phone (optional)"
          value={leadPhone}
          onChange={e => setLeadPhone(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
        <ReCAPTCHA
          sitekey="6LeR9vwrAAAAALZ1YI9f0bWfAEZ8sNflBS4oj2zh"
          onChange={value => setRecaptchaValue(value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition"
        >
          Send My Results
        </button>
        {leadStatus && <div className="text-center text-sm mt-2">{leadStatus}</div>}
      </form>
    </div>
  );
};

export default EmailForm;