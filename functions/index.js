const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { RecaptchaEnterpriseServiceClient } = require('@google-cloud/recaptcha-enterprise');

admin.initializeApp();

const PROJECT_ID = "ccs-10-28";
const RECAPTCHA_SITE_KEY = "6Ld8JgEsAAAAAJfQBBNCdWxrObszFn9LCunW1zuL";
const EXPECTED_ACTION = "send_results_email"; // This should match your frontend action

async function createAssessment({
  projectID = PROJECT_ID,
  recaptchaKey = RECAPTCHA_SITE_KEY,
  token,
  recaptchaAction = EXPECTED_ACTION,
}) {
  const client = new RecaptchaEnterpriseServiceClient();
  const projectPath = client.projectPath(projectID);

  const request = {
    assessment: {
      event: {
        token: token,
        siteKey: recaptchaKey,
      },
    },
    parent: projectPath,
  };

  const [response] = await client.createAssessment(request);

  if (!response.tokenProperties.valid) {
    console.log(`The CreateAssessment call failed because the token was: ${response.tokenProperties.invalidReason}`);
    return null;
  }

  if (response.tokenProperties.action !== recaptchaAction) {
    console.log("The action attribute in your reCAPTCHA tag does not match the action you are expecting to score");
    return null;
  }

  console.log(`The reCAPTCHA score is: ${response.riskAnalysis.score}`);
  response.riskAnalysis.reasons.forEach((reason) => {
    console.log(reason);
  });

  return response.riskAnalysis.score;
}

exports.sendResultsEmail = functions.https.onCall(async (data, context) => {
  const { name, email, state, phoneNumber, recaptchaToken, results, userData } = data;

  if (!recaptchaToken) {
    throw new functions.https.HttpsError('invalid-argument', 'reCAPTCHA token is missing.');
  }

  let score;
  try {
    score = await createAssessment({
      token: recaptchaToken,
      recaptchaAction: EXPECTED_ACTION,
    });
    if (score === null) {
      throw new functions.https.HttpsError('permission-denied', 'reCAPTCHA verification failed.');
    }
    const MIN_ACCEPTABLE_SCORE = 0.7;
    if (score < MIN_ACCEPTABLE_SCORE) {
      throw new functions.https.HttpsError('permission-denied', 'reCAPTCHA score too low. Request blocked.');
    }
  } catch (err) {
    console.error("Error during reCAPTCHA Enterprise verification:", err);
    throw new functions.https.HttpsError('internal', 'Failed to verify reCAPTCHA. Please try again later.');
  }

  // --- Your core logic here (e.g., send email, save to Firestore) ---
  try {
    // Example: Save to Firestore
    // await admin.firestore().collection("processedRequests").add({
    //   name, email, state, phoneNumber, results, userData, timestamp: admin.firestore.FieldValue.serverTimestamp()
    // });

    return { status: "success", message: "Results email sent successfully!" };
  } catch (error) {
    console.error("Error sending results email:", error);
    throw new functions.https.HttpsError('internal', 'Failed to send results email.', error.message);
  }
});