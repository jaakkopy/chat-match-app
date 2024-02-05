import { useState, useEffect } from 'react';
import { useAuth, AuthContextValues } from './AuthProvider';
import { useNavigate } from "react-router-dom";
import { Alert, Button, InputLabel, TextField } from '@mui/material';


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
        if (possibleError === null) {
            navigate("/");
        }
    }

    return (
        <div>
            <InputLabel>Email</InputLabel>
            <TextField margin="normal" fullWidth required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <InputLabel>Password</InputLabel>
            <TextField margin="normal" fullWidth required id="passwordInput" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button variant="outlined" type="submit" onClick={(e) => {e.preventDefault(); handleLogin();}}>Login</Button>
            {error !== null ? <Alert severity="warning">Error: {error}</Alert> : null}
        </div>
    );
}


export default LoginPage;
