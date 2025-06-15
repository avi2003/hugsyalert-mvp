export interface User {
    id: string;
    last_checkin: Date;
    checkin_frequency_hours: number;
    alert_rules: AlertRule[];
}

export interface AlertRule {
    type: string;
    message: string;
    recipient: string;
}