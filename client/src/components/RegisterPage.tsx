import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth, AuthContextValues } from './AuthProvider';
import { Alert, Button, TextField } from '@mui/material';

interface RegistrationError {
    type: string;
    value: string;
    msg: string;
    path: string;
    location: string;
}

const RegisterPage = () => {
    const auth: AuthContextValues | null = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [fullname, setFullname] = useState<string>('');
    const [birthdate, setBirthdate] = useState<string>('');
    const [errors, setErrors] = useState<RegistrationError[] | null>(null);
    const navigate = useNavigate();

    // if the user is already logged in, navigate back to the home page
    useEffect(() => {
        if (auth != null && auth.isLoggedIn())
            navigate("/");
    }, []);

    if (auth == null)
        return null;
    
    const handleRegister = async () => {
        const possibleErrors: null | RegistrationError[] = await auth.onRegister(
            email,
            password,
            fullname,
            birthdate
        );
        if (possibleErrors == null) {
            navigate("/login");
        }
        setErrors(possibleErrors);
    }

    return (
        <div>
            <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <TextField fullWidth label="Full name" value={fullname} onChange={(e) => setFullname(e.target.value)}/>
            <TextField fullWidth label="Date of birth" type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)}/>
            <Button variant="outlined" type="submit" onClick={(e) => {e.preventDefault(); handleRegister();}}>Register</Button>
            {errors !== null ? errors.map(e => <Alert severity="warning">{e.path}: {e.msg}</Alert>) : null}
        </div>
    );
}


export default RegisterPage;
