import { useState } from 'react';

interface CredentialsFormCallback {
    callback: (email: string, password: string) => Promise<void>;
}

const CredentialsForm = ({callback}: CredentialsFormCallback) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    return (
        <form>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>

            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

            <input type="submit" onClick={(e) => {e.preventDefault(); callback(email, password);}}/>
        </form>
    );
}


export default CredentialsForm;
