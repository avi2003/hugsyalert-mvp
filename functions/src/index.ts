import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";

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
    throw new functions.https.HttpsError(
        "internal",
        "An error occurred while trying to check in."
    );
  }
});
