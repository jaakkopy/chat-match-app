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
    const [message, setMessage] = useState<string>('');
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
        // TODO: Fix the proxy
        "ws://localhost:8000", {
            share: false,
            shouldReconnect: () => true,
        },
    );

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
