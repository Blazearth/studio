
import * as admin from 'firebase-admin';

// Ensure Firebase Admin is initialized only once
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      // If running locally with Application Default Credentials (ADC) set up (gcloud auth application-default login),
      // or in a managed environment like Cloud Run/Functions/Workstations where the service account has permissions,
      // use applicationDefault().
      credential: admin.credential.applicationDefault(),

      // If using a service account key file via environment variable (less common for managed envs):
      // Ensure GOOGLE_APPLICATION_CREDENTIALS env var is set to the path of your key file.
      // If GOOGLE_APPLICATION_CREDENTIALS is set, initializeApp() might pick it up automatically
      // without needing the credential line above.

      // Optionally, specify the database URL if needed, though often inferred.
      // databaseURL: "https://<YOUR_PROJECT_ID>.firebaseio.com",
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.stack);
    // Decide how to handle initialization failure - maybe throw an error
    // or log and proceed cautiously depending on your app's needs.
     throw new Error(`Could not initialize Firebase Admin SDK. Error: ${error.message}`); // Include original error message
  }
} else {
    // console.log('Firebase Admin SDK already initialized.');
}


export const auth = admin.auth();
export const firestore = admin.firestore();
// export const storage = admin.storage(); // Uncomment if you need storage
