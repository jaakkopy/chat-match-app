import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

import { useAuth } from "./AuthProvider";
import UserProfile from '../models/User';


const UserBrowser = () => {
  const auth = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchUsers = async () => {
    if (auth === null)
      return;
    const res = await fetch("/api/user/browse", {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      // TODO: handle possible error
      if (res.status == 200) {
        const js = await res.json();
        if (js.users.length == 0) {
          setHasMore(false);
        }
        setUsers(js.users);
      }
  }

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchUsers();
    }
    return () => {mounted = false;}
  }, []);

  const postToLikeOrDislike = async (url: string) => {
    if (auth === null || users.length == 0)
      return;
    // TODO: error handling
    const userEmail = users[0].email;
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: userEmail
      }),
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${auth.token}`
      }
    });
    setUsers(users.slice(1));
    if (users.length == 0 && hasMore) {
      fetchUsers();
    }
  }

  const handleLike = () =>  {
    postToLikeOrDislike("/api/likes/like");
  }
  
  const handleDislike = () =>  {
    postToLikeOrDislike("/api/likes/dislike");
  }

  const handlers = useSwipeable({
    onSwiped: async (eventData) => {
      if (eventData.dir == 'Right') {
        handleLike();
      } else {
        handleDislike()
      };
    },
  });

  if (users.length == 0) {
    return (
      <div>
        <p>Sorry. There are no more users to browse</p>
      </div>
    );
  }

  return (
    <div {...handlers} style={{ touchAction: 'pan-y' }}>
      <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {users[0].fullname}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Born {users[0].birthdate}
        </Typography>
        <Typography variant="body2">
          {users[0].profiletext ?? "The user has not given a profile text"} 
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleDislike}>Dislike</Button>
        <Button size="small" onClick={handleLike}>Like</Button>
      </CardActions>
    </Card>
    </div>
  );
}


export  default UserBrowser;