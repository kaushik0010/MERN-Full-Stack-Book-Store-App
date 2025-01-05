import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";

const AuthContext = createContext();
export const useAuth = () => {
    return useContext(AuthContext)
}

const googleProvider = new GoogleAuthProvider();

// authProvider
export const AuthProvider = ({children}) => {
    const [currentUser, SetCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // register a user
    const registerUser = async (email, password) => {
        return await createUserWithEmailAndPassword(auth, email, password)
    }

    // login user
    const loginUser = async (email, password) => {
        return await signInWithEmailAndPassword(auth, email, password)
    }

    // sign-in with google
    const signInWithGoogle = async () => {
        return await signInWithPopup(auth, googleProvider)
    }

    // logout users
    const logout = () => {
        return signOut(auth)
    }

    // manage user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            SetCurrentUser(user)
            setLoading(false);

            if (user) {
                const {email, displayName, photoURL} = user;
                const userData = {
                    email, username: displayName, phto: photoURL
                }
            }
        })

        return () => unsubscribe();
    }, [])

    const value = {
        currentUser,
        loading,
        registerUser,
        loginUser,
        signInWithGoogle,
        logout
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}