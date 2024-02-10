import useWebSocket, { ReadyState } from "react-use-websocket";

import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import UserProfile from '../models/User';
import { OldChatMessage } from "../models/Chat";
import { Avatar, Box, Paper, Typography } from "@mui/material";
import { useFetch } from "./useFetch";
import { getServerAddr, getWsServerAddr } from "./server_addr";


const Chat = () => {
    const auth = useAuth();
    const fetchHelp = useFetch();
    const { state } = useLocation();
    const navigate = useNavigate();
    const profile: UserProfile = state.profile; // Read values passed on state
    const [messageHistory, setMessageHistory] = useState<OldChatMessage[]>([]);
    const [message, setMessage] = useState<string>('');
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
        getWsServerAddr(), {
        share: false,
        shouldReconnect: () => true,
    },
    );

    // Verify that the users have liked each other. Otherwise redirect to profile page
    useEffect(() => {
        let f = async () => {
            const res = await fetchHelp.get(`${getServerAddr()}/api/likes/ismatch/${profile.email}`);
            if (res.status == 200) {
                const js = await res.json();
                // Not a match. The user won't be able to chat with the other user, so just navigate away
                if (!js.isMatch) {
                    navigate("/");
                }
            }
        };
        f();
    }, []);

    // Fetch the message history between the two users
    useEffect(() => {
        let mounted = true;
        const f = async () => {
            if (mounted && auth !== null) {
                const res = await fetchHelp.get(`${getServerAddr()}/api/chat/history/${profile.email}`);
                if (res.status == 200) {
                    const { history } = await res.json();
                    setMessageHistory(history);
                }
            }
        }
        f();
        return () => { mounted = false; }
    }, []);

    // An effect reacting to the change of state of the websocket
    useEffect(() => {
        if (readyState === ReadyState.OPEN && auth !== null) {
            // The connection has opened. Send the first message to authenticate for the websocket connection
            sendJsonMessage({
                jwt: auth.token,
                receiverEmail: profile.email
            });
        }
    }, [readyState]);

    // Return a formatted date. If d is not undefined, its time will be used. If d is undefined, a new date will be created.
    const formatDate = (d?: Date | string): string => {
        if (!d) {
            d = new Date();
        } else if (typeof d == "string" || d instanceof String) {
            d = new Date(d);
        }
        return d.toLocaleString();
    }

    // An effect reacting to the change of the latest websocket message
    useEffect(() => {
        if (lastJsonMessage) {
            // A new message has been written to the websocket by the server. Add it to the history.
            // @ts-ignore
            const msg = lastJsonMessage.content;
            setMessageHistory(messageHistory.concat({ senderEmail: profile.email, content: msg, dateSent: formatDate() }));
        }
    }, [lastJsonMessage]);

    // For writing a message to the websocket
    const sendMessage = () => {
        if (readyState === ReadyState.OPEN && auth !== null) {
            sendJsonMessage({
                senderEmail: auth.userEmail,
                content: message
            });
            setMessageHistory(messageHistory.concat({ senderEmail: auth.userEmail!, content: message, dateSent: formatDate() }));
        }
    }

    // The following code is mostly copied from here: https://frontendshape.com/post/create-a-chat-ui-in-react-with-mui-5 
    return (
        <Box sx={{ height: "90vh", display: "flex", flexDirection: "column" }}>
            <Box display={"flex"} flexDirection={"row"}>
                <Avatar>{profile.fullname.split(" ").map(part => part[0]).join("")}</Avatar>
                <Typography variant={"h4"}>{profile.fullname}</Typography>
            </Box>
            <Divider />
            <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
                {messageHistory.map(m => {
                    return (
                        <Box key={m.dateSent}
                            sx={{
                                display: "flex",
                                justifyContent: m.senderEmail == profile.email ? "flex-start" : "flex-end",
                                mb: 2,
                            }}
                        >
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 1,
                                }}
                            >
                                <ListItemText primary={m.content} secondary={formatDate(m.dateSent)}></ListItemText>
                            </Paper>
                        </Box>
                    );
                })}
            </Box>
            <Divider />
            <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Grid container spacing={2}>
                    <Grid item xs={10}>
                        <TextField
                            fullWidth
                            placeholder="Type a message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            fullWidth
                            size="large"
                            color="primary"
                            variant="contained"
                            onClick={sendMessage}
                        >
                            Send
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}


export default Chat;
