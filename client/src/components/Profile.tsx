import { useEffect, useState } from "react";
import { Avatar, Typography, Card, CardHeader, CardContent, TextField, Button, Modal, Box } from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import EditIcon from '@mui/icons-material/Edit';

import UserProfile from "../models/User";
import { useAuth } from "./AuthProvider";
import { useFetch } from "./useFetch";
import { getServerAddr } from "./server_addr";

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const Profile = () => {
    const auth = useAuth();
    const fetchHelp = useFetch();
    const [profile, setProfile] = useState<UserProfile>();
    const [profileText, setProfileText] = useState<string>(profile?.profiletext ?? '');
    const [profileTextInput, setProfileTextInput] = useState<string>(profile?.profiletext ?? '');
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        let mounted = true;
        const f = async () => {
            if (mounted && auth !== null) {
                const res = await fetchHelp.get(`${getServerAddr()}/api/user/profile`);
                if (res.status == 200) {
                    const js = await res.json();
                    setProfile(js.profile);
                    setProfileText(js.profile.profiletext);
                }
            }
        }
        f();
        return () => { mounted = false; }
    }, []);


    const updateProfileText = async () => {
        if (auth === null)
            return;
        const newProfileText = profileTextInput;
        const res = await fetchHelp.putJson(`${getServerAddr()}/api/user/profile`, {profileText: newProfileText});
        if (res.status == 200) {
            setProfileText(newProfileText);
            setProfileTextInput('');
        }
    }


    const deleteAccount = async () => {
        const res = await fetchHelp.del(`${getServerAddr()}/api/user/`);
        if (res.status == 200) {
            auth?.onLogout();
        }
        setModalOpen(false);
    }

    return (
        <Card>
            <CardHeader
                avatar={<Avatar>{profile?.fullname.split(" ").map(part => part[0]).join("")}</Avatar>}
                title={profile?.fullname}
                subheader={profile?.birthdate}
            />
            <CardContent>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<EditIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography>{profileText ? profileText : "No profile text added yet. Click to edit"}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TextField value={profileTextInput} onChange={(e) => setProfileTextInput(e.target.value)}/>
                        <Button size="small" color="primary" variant="contained" onClick={updateProfileText}>Save</Button>
                    </AccordionDetails>
                </Accordion>
            </CardContent>
            <Button color="warning" onClick={() => setModalOpen(true)}>Delete account</Button>
            
            <Modal
                open={modalOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                <Typography variant="h6" component="h2">
                    Are you sure?
                </Typography>
                <Button color="warning" onClick={deleteAccount}>Yes. Delete my account</Button>
                <Button onClick={() => setModalOpen(false)}>No</Button>
                </Box>
            </Modal>

        </Card>
    );
}


export default Profile;