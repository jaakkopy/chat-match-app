import React, { useState } from 'react';
import { getServerAddr } from './server_addr';
import ValidationError from './validation-error';

// This component, and other parts of the authentication/authorization code were inspired by:
// https://www.robinwieruch.de/react-router-authentication/
// Modifications were made.

export interface AuthContextValues {
    token: string | null;
    userEmail: string | null;
    onLogin: (email: string, password: string) => Promise<ValidationError[] | null>;
    onRegister: (email: string, password: string, fullname: string, birthdate: string) => Promise<ValidationError[] | null>;
    onLogout: () => void;
    isLoggedIn: () => boolean;
}

// Responsible for handling the authentication state
const AuthContext = React.createContext<AuthContextValues | null>(null);

export const AuthProvider = ({ children }: any) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem("email"));

    // Attempt to login the user with the given credentials
    // Returns null if no errors occured, otherwise returns an array of errors
    const login = async (email: string, password: string) => {
        const res = await fetch(`${getServerAddr()}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, password
            })
        });
        if (res.status == 200) {
            // Login OK; store the token and email in local storage
            const { token } = await res.json();
            localStorage.setItem("token", token);
            setToken(token);
            localStorage.setItem("email", email);
            setUserEmail(email);
            return null;
        }
        const errs = await res.json();
        return errs.errors;
    };

    // Attempt to register the user with the given information.
    // Returns null if no errors occured, otherwise returns an array of errors
    const register = async (
        email: string,
        password: string,
        fullname: string,
        birthdate: string): Promise<ValidationError[] | null> => {
        const res = await fetch(`${getServerAddr()}/api/auth/register`, {
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
        const errs = await res.json();
        return errs.errors;
    }

    // Logout by removing the entries in the local storage and clearing the state
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        localStorage.removeItem("email");
        setUserEmail(null);
    }

    const isLoggedIn = () => token != null;

    const value: AuthContextValues = {
        token,
        userEmail,
        onLogin: login,
        onRegister: register,
        onLogout: logout,
        isLoggedIn
    };

    // The component works as a wrapper providing the context to all of its child components
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return React.useContext(AuthContext);
};
