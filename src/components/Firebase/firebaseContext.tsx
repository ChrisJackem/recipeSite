import { createContext } from "react";
import FirebaseService from "./firebaseService";

export interface firebaseContextType  { firebaseService: FirebaseService; }

const FirebaseContext = createContext<firebaseContextType | undefined>(undefined);

export default FirebaseContext