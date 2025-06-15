import * as sgMail from "@sendgrid/mail";
import * as functions from "firebase-functions/v2";

export const sendEmailAlert = async (to: string, subject: string, text: string) => {
  sgMail.setApiKey(functions.config().sendgrid.api_key);

  const msg = {
    to,
    from: "your-email@example.com",
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error; // Re-throw to handle in calling function
  }
};
