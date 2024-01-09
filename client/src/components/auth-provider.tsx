import React, { useState } from 'react';

// This component is copied from: https://www.robinwieruch.de/react-router-authentication/

interface AuthContextValues {
    token: string | null;
    onLogin: () => Promise<void>;
    onLogout: () => void;
}

const AuthContext = React.createContext<AuthContextValues | null>(null);

export const AuthProvider = ({ children }: any) => {
    const [token, setToken] = useState<string | null>(null);

    const login = async () => {
        // TODO:
        //const jwt = await ... 
        //setToken(jwt);
    };

    const logout = () => {
        setToken(null);
    };

    const value: AuthContextValues = {
        token,
        onLogin: login,
        onLogout: logout,
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
