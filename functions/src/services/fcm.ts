import * as admin from "firebase-admin";
import {logger} from "firebase-functions/v2";

export const sendPushNotification = async (token: string, title: string, body: string) => {
  const message = {
    notification: {
      title,
      body,
    },
    token: token,
  };

  try {
    await admin.messaging().send(message);
    logger.info("Push notification successfully sent to a device.");
  } catch (error) {
    logger.error(`Error sending push notification to token ${token}:`, error);
    // Future enhancement: Add logic here to remove invalid/expired tokens from Firestore.
  }
};