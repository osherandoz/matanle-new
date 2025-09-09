import React, { createContext, useContext } from "react";
import { db, auth } from './firebase-config';

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
    return (
        <FirebaseContext.Provider value={{ db, auth }}>
            {children}
        </FirebaseContext.Provider>
    );
};

export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
};
