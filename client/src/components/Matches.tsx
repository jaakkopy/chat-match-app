import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import UserProfile from '../models/User';
import { Alert, Avatar, Box, Pagination } from '@mui/material';
import { useFetch } from './useFetch';

const Matches = () => {
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const auth = useAuth();
    const fetchHelp = useFetch();
    const navigate = useNavigate();
    const [pagesOfUsers, setPagesOfUsers] = useState<{ profile: UserProfile, latestMessage: string }[][]>([[]]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const f = async () => {
            if (mounted && auth !== null) {
                const res = await fetchHelp.get(`${process.env.REACT_APP_SERVER_BASE_URL}/api/likes/matches`);
                if (res.status != 200) {
                    const reason = await res.text();
                    setError(reason);
                } else {
                    setError(null);
                    const { matches } = await res.json();
                    // Divide the entries into pages of 10 per page.
                    // If the amount is not divisible by 10, leftovers will be inserted to the last page
                    let userPages = [];
                    let amountPages = Math.floor(matches.length / 10);
                    for (let row = 0; row < amountPages; ++row) {
                        let userPage = [];
                        for (let col = 0; col < 10; ++col) {
                            userPage.push(matches[10 * row + col]);
                        }
                        userPages.push(userPage);
                    }
                    let lastUserPage = [];
                    for (let col = 0; col < matches.length % 10; ++col) {
                        lastUserPage.push(matches[amountPages * 10 + col]);
                    }
                    if (lastUserPage.length != 0) {
                        amountPages += 1;
                        userPages.push(lastUserPage);
                    }
                    setPagesOfUsers(userPages);
                    setLastPage(amountPages);
                }
            }
        }
        f();
        return () => { mounted = false };
    }, []);


    if (error !== null) {
        return <Alert severity='error'>Error: {error}</Alert>;
    }

    const onUserclicked = (email: string) => {
        // navigate to the chat page for the selected user
        navigate("/chat", { state: { profile: pagesOfUsers[page - 1].find(u => u.profile.email === email)?.profile } });
    }

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <div>
            {pagesOfUsers.length > 0 ? <div>
                {lastPage != 1 ? <Pagination count={lastPage} page={page} onChange={handleChange} siblingCount={0} /> : null}
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {
                        pagesOfUsers[page - 1].map(m => {
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
            </div> : <Alert severity="info">No matches yet. You can browse other users to find a match!</Alert>}

        </div>
    );
}


export default Matches;