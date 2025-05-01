
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore'; // Specific import for FieldValue

// Ensure Firebase Admin is initialized only once
if (!admin.apps.length) {
  try {
    console.log('Attempting to initialize Firebase Admin SDK...');
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

      // Optionally, specify project ID if ADC isn't picking it up (usually not needed)
      // projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, // Use a server-side env var if needed
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error); // Log the full error object
    console.error('Stack trace:', error.stack); // Log the stack trace for more details
    // Re-throw a more informative error, guiding towards credential checks
    throw new Error(`Could not initialize Firebase Admin SDK. Original error: ${error.message}. Check server logs for full stack trace and ensure Application Default Credentials (ADC) are configured correctly or a valid service account is available in the environment.`);
  }
} else {
    // console.log('Firebase Admin SDK already initialized.');
}


export const auth = admin.auth();
export const firestore = admin.firestore();
export { FieldValue }; // Re-export FieldValue
// export const storage = admin.storage(); // Uncomment if you need storage

