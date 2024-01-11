import { useLocation } from 'react-router-dom';

const Chat = () => {
    const { state } = useLocation();
    const { receiverEmail } = state; // Read values passed on state
    

    return (
        <div>
            { receiverEmail }
        </div>
    );
}


export default Chat;
