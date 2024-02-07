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

const AuthContext = React.createContext<AuthContextValues | null>(null);

export const AuthProvider = ({ children }: any) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem("email"));

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


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return React.useContext(AuthContext);
};
