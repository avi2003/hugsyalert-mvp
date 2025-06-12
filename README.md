# 🐾 PawConnect MVP

[![Project Status: WIP – Initial MVP Build](https://img.shields.io/badge/status-in%20progress-yellow.svg)](https://shields.io/)

A GenAI-powered pet safety net that provides peace of mind to single pet owners by creating a reliable, automated communication bridge in case of an emergency.

---

### The Core Problem

Single pet owners (~18M households in the US) lack a reliable, automated system to ensure their pet's immediate care if they are suddenly incapacitated or unable to return home. PawConnect solves this core anxiety by intelligently alerting a trusted network of helpers.

### Tech Stack (Firebase-First Architecture)

*   **Backend:** Serverless via [Firebase Functions](https://firebase.google.com/docs/functions) (TypeScript)
*   **Database:** [Firestore](https://firebase.google.com/docs/firestore) (NoSQL)
*   **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth)
*   **Communication APIs:** [Twilio](https://www.twilio.com/) (for SMS) & [SendGrid](https://sendgrid.com/) (for Email)

---

### Project Structure

All the backend logic for this project resides within the `/functions` directory, as per the standard Firebase Functions project structure.

-   `/functions/src/index.ts`: The main entry point for all Cloud Functions.
-   `/functions/package.json`: Node.js dependencies for the backend.

---

### Getting Started: Local Development

To run this project locally, you will need Node.js and the Firebase CLI installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/pawconnect-mvp.git
    cd pawconnect-mvp
    ```

2.  **Install dependencies:**
    The backend logic is in the `functions` directory.
    ```bash
    cd functions
    npm install
    ```

3.  **Set up environment variables:**
    This project uses Firebase environment configuration for secret keys. You will need to set this up for your local emulator to work. Run the following commands from the `functions` directory:
    ```bash
    # Get your keys from the Twilio & SendGrid dashboards
    firebase functions:config:set twilio.sid="YOUR_SID" twilio.token="YOUR_TOKEN" twilio.phone="YOUR_TWILIO_PHONE_NUMBER"
    firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"
    ```
    *To view your config, run `firebase functions:config:get`.*

4.  **Run the Firebase Local Emulator Suite:**
    The emulator suite allows you to run a local version of Firebase services.
    ```bash
    # From the project root directory (not /functions)
    firebase emulators:start
    ```
    This will start local versions of Authentication, Firestore, and your Cloud Functions. You can interact with them at the Emulator UI (usually `http://localhost:4000`).

---

### License

This is a proprietary project. Please see the `LICENSE` file for more information.

Copyright (c) 2025 [Your Name]

---

### Contact

For questions or support, please email: `support@yourfuturepawconnectdomain.com`