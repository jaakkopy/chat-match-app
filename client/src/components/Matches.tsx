import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import UserProfile from '../models/User';
import { Avatar, Box } from '@mui/material';

const Matches = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [matchedUsers, setMatchedUsers] = useState<{profile: UserProfile, latestMessage: string}[]>([]);
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
        navigate("/chat",  { state: { profile: matchedUsers.find(u => u.profile.email === email)?.profile } });
    }

    return (
        <div>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {
                    matchedUsers?.map(m => {
                        return (
                            <Box display={"flex"} flexDirection={"row"} key={m.profile.email}>
                                <Avatar>{m.profile.fullname.split(" ").map(part => part[0]).join("")}</Avatar>
                                <ListItem onClick={() => onUserclicked(m.profile.email)} key={m.profile.email}>
                                    <ListItemText
                                      primary={m.profile.fullname}
                                      secondary={
                                        <>
                                          {m.latestMessage}
                                        </>
                                      }
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </Box>
                        )
                    })
                }
            </List>
        </div>
    );
}


export default Matches;