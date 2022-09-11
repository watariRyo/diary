// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { userId } from "../store";
import { getStorage } from 'firebase/storage'
import Cookies from "js-cookie";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();

const auth = getAuth();
export const signInWithGoogle = () =>
{
    signInWithPopup(auth, provider)
        .then((result) =>
        {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            userId.set(user.uid);
            Cookies.set('uid', user.uid)
            document.location.reload();
            // ...
        }).catch((error) =>
        {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
}

export const signOutWithGoogle = () =>
{
    signOut(auth).then(() =>
    {
        // Sign-out successful.
        Cookies.remove('uid')
        document.location.reload();
    }).catch((error) =>
    {
        // An error happened.
        const errorCode = error.code;
        const errorMessage = error.message;
        alert('ログアウトできませんでした。通信環境の良い場所で再度実行してください')
    });

}
