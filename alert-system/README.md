# alert-system Project

This project implements a scheduled cloud function that monitors user check-ins and sends alerts based on defined rules. The function runs every 15 minutes and performs the following tasks:

1. **Detector Logic**: Queries the `users` collection to find users whose `last_checkin` is older than the specified frequency.
2. **Escalation Logic**: For each user found, it loops through their `alert_rules` array and sends alerts using Twilio for SMS and SendGrid for email.
3. **Logging Logic**: After each alert attempt, it logs the result to the `alert_logs` collection.

## Project Structure

```
alert-system
├── functions
│   ├── src
│   │   ├── index.ts
│   │   ├── services
│   │   │   ├── twilio.ts
│   │   │   └── sendgrid.ts
│   │   └── types
│   │       └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
└── README.md
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd alert-system/functions
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure your Twilio and SendGrid credentials in the environment variables.

4. Deploy the function:
   ```
   firebase deploy --only functions:yourAlertFunctionName
   ```

## Usage

The cloud function will automatically run every 15 minutes. Ensure that your database is set up correctly and that the `users` collection contains the necessary fields for the function to operate effectively.

## License

This project is licensed under the MIT License.