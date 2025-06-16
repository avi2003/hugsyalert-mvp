import * as sgMail from "@sendgrid/mail";
import * as functions from "firebase-functions/v2";

export const sendEmailAlert = async (to: string, subject: string, text: string) => {
  if (!to || !subject || !text) {
    throw new Error("Missing required email parameters");
  }

  sgMail.setApiKey(functions.config().sendgrid.api_key);

  const msg = {
    to,
    from: functions.config().sendgrid.from_email || "your-email@example.com",
    subject,
    text,
    html: text.replace(/\n/g, "<br>"), // Basic HTML conversion
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error;
  }
};
