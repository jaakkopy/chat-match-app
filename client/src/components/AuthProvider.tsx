import React, { useState } from 'react';

// This component, and other parts of the authentication/authorization code were inspired by:
// https://www.robinwieruch.de/react-router-authentication/
// Some modifications were made.

export interface AuthContextValues {
    token: string | null;
    userEmail: string | null;
    onLogin: (email: string, password: string) => Promise<string | null>;
    onRegister: (email: string, password: string, fullname: string, birthdate: string) => Promise<string | null>;
    onLogout: () => void;
    isLoggedIn: () => boolean;
}

const AuthContext = React.createContext<AuthContextValues | null>(null);

export const AuthProvider = ({ children }: any) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem("email"));

    const login = async (email: string, password: string) => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, password
            })
        });
        if (res.status == 200) {
            const { token } = await res.json();
            localStorage.setItem("token", token);
            setToken(token);
            localStorage.setItem("email", email);
            setUserEmail(email);
            return null;
        }
        const failureMessage = await res.text();
        return failureMessage;
    };

    const register = async (
        email: string,
        password: string,
        fullname: string,
        birthdate: string) => {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, password, fullname, birthdate
            })
        });
        if (res.status == 200) {
            return null;
        }
        const failureMessage = await res.text();
        return failureMessage;
    }

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        localStorage.removeItem("email");
        setUserEmail(null);
    }
    // note: the token could be invalid, or outdated
    const isLoggedIn = () => token != null;

    const value: AuthContextValues = {
        token,
        userEmail,
        onLogin: login,
        onRegister: register,
        onLogout: logout,
        isLoggedIn
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return React.useContext(AuthContext);
};
