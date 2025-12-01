// src/EmailForm.js

import React, { useState } from "react";
import { functions } from "./firebase";
import { httpsCallable } from "firebase/functions";

const EmailForm = ({ results, userData }) => {
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadState, setLeadState] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadStatus, setLeadStatus] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLeadStatus("");
    setMessageType("");

    if (!leadName || !leadEmail || !leadState) {
      setLeadStatus("Please fill in all required fields (Name, Email, State).");
      setMessageType("error");
      setIsSubmitting(false);
      return;
    }

    try {
      const sendResultsEmail = httpsCallable(functions, "sendResultsEmail");
      const response = await sendResultsEmail({
        name: leadName,
        email: leadEmail,
        state: leadState,
        phoneNumber: leadPhone || null,
        // recaptchaToken removed
        results,
        userData,
      });

      if (response.data?.status === "success") {
        setLeadStatus("Thank you! Your results have been sent to your email.");
        setMessageType("success");
        setLeadName("");
        setLeadEmail("");
        setLeadState("");
        setLeadPhone("");
      } else {
        setLeadStatus(response.data?.message || "Failed to send results. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setLeadStatus("Error sending results. Please try again.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-inner">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Send Your Results</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <input
            type="text"
            id="name"
            value={leadName}
            onChange={(e) => setLeadName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            id="email"
            value={leadEmail}
            onChange={(e) => setLeadEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">State:</label>
          <input
            type="text"
            id="state"
            value={leadState}
            onChange={(e) => setLeadState(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">Phone Number (Optional):</label>
          <input
            type="tel"
            id="phoneNumber"
            value={leadPhone}
            onChange={(e) => setLeadPhone(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send My Results"}
        </button>
        {leadStatus && (
          <p className={`mt-4 font-semibold ${messageType === "success" ? "text-green-600" : "text-red-600"} text-sm`}>
            {leadStatus}
          </p>
        )}
      </form>
    </div>
  );
};

export default EmailForm;