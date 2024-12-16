// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "tichhopguitinnhan.firebaseapp.com",
    projectId: "tichhopguitinnhan",
    storageBucket: "tichhopguitinnhan.appspot.com",
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: "1:439013930682:web:93bd749268f8cb19b4b483",
    measurementId: "G-B24ZTWCBW1"
};

export const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);


async function requestPermission() {

    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {

            getToken(messaging, {
                vapidKey: process.env.REACT_APP_VAPID_KEY
            }).then((currentToken) => {
                if (currentToken) {
                    console.log("currentToken:", currentToken);
                } else {
                    console.log("Can not get token");
                }
            });

        } else {
            console.log("Do not have permission!");
        }
    });
}

requestPermission();