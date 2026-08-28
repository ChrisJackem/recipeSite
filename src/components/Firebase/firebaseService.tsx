import { initializeApp } from "firebase/app";
import { FirebaseError } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { USER_CREATED_SUCCESS, USER_NOT_VERIFIED, USER_SIGN_IN_SUCCESS } from "../../_constants/strings";

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

  private getAuthErrorMessage = (error: unknown): string => {
    if (error instanceof FirebaseError) {
      const messages: Record<string, string> = {
        "auth/email-already-in-use": "This email address is already in use.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/weak-password": "The password is too weak.",
        "auth/missing-password": "Please enter a password.",
        "auth/network-request-failed": "A network error occurred. Please try again.",        
        "auth/user-not-found": "No account found with this email address.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/invalid-credential": "Invalid email or password.",
        "auth/user-disabled": "This account has been disabled.",
        "auth/too-many-requests": "Too many attempts. Please try again later."
      };
      return messages[error.code] ?? error.message;
    }
    return error instanceof Error ? error.message : "An unexpected error occurred.";
  };

  doSignOut = async ()=>{
    try{
      if (this.auth.currentUser){
        await signOut(this.auth);
        console.log(this.auth.currentUser, 'Signed Out');
      }
    } catch (error) {
      console.error(this.getAuthErrorMessage(error));
    }    
  };
  
  doCreateUserWithEmailAndPassword = async ( name: string, email: string, password: string ): Promise<string> => {
    try {
      const userCredential = await createUserWithEmailAndPassword( this.auth, email, password );
      await updateProfile(userCredential.user, { displayName: name });
      await sendEmailVerification(userCredential.user);
      await signOut(this.auth);
      //console.log(userCredential)
      return Promise.resolve(USER_CREATED_SUCCESS);
    } catch (error) {
      return Promise.reject(this.getAuthErrorMessage(error));
    }
  };

  doSignInWithEmailAndPassword = async ( email: string, password:string ): Promise<string> => {
    try{
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log(userCredential);

      // Check verification before saving to db
      if (!userCredential.user.emailVerified){
        await signOut(this.auth);
        console.log(userCredential);
        throw new Error(USER_NOT_VERIFIED);
      }

      // Add user to database
      const user = userCredential.user;
      const db = getFirestore(this.app);
      await setDoc(doc(db, "users", user.uid), {
        email,
        displayName: user.displayName,
        provider: user.providerId,
        createdAt: user.metadata.creationTime,
        lastLoginAt: user.metadata.lastSignInTime,
      });

      return Promise.resolve(USER_SIGN_IN_SUCCESS);
    }catch(error){
      return Promise.reject(this.getAuthErrorMessage(error));
    }
  }

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

