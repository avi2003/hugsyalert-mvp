// In functions/src/index.ts

// v1.0.1 - Forcing redeployment after fixing secret initialization.
import {HugsyUser} from "./types"; 
import * as functions from "firebase-functions/v2";
import * as scheduler from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import {sendSmsAlert} from "./services/twilio";
import {sendEmailAlert} from "./services/sendgrid";
import {sendPushNotification} from "./services/fcm"; // <-- Import the new service

// Define the secrets your project will use
functions.setGlobalOptions({
  maxInstances: 10,
  secrets: ["SENDGRID_KEY", "TWILIO_SID", "TWILIO_TOKEN", "TWILIO_PHONE"]
});

// Initialize the Firebase Admin SDK
admin.initializeApp();

/**
 * A callable function that allows an authenticated user to update their
 * 'last_checkin' timestamp in Firestore.
 */
export const checkIn = functions.https.onCall(
  // This function doesn't need any secrets
  {},
  async (request) => {
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
      throw new functions.https.HttpsError(
        "internal",
        "An error occurred while trying to check in."
      );
    }
  }
);

export const scheduledAlertEngine = scheduler.onSchedule(
  "every 15 minutes",
  async () => {
    functions.logger.info("Running scheduled alert engine...");

    // 1. Get ALL users from the collection.
    const usersSnapshot = await admin.firestore().collection("users").get();

    if (usersSnapshot.empty) {
      functions.logger.info("No users found in the database.");
      return;
    }

    functions.logger.info(`Found ${usersSnapshot.size} total users. Checking each one...`);

    // 2. Loop through each user to check them individually.
    for (const doc of usersSnapshot.docs) {
      const user = doc.data() as HugsyUser;
      const checkinFrequencyHours = user.checkin_frequency_hours || 24;
      
      if (!user.last_checkin) {
        functions.logger.info(
          `User ${doc.id} has no last_checkin time.` +
            " Skipping check."
        );
        continue;
      }
      
      const lastCheckinTime = user.last_checkin.toDate();
      const msPerHour = 60 * 60 * 1000;
      const cutoffTime = new Date(Date.now() - checkinFrequencyHours * msPerHour);
      
      if (lastCheckinTime < cutoffTime) {
        functions.logger.info(`ALERT: User ${doc.id} is late! Last check-in: ${lastCheckinTime}`);
      
        const rules = user.alert_rules || [];
        for (const rule of rules) {
          const name = user.pet_dossier?.name || "no name set";
          const email = user.email;
          const messageBody = 
            `HugsyAlert: ${email} missed their check-in.\n` +
            `Pet ${name} may need help.`;
          
          if (rule.method === "SMS") {
            await sendSmsAlert(rule.to, messageBody);
          } else if (rule.method === "EMAIL") {
            await sendEmailAlert(rule.to, "HugsyAlert Emergency!", messageBody);
          } else if (rule.method === "PUSH") {
            // New logic for push notifications
            if ((user as any).fcm_tokens && (user as any).fcm_tokens.length > 0) {
              functions.logger.info(`Sending PUSH notifications to ${(user as any).fcm_tokens.length} devices.`);
              for (const token of (user as any).fcm_tokens) {
                await sendPushNotification(token, "HugsyAlert Emergency!", messageBody);
              }
            } else {
              functions.logger.warn(`User ${doc.id} has a PUSH alert rule but no FCM tokens.`);
            }
          }
        }
      } else {
        functions.logger.info(`User ${doc.id} is OK. Last check-in: ${lastCheckinTime}`);
      }
    }

    functions.logger.info("Alert engine run completed successfully.");
  }
);

/**
 * A simple HTTP function to satisfy the Cloud Run health check requirement
 * for V2 functions. This function is not meant to be called directly.
 */
export const healthCheck = functions.https.onRequest(
  // This function doesn't need any secrets
  {},
  (request, response) => {
    response.send("HugsyAlert backend is running!");
  }
);
