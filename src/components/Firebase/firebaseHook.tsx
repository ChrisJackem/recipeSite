import { useContext } from "react"
import FirebaseContext from "./firebaseContext"

export const useFirebaseService = ()=>{
    const context = useContext( FirebaseContext );
    if (!context){
        throw new Error("useFirebaseService must be used inside provider");
    }
    return context.firebaseService;
}