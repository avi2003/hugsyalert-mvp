import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize the Firebase Admin SDK.
// This gives your functions access to your Firestore database.
admin.initializeApp();

/**
 * A callable function that allows an authenticated user to update their
 * 'last_checkin' timestamp in Firestore.
 */
export const checkIn = functions.https.onCall(
    async (data: unknown, context: functions.https.CallableContext) => {
      // 1. Authentication Check: Ensure the user is logged in.
      // The 'context.auth' object is automatically populated by Firebase.
      // If it's null, the user is not authenticated.
      if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
      }

      // 2. Get the User ID (UID)
      // This is the unique ID for the user who called the function.
      const uid = context.auth.uid;

      // 3. Log the action for debugging purposes.
      // This log will appear in your Firebase Functions logs.
      functions.logger.info(`User ${uid} is checking in.`);

      // 4. Update the Database
      // We're creating a reference to the user's document in the 'users' collection.
      const userDocRef = admin.firestore().collection("users").doc(uid);

      try {
        // We'll use 'update' to change the 'last_checkin' field.
        // admin.firestore.FieldValue.serverTimestamp() is a special value that
        // tells Firestore to use its own server's time.
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
        // If something goes wrong (e.g., the user document doesn't exist),
        // log the error and throw an error back to the user.
        functions.logger.error(`Error checking in for user ${uid}:`, error);
        throw new functions.https.HttpsError(
            "internal",
            "An error occurred while trying to check in."
        );
      }
    }
);
