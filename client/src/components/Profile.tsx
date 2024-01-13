import { useEffect, useState } from "react";
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
        <div>
            Name: {profile?.fullname}
            <br></br>
            Born: {profile?.birthdate}
            <br></br>
            About me: {profile?.profiletext ?? "No profile text yet"}
        </div>
    );
}


export default Profile;