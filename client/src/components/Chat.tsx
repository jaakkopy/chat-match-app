import useWebSocket, { ReadyState } from "react-use-websocket";

import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import UserProfile from '../models/User';
import { OldChatMessage } from "../models/Chat";
import { Avatar, Box, Paper, Typography } from "@mui/material";


const Chat = () => {
    const auth = useAuth();
    const { state } = useLocation();
    const profile: UserProfile = state.profile; // Read values passed on state
    const [messageHistory, setMessageHistory] = useState<OldChatMessage[]>([]);
    const [batch, setBatch] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
        // TODO: Add the proxy
        "ws://localhost:8000", {
        share: false,
        shouldReconnect: () => true,
    },
    );

    useEffect(() => {
        let mounted = true;
        const f = async () => {
            if (mounted && auth !== null) {
                const res = await fetch(
                    `/api/chat/history/${profile.email}/${batch}`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                }
                );
                if (res.status == 200) {
                    const { history } = await res.json();
                    setMessageHistory(history);
                }
            }
        }
        f();
        return () => { mounted = false; }
    }, []);

    useEffect(() => {
        if (readyState === ReadyState.OPEN && auth !== null) {
            console.log("Connection open. Sending first message");
            sendJsonMessage({
                jwt: auth.token,
                receiverEmail: profile.email
            });
        }
    }, [readyState]);


    const formatDate = (d?: Date | string): string => {
        if (!d) {
            d = new Date();
        } else if (typeof d == "string" || d instanceof String) {
            d = new Date(d);
        }
        return d.toLocaleString();
    }

    useEffect(() => {
        if (lastJsonMessage) {
            // @ts-ignore
            const msg = lastJsonMessage.content;
            setMessageHistory(messageHistory.concat({ senderEmail: profile.email, content: msg, dateSent: formatDate() }));
        }
    }, [lastJsonMessage]);

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
            <Divider/>
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
            <Divider/>
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
