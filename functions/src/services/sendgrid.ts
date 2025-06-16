import * as sgMail from "@sendgrid/mail";

export const sendEmailAlert = async (to: string, subject: string, text: string) => {
  const apiKey = process.env.SENDGRID_KEY;
  if (!apiKey) {
    throw new Error("SENDGRID_KEY environment variable is not set");
  }
  sgMail.setApiKey(apiKey);
  
  const msg = {to, from: "alerts@hugsyalert.com", subject, text};
  await sgMail.send(msg);
};
