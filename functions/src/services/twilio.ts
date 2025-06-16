import * as functions from "firebase-functions";
import {Twilio} from "twilio";

export const sendSmsAlert = async (to: string, body: string) => {
  // Initialize Twilio client inside function
  const twilioClient = new Twilio(
    functions.config().twilio.sid,
    functions.config().twilio.token
  );

  await twilioClient.messages.create({
    to,
    from: functions.config().twilio.phone,
    body,
  });
};
