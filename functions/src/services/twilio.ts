import * as functions from "firebase-functions/v2";
import twilio from "twilio";

const accountSid = functions.config().twilio.account_sid;
const authToken = functions.config().twilio.auth_token;
const client = new twilio.Twilio(accountSid, authToken);

export const sendSmsAlert = async (to: string, message: string) => {
  if (!to || !message) {
    throw new Error("Missing required SMS parameters");
  }

  try {
    const messageResponse = await client.messages.create({
      body: message,
      from: functions.config().twilio.phone_number,
      to: to,
    });
    console.log(`SMS sent successfully to ${to}, SID: ${messageResponse.sid}`);
    return messageResponse;
  } catch (error) {
    // Log the full error object
    console.error("Twilio SMS failed:", error);

    // Handle the error appropriately
    if (error instanceof Error) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while sending SMS.");
    }
  }
};
