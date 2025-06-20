// in functions/src/services/twilio.ts
import {Twilio} from "twilio";
import {logger} from "firebase-functions/v2"; // Make sure to import the logger

export const sendSmsAlert = async (to: string, body: string) => {
  const apiKeySid = process.env.TWILIO_SID;
  const apiKeySecret = process.env.TWILIO_TOKEN;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;

  if (!apiKeySid || !apiKeySecret || !accountSid) {
    logger.error("Twilio credentials are not fully configured.");
    return;
  }
  
  const twilioClient = new Twilio(apiKeySid, apiKeySecret, {
    accountSid: accountSid,
  });

  const sanitizedTo = to.replace(/[^0-9+]/g, "");

  try {
    await twilioClient.messages.create({
      to: sanitizedTo,
      from: process.env.TWILIO_PHONE,
      body,
    });
    logger.info(`SMS successfully sent to ${to}`);
  } catch (error) {
    // Catch the error, log it for our own records, and do not crash.
    logger.error(`Failed to send SMS to ${to}:`, error);
  }
};
