import sgMail from "@sendgrid/mail";

export const sendEmailAlert = async (to: string, subject: string, text: string): Promise<void> => {
  const apiKey = process.env.SENDGRID_KEY;
  if (!apiKey) {
    // This is a critical server error, log it for yourself.
    console.error("FATAL: SENDGRID_KEY environment variable is not set.");
    // Don't throw the raw error to the user, just stop.
    return; 
  }

  // Initialize the client
  sgMail.setApiKey(apiKey);

  const msg = {
    to,
    from: "alerts@hugsyalert.com", // Your verified sender
    subject,
    text,
    // Optional: Add a plain-text version for older email clients
    // html: `<strong>${text}</strong>`, 
  };

  try {
    await sgMail.send(msg);
    console.log(`Email successfully sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email via SendGrid to ${to}:`, error);
    // We'll log the error but won't re-throw, to allow other rules to run.
  }
};
