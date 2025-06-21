import {Twilio} from "twilio";
import {logger} from "firebase-functions/v2";

/**
 * Initiates an outbound voice call using Twilio and reads the message using TwiML.
 * @param to The recipient phone number.
 * @param message The message to be spoken.
 */
export const sendVoiceAlert = async (to: string, message: string) => {
  const apiKeySid = process.env.TWILIO_SID;
  const apiKeySecret = process.env.TWILIO_TOKEN;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const from = process.env.TWILIO_PHONE;

  if (!apiKeySid || !apiKeySecret || !accountSid || !from) {
    logger.error("Twilio credentials are not fully configured for voice calls.");
    return;
  }

  const twilioClient = new Twilio(apiKeySid, apiKeySecret, {accountSid});

  const sanitizedTo = to.replace(/[^0-9+]/g, "");

  try {
    await twilioClient.calls.create({
      to: sanitizedTo,
      from,
      twiml: `<Response><Say voice="alice">${message}</Say></Response>`,
    });
    logger.info(`Voice call successfully initiated to ${to}`);
  } catch (error) {
    logger.error(`Failed to initiate voice call to ${to}:`, error);
  }
};
