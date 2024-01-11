import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import useWebSocket, { ReadyState } from "react-use-websocket";

import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';


const Chat = () => {
    const auth = useAuth();
    const { state } = useLocation();
    const { receiverEmail } = state; // Read values passed on state
    const [messageHistory, setMessageHistory] = useState<string[]>([]);
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
                    `/api/chat/history/${receiverEmail}/${batch}`,{
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    }
                );
                if (res.status == 200) {
                    const { history } = await res.json();
                    setMessageHistory(history);
                    console.log(messageHistory);
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
                receiverEmail
            });
        }
    }, [readyState]);

    useEffect(() => {
        if (lastJsonMessage) {
            // @ts-ignore
            console.log(`GOT MESSAGE: ${lastJsonMessage.content}`);
        }
    }, [lastJsonMessage]);

    const sendMessage = () => {
        if (readyState === ReadyState.OPEN && auth !== null) {
            sendJsonMessage({
                senderEmail: auth.userEmail,
                content: message
            });
        }
    }

    return (
        <div>
            { receiverEmail }
            <TextField label="Type a message" variant="outlined" value={message} onChange={(e) => setMessage(e.target.value)} />
            <Button color="inherit" onClick={sendMessage}>{"Send"}</Button>
        </div>
    );
}


export default Chat;
