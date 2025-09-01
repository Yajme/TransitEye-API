// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import dotenv from 'dotenv';
import { Firestore,doc,setDoc,collection,getDocs, getFirestore, query,where, orderBy, limitToLast, AggregateField,sum,getAggregateFromServer, count, updateDoc, DocumentReference,getDoc, documentId, GeoPoint, Timestamp,deleteDoc} from "firebase/firestore";


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

const initializeFirebase = ()=>{
    try{
        app = initializeApp(firebaseConfig);
        firestoreDb = getFirestore(app);
        console.log('Connected to firebase');
        return app;
    }catch(err){
        console.log(`${err}`);
    }
}

const getFirebaseApp = () => app;
export default {
    initializeFirebase,
    getFirebaseApp
};