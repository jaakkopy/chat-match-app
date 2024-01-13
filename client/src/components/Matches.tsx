import { Fragment } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import UserProfile from '../models/User';

const Matches = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [matchedUsers, setMatchedUsers] = useState<UserProfile[]>([]);
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

    const onUserclicked = (email: string) => {
        // navigate to the chat page for the selected user
        navigate("/chat",  { state: { profile: matchedUsers.find(u => u.email === email) } });
    }

    return (
        <div>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {
                    matchedUsers?.map(m => {
                        return (
                            <Fragment key={m.email}>
                                <ListItem onClick={() => onUserclicked(m.email)} key={m.email}>
                                    <ListItemText
                                      primary={m.fullname}
                                      secondary={
                                        <>
                                          {" — TODO: add the latest message of the chat here"}
                                        </>
                                      }
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </Fragment>
                        )
                    })
                }
            </List>
        </div>
    );
}


export default Matches;