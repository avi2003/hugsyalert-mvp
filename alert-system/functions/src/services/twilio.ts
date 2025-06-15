import twilio from 'twilio';

const accountSid = functions.config().twilio.account_sid;
const authToken = functions.config().twilio.auth_token;
const client = twilio(accountSid, authToken);

export const sendSmsAlert = async (to: string, message: string) => {
    try {
        const messageResponse = await client.messages.create({
            body: message,
            from: functions.config().twilio.phone_number,
            to: to,
        });
        return messageResponse;
    } catch (error) {
        console.error('Error sending SMS alert:', error);
        throw new Error('Failed to send SMS alert');
    }
};