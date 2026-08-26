import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const config = {
  apiKey: import.meta.env.VITE_APP_API_KEY,
  authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_APP_DATABASE_URL,
  projectId: import.meta.env.VITE_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
};

export default class FirebaseService {
  app; auth;

  constructor() {
    this.app = initializeApp(config);
    this.auth = getAuth();
  }
  
  doCreateUserWithEmailAndPassword = (email:string, password:string) =>
    createUserWithEmailAndPassword(this.auth, email, password)
      

  /* doSignInWithEmailAndPassword = (email:string, password:string) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email: string) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password:string) =>{
    if (!this.auth.currentUser){
      throw new Error("User not signed in")
    }else{
      return this.auth.currentUser.updatePassword(password);
    } 
  }*/
}


