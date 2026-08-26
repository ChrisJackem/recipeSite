
import type { ReactNode } from 'react';
import FirebaseService from './firebaseService';
import FirebaseContext from './firebaseContext';

const FirebaseProvider = ({ children }:{children:ReactNode}) => {
    const firebaseService = new FirebaseService()
    return (
        <FirebaseContext.Provider value={{ firebaseService }}>
            { children }
        </FirebaseContext.Provider>
    )
}

export default FirebaseProvider;