import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

try {
    const serviceAccount: ServiceAccount = require('./adminsdk.json'); // Path to the Firebase Admin SDK private key
    console.log(serviceAccount);

    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (error) {
        console.error('Error initializing Firebase Admin SDK:', error);
    }
} catch (error) {
    console.error(error);
}

export const firebaseAdmin = admin;