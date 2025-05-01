
import * as admin from 'firebase-admin';

// Ensure Firebase Admin is initialized only once
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      // If running locally with Application Default Credentials (ADC) set up (gcloud auth application-default login),
      // you might not need explicit credentials.
      // credential: admin.credential.applicationDefault(),

      // If using a service account key file (less recommended for Cloud Run/Functions):
      // credential: admin.credential.cert(require('/path/to/your/serviceAccountKey.json')),

      // For IDX/Cloud Workstations or environments where ADC is configured,
      // often no explicit credential setup is needed here. Firebase Admin SDK
      // automatically detects the credentials.

      // Optionally, specify the database URL if needed, though often inferred.
      // databaseURL: "https://<YOUR_PROJECT_ID>.firebaseio.com",
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.stack);
    // Decide how to handle initialization failure - maybe throw an error
    // or log and proceed cautiously depending on your app's needs.
     throw new Error("Could not initialize Firebase Admin SDK.");
  }
} else {
    // console.log('Firebase Admin SDK already initialized.');
}


export const auth = admin.auth();
export const firestore = admin.firestore();
// export const storage = admin.storage(); // Uncomment if you need storage
```