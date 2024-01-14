import { useEffect, useState } from "react";
import { Container, Box, Avatar, Stack, Typography } from "@mui/material";

import UserProfile from "../models/User";
import { useAuth } from "./AuthProvider";

const Profile = () => {
    const auth = useAuth();
    const [profile, setProfile] = useState<UserProfile>();

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
                }
            }
        }
        f();
        return () => {mounted = false;}
    }, []);

    return (
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <Stack direction={"column"}>
                <Avatar>A</Avatar>
                <Typography>{profile?.fullname}</Typography>
                <Typography>{profile?.birthdate}</Typography>
                <Typography>{profile?.profiletext ?? "No profile text yet"}</Typography>
            </Stack>
        </Box>
    );
}


export default Profile;