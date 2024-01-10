import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth, AuthContextValues } from './AuthProvider';
import CredentialsForm from './CredentialsForm';


const RegisterPage = () => {
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
    
    const handleRegister = async (email: string, password: string) => {
        const possibleError: null | string = await auth.onRegister(email, password);
        if (possibleError == null) {
            navigate("/login");
        }
        setError(possibleError);
    }

    return (
        <div>
            <CredentialsForm callback={handleRegister} />
            {error !== null ? <p>Error: {error}</p> : <></>}
        </div>
    );
}


export default RegisterPage;
