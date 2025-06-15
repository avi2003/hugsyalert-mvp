import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sendSmsAlert } from './services/twilio';
import { sendEmailAlert } from './services/sendgrid';

admin.initializeApp();

export const scheduledAlertFunction = functions.pubsub.schedule('every 15 minutes').onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const checkinFrequencyHours = 24; // Example frequency, adjust as needed

    const usersSnapshot = await admin.firestore().collection('users')
        .where('last_checkin', '<', new Date(now.toMillis() - checkinFrequencyHours * 60 * 60 * 1000))
        .get();

    const alertLogs: any[] = [];

    usersSnapshot.forEach(async (userDoc) => {
        const userData = userDoc.data();
        const alertRules = userData.alert_rules || [];

        for (const rule of alertRules) {
            try {
                if (rule.type === 'sms') {
                    await sendSmsAlert(userData.phoneNumber, rule.message);
                } else if (rule.type === 'email') {
                    await sendEmailAlert(userData.email, rule.subject, rule.message);
                }
                alertLogs.push({ userId: userDoc.id, status: 'success', rule });
            } catch (error) {
                alertLogs.push({ userId: userDoc.id, status: 'fail', rule, error: error.message });
            }
        }
    });

    // Log the alert attempts
    alertLogs.forEach(async (log) => {
        await admin.firestore().collection('alert_logs').add(log);
    });

    return null;
});