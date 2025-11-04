// functions/index.js

const functions = require("firebase-functions");
const admin = require("firebase-admin");
// REMOVED: const { RecaptchaEnterpriseServiceClient } = require('@google-cloud/recaptcha-enterprise'); // Not needed for App Check context.app verification
const { setGlobalOptions } = require("firebase-functions");
const logger = require("firebase-functions/logger"); // For structured logging

// --- Global Options and Initialization ---
setGlobalOptions({ maxInstances: 10 });
admin.initializeApp();

// --- Main Cloud Function: sendResultsEmail ---
exports.sendResultsEmail = functions.https.onCall(async (data, context) => {
  // --- Firebase App Check Verification ---
  // If context.app is undefined, it means the request did not come from
  // an App Check verified app, or the token was invalid/missing.
  if (context.app === undefined) {
    logger.error('sendResultsEmail: Function must be called from an App Check verified app.', {
      auth: context.auth,
      appId: context.appId // Log this carefully; ensure it's not sensitive info if public
    });
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called from an App Check verified app.'
    );
  }

  // App Check passed! Now, get your data.
  // We no longer expect a 'recaptchaToken' in the data payload.
  const { name, email, state, phoneNumber, results, userData } = data;

  // --- Input Validation (Basic) ---
  // recaptchaToken is no longer required in 'data'
  if (!name || !email || !state) {
    logger.error('sendResultsEmail: Missing required fields in request data.', { data });
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing name, email, or state.'
    );
  }

  // --- 2. Proceed with your core logic if App Check passed ---
  try {
    logger.info('sendResultsEmail: App Check passed, proceeding with core logic.', { email });

    // TODO: Implement your email sending logic here
    // You would use a library like Nodemailer and an email service (SendGrid, Mailgun, etc.)
    logger.log(`[TODO] Email sending logic for ${email} would go here. Data:`, { name, email, results, userData });

    // TODO: If you want to save the request to Firestore (optional)
    // await admin.firestore().collection("userRequests").add({
    //   name,
    //   email,
    //   state,
    //   phoneNumber: phoneNumber || null,
    //   results,
    //   userData,
    //   appCheckVerified: true, // App Check status can be stored
    //   // If you retrieved a recaptchaScore from context.app, you could save it here too:
    //   // recaptchaScore: context.app.recaptcha_score,
    //   timestamp: admin.firestore.FieldValue.serverTimestamp(),
    // });

    return { status: "success", message: "Results email sent successfully!" };

  } catch (error) {
    logger.error("sendResultsEmail: Error in core logic (e.g., email sending, Firestore write):", error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to process results due to an internal error.'
    );
  }
});
