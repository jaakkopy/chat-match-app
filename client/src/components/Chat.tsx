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
                    `/api/chat/history/${profile.email}/${batch}`,{
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
        return () => {mounted = false;}
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
        console.log(d);
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
            setMessageHistory(messageHistory.concat({senderEmail: profile.email, content: msg, dateSent: formatDate()}));
        }
    }, [lastJsonMessage]);

    const sendMessage = () => {
        if (readyState === ReadyState.OPEN && auth !== null) {
            sendJsonMessage({
                senderEmail: auth.userEmail,
                content: message
            });
            setMessageHistory(messageHistory.concat({senderEmail: auth.userEmail!, content: message, dateSent: formatDate()}));
        }
    }

    return (
        <div>
            { profile.fullname }
            { /* Message history list */}
            <List>
                {messageHistory.map(m => {
                    return (
                        <ListItem key={m.dateSent}>
                            <ListItemText primary={m.content} secondary={formatDate(m.dateSent)}></ListItemText>
                        </ListItem>
                    );
                })}
            </List>

            <Divider />

            { /* New message input */} 
            <Grid>
                <TextField label="Type a message" variant="outlined" value={message} onChange={(e) => setMessage(e.target.value)} />
                <Button color="inherit" onClick={sendMessage}>{"Send"}</Button>
            </Grid>
        </div>
    );
}


export default Chat;
