import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';

const Matches = () => {
    const auth = useAuth();
    // TODO: specify type
    const [matchedUsers, setMatchedUsers] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        let mounted = true;
        const f = async () => {
            if (mounted && auth !== null) {
                const res = await fetch(
                    "/api/likes/matches", {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    }
                );
                if (res.status != 200) {
                    const reason = await res.text();
                    setError(reason);
                    setMatchedUsers(null);
                } else {
                    setError(null);
                    const {matches} = await res.json();
                    setMatchedUsers(matches);
                }
            }
        }
        f();
        return () => {mounted = false};
    }, []);


    if (error !== null) {
        return (
            <div>
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div>
            <ul>
                {matchedUsers?.map(m => <li key={m}>{m}</li>)}
            </ul>
        </div>
    );
}


export default Matches;
