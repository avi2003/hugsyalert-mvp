export const sendEmail = async (to: string, subject: string, text: string) => {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(functions.config().sendgrid.api_key);

    const msg = {
        to,
        from: 'your-email@example.com', // Use your verified SendGrid email
        subject,
        text,
    };

    try {
        await sgMail.send(msg);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
    }
};