const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendResultsEmail = functions.https.onCall(async (data, context) => {
  const { name, email, state, phoneNumber, results, userData } = data;

  // Basic validation
  if (!name || !email) {
    throw new functions.https.HttpsError("invalid-argument", "Name and email are required.");
  }

  try {
    // Example: Save to Firestore (optional)
    // await admin.firestore().collection("processedRequests").add({
    //   name,
    //   email,
    //   state: state || null,
    //   phoneNumber: phoneNumber || null,
    //   results: results || null,
    //   userData: userData || null,
    //   timestamp: admin.firestore.FieldValue.serverTimestamp(),
    // });

    // TODO: Implement actual email sending here via your provider

    return { status: "success", message: "Results email sent successfully!" };
  } catch (error) {
    console.error("Error sending results email:", error);
    throw new functions.https.HttpsError("internal", "Failed to send results email.", error.message);
  }
});