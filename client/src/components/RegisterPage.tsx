import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth, AuthContextValues } from './AuthProvider';


const RegisterPage = () => {
    const auth: AuthContextValues | null = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [fullname, setFullname] = useState<string>('');
    const [birthdate, setBirthdate] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // if the user is already logged in, navigate back to the home page
    useEffect(() => {
        if (auth != null && auth.isLoggedIn())
            navigate("/");
    }, []);

    if (auth == null)
        return null;
    
    const handleRegister = async () => {
        const possibleError: null | string = await auth.onRegister(
            email,
            password,
            fullname,
            birthdate
        );
        if (possibleError == null) {
            navigate("/login");
        }
        setError(possibleError);
    }

    let eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    const dateStr = `${eighteenYearsAgo.getFullYear()}-${("0" + (eighteenYearsAgo.getMonth() + 1)).slice(-2)}-${ ("0" + eighteenYearsAgo.getDay()).slice(-2) }`;
    return (
        <div>
            <form>
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>

                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

                <label>Full name</label>
                <input value={fullname} onChange={(e) => setFullname(e.target.value)}/>

                <label>Birthdate</label>
                <input type="date" max={dateStr} value={birthdate} onChange={(e) => setBirthdate(e.target.value)}/>

                <input type="submit" onClick={(e) => {e.preventDefault(); handleRegister();}}/>
            </form>
            {error !== null ? <p>Error: {error}</p> : <></>}
        </div>
    );
}


export default RegisterPage;
