import { useState, useEffect } from 'react';
import { useAuth, AuthContextValues } from './AuthProvider';
import { useNavigate } from "react-router-dom";
import CredentialsForm from './CredentialsForm';


const LoginPage = () => {
    const auth: AuthContextValues | null = useAuth();
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // if the user is already logged in, navigate back to the home page
    useEffect(() => {
        if (auth != null && auth.isLoggedIn())
            navigate("/");
    }, []);

    if (auth == null)
        return null;    

    const handleLogin = async (email: string, password: string) => {
        const possibleError: null | string = await auth.onLogin(email, password);
        setError(possibleError);
        // If OK, redirect to home
        if (error === null) {
            navigate("/");
        }
    }

    return (
        <div>
            <CredentialsForm callback={handleLogin} />
            {error !== null ? <p>Error: {error}</p> : <></>}
        </div>
    );
}


export default LoginPage;
