import { useEffect, useState } from "react";
import { Container, Box, Avatar, Stack, Typography, Divider, Card, CardHeader, CardContent, TextField, Button } from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import EditIcon from '@mui/icons-material/Edit';

import UserProfile from "../models/User";
import { useAuth } from "./AuthProvider";

const Profile = () => {
    const auth = useAuth();
    const [profile, setProfile] = useState<UserProfile>();
    const [profileText, setProfileText] = useState<string>(profile?.profiletext ?? '');
    const [profileTextInput, setProfileTextInput] = useState<string>(profile?.profiletext ?? '');

    useEffect(() => {
        let mounted = true;
        const f = async () => {
            if (mounted && auth !== null) {
                const res = await fetch("/api/user/profile", {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
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
        
        const res = await fetch("/api/user/profile", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${auth.token}`,
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                profileText: newProfileText
            })
        });

        if (res.status == 200) {
            setProfileText(newProfileText);
        }
    }

    return (
        <Card>
            <CardHeader
                avatar={<Avatar>{profile?.fullname.split(" ").map(part => part[0]).join("")}</Avatar>}
                title={profile?.fullname}
                subheader={profile?.birthdate}
            />
            <CardContent>
                <p>My profile text</p>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<EditIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography>{profileText != '' ? profileText : "No profile text added yet. Click to edit"}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TextField value={profileTextInput} onChange={(e) => setProfileTextInput(e.target.value)}/>
                        <Button size="small" color="primary" variant="contained" onClick={updateProfileText}>Save</Button>
                    </AccordionDetails>
                </Accordion>
            </CardContent>
        </Card>
    );
}


export default Profile;