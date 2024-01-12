import { useState, useEffect } from 'react';
import { useAuth, AuthContextValues } from './AuthProvider';
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
    const auth: AuthContextValues | null = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // if the user is already logged in, navigate back to the home page
    useEffect(() => {
        if (auth != null && auth.isLoggedIn())
            navigate("/");
    }, []);

    if (auth == null)
        return null;    

    const handleLogin = async () => {
        const possibleError: null | string = await auth.onLogin(email, password);
        setError(possibleError);
        // If OK, redirect to home
        if (error === null) {
            navigate("/");
        }
    }

    return (
        <div>
            <form>
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>

                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

                <input type="submit" onClick={(e) => {e.preventDefault(); handleLogin();}}/>
            </form>
            {error !== null ? <p>Error: {error}</p> : <></>}
        </div>
    );
}


export default LoginPage;
