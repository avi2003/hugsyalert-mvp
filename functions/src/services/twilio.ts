// in functions/src/services/twilio.ts
import {Twilio} from "twilio";

export const sendSmsAlert = async (to: string, body: string) => {
  // Initialize client inside the function
  const twilioClient = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  
  const sanitizedTo = to.replace(/[^0-9+]/g, "");

  await twilioClient.messages.create({
    to: sanitizedTo,
    from: process.env.TWILIO_PHONE,
    body,
  });
};
