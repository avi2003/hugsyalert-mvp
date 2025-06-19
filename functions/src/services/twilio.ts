// in functions/src/services/twilio.ts
import {Twilio} from "twilio";

export const sendSmsAlert = async (to: string, body: string) => {
  // Get all the credentials from the environment
  const apiKeySid = process.env.TWILIO_SID;
  const apiKeySecret = process.env.TWILIO_TOKEN;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;

  // Initialize the client with the accountSid option
  const twilioClient = new Twilio(apiKeySid, apiKeySecret, {
    accountSid: accountSid,
  });

  const sanitizedTo = to.replace(/[^0-9+]/g, "");

  await twilioClient.messages.create({
    to: sanitizedTo,
    from: process.env.TWILIO_PHONE,
    body,
  });
};
