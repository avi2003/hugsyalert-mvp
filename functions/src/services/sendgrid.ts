import * as functions from "firebase-functions";
import * as sgMail from "@sendgrid/mail";

export const sendEmailAlert = async (to: string, subject: string, text: string) => {
  if (!to || !subject || !text) {
    throw new Error("Missing required email parameters");
  }

  // Initialize SendGrid with API key inside function
  sgMail.setApiKey(functions.config().sendgrid.key);

  const msg = {
    to,
    from: "alerts@hugsyalert.com",
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
