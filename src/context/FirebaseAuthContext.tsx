/*
    FirebaseAuthContext
        Firebaseの認証状態
*/
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { onAuthStateChanged, type User } from "firebase/auth";

import { auth } from "../firebase";


interface FirebaseAuthContextType {
    user: User | null;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined);

export const FirebaseAuthProvider = ({ children }: { children: ReactNode }) => {
    const [ user, setUser ] = useState<User | null>(null);

    useEffect(() => {
        //    FirebaseAuth監視
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setUser(null);
            } else {
                setUser(user);
            }
       });
       return () => unsubscribe();
    }, []);

    return (
        <FirebaseAuthContext.Provider value={{ user }}>
            {children}
        </FirebaseAuthContext.Provider>        
    );
};

// 3. 呼び出し用フック
export const useFirebaseAuthContext = () => {
    const context = useContext(FirebaseAuthContext);
    if (context === undefined) {
        throw new Error("useFirebaseAuthContext must be used within a FirebaseAuthProvider");
    }
    return context;
};