// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import dotenv from 'dotenv';
import { Firestore,doc,setDoc,collection,getDocs, getFirestore, query,where, orderBy, limitToLast, AggregateField,sum,getAggregateFromServer, count, updateDoc, DocumentReference,getDoc, documentId, GeoPoint, Timestamp,deleteDoc} from "firebase/firestore";
import { log } from "#src/utils/logger";

dotenv.config();


const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};


// Initialize Firebase

let app;
export let firestoreDb;


//Create here 

const initializeFirebase = async () => {
    try {
        // Check if environment variables are set
        const requiredEnvVars = [
            'FIREBASE_API_KEY',
            'FIREBASE_AUTH_DOMAIN',
            'FIREBASE_PROJECT_ID',
            'FIREBASE_STORAGE_BUCKET',
            'FIREBASE_MESSAGING_SENDER_ID',
            'FIREBASE_APP_ID'
        ];

        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
        if (missingVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }

        // Initialize Firebase
        app = initializeApp(firebaseConfig);
        firestoreDb = getFirestore(app);

        // Test Firestore connection with a write and read operation
        const testCollectionName = 'connection-test';
        const testDoc = doc(firestoreDb, testCollectionName, 'test-doc');
        
        // Try to write
        await setDoc(testDoc, {
            timestamp: Timestamp.now(),
            test: 'connection-test'
        });

        // Try to read
        const docSnap = await getDoc(testDoc);
        if (!docSnap.exists()) {
            throw new Error('Test document was not created successfully');
        }

        // Clean up test document
        //await deleteDoc(testDoc);

        log('Firebase initialized and connection verified successfully');
        return app;
    } catch (err) {
        console.error('❌ Firebase initialization failed:', err.message);
        throw err; // Re-throw to handle it in the calling code
    }
}

const getFirebaseApp = () => app;
export default {
    initializeFirebase,
    getFirebaseApp
};