import * as functions from "firebase-functions/v2";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import {sendSmsAlert} from "./services/twilio";
import {sendEmailAlert} from "./services/sendgrid";

// Initialize the Firebase Admin SDK.
// This gives your functions access to your Firestore database.
admin.initializeApp();

/**
 * A callable function that allows an authenticated user to update their
 * 'last_checkin' timestamp in Firestore.
 */
export const checkIn = functions.https.onCall(async (request) => {
  // 1. Authentication Check: Ensure the user is logged in.
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  // 2. Get the User ID (UID)
  const uid = request.auth.uid;

  // 3. Log the action for debugging purposes.
  console.log(`User ${uid} is checking in.`);

  // 4. Update the Database
  const userDocRef = admin.firestore().collection("users").doc(uid);

  try {
    await userDocRef.update({
      last_checkin: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 5. Send a success response back to the user.
    return {
      status: "success",
      message: `Successfully checked in at ${new Date().toISOString()}`,
    };
  } catch (error) {
    // 6. Error Handling
    console.error(`Error checking in for user ${uid}:`, error);
    throw new functions.https.HttpsError("internal", "An error occurred while trying to check in.");
  }
});

export const scheduledAlertEngine = onSchedule("every 15 minutes", async (_event) => {
  try {
    const now = admin.firestore.Timestamp.now();
    const checkinFrequencyHours = 24;
    const cutoffTime = new Date(now.toMillis() - checkinFrequencyHours * 60 * 60 * 1000);

    const usersSnapshot = await admin
      .firestore()
      .collection("users")
      .where("last_checkin", "<", cutoffTime)
      .get();

    // Process users in parallel with Promise.all
    await Promise.all(
      usersSnapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();
        const alertRules = userData.alert_rules || [];

        // Process each rule sequentially for a user
        for (const rule of alertRules) {
          try {
            if (rule.type === "sms") {
              await sendSmsAlert(userData.phoneNumber, rule.message);
            } else if (rule.type === "email") {
              await sendEmailAlert(userData.email, rule.subject, rule.message);
            }

            // Log success immediately
            await admin.firestore().collection("alert_logs").add({
              userId: userDoc.id,
              status: "success",
              rule,
              timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });
          } catch (error) {
            // Log failure immediately
            await admin.firestore().collection("alert_logs").add({
              userId: userDoc.id,
              status: "fail",
              rule,
              error: error instanceof Error ? error.message : "Unknown error",
              timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });
          }
        }
      })
    );

    console.log("Alert engine run completed successfully");
  } catch (error) {
    console.error("Alert engine failed:", error);
    throw new Error("Alert engine execution failed");
  }
});

/**
 * A simple HTTP function to satisfy the Cloud Run health check requirement
 * for V2 functions. This function is not meant to be called directly.
 */
export const healthCheck = onRequest((request, response) => {
  response.send("HugsyAlert backend is running!");
});
