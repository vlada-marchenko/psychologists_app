import React, { useContext, useEffect, useState, createContext } from 'react'
import { auth } from '../firebase/firebase'
import { type User, onAuthStateChanged, signOut } from 'firebase/auth'

interface AuthContextProps {
    user: User | null;
    loading: boolean;
    isLoggedIn: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser)
        return unsubscribe
    }, [])

    async function initializeUser(firebaseUser: User | null) {
        setLoading(true)
        if (firebaseUser) {
            setUser(firebaseUser)
            setIsLoggedIn(true)
        } else {
            setUser(null)
            setIsLoggedIn(false)
        }
        setLoading(false)
    }

    async function logout() {
        await signOut(auth)
        setUser(null)
        setIsLoggedIn(false)
    }

    const value: AuthContextProps = {
        user,
        isLoggedIn,
        loading,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}