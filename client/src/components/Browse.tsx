import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

import { useAuth } from "./AuthProvider";
import UserProfile from '../models/User';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { useFetch } from './useFetch';
import { Alert } from '@mui/material';
import { getServerAddr } from './server_addr';


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


const MatchModal = ({ modalOpen, onModalYesClick, onModalNoClick }: { modalOpen: boolean, onModalYesClick: () => void, onModalNoClick: () => void, }) => {
  return <Modal
    open={modalOpen}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={modalStyle}>
      <Typography variant="h6" component="h2">
        Match! Start chatting right away?
      </Typography>
      <Button onClick={onModalYesClick}>Yes</Button>
      <Button onClick={onModalNoClick}>No</Button>
    </Box>
  </Modal>
}


const UserBrowser = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const fetchHelp = useFetch();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchUsers = async () => {
    if (auth === null)
      return;
    const res = await fetchHelp.get(`${getServerAddr()}/api/user/browse`);
    if (res.status == 200) {
      const js = await res.json();
      if (js.users.length == 0) {
        setHasMore(false);
      }
      setUsers(js.users);
      setIndex(0);
    } else {
      const msg = await res.text();
      setError(msg);
    }
  }

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchUsers();
    }
    return () => { mounted = false; }
  }, []);

  const postToLikeOrDislike = async (url: string) => {
    if (auth === null || users.length == 0 || index >= users.length)
      return null;
    const userEmail = users[index].email;
    const res = await fetchHelp?.postJson(url, {email: userEmail});
    return res;
  }

  const handleModalOpen = () => {
    setModalOpen(true);
  }

  const handleModalClose = () => {
    setModalOpen(false);
  }

  const incrementIndex = () => {
    const newIndex = index + 1;
    setIndex(newIndex);
    // The current set has been browsed to the end. If there is more to fetch, fetch it
    if (newIndex >= users.length && hasMore) {
      fetchUsers();
    }
  }

  const handleLike = async () => {
    try {
      const res = await postToLikeOrDislike(`${getServerAddr()}/api/likes/like`);
      const { mutualLikes } = await res?.json();
      // Both users have liked each other. Ask if the user wants to start chatting
      if (mutualLikes) {
        // Open the modal. Don't call incrementIndex yet because we want to wait
        // for the user to press "yes" or "no" in the modal
        handleModalOpen();
      } else {
        incrementIndex();
      }
    } catch (e) {
      console.error(e);
    }

  }

  const handleDislike = async () => {
    postToLikeOrDislike(`${getServerAddr()}/api/likes/dislike`);
    incrementIndex();
  }

  // Handle swipe event if on mobile
  const handlers = useSwipeable({
    onSwiped: async (eventData) => {
      if (eventData.dir == 'Right') {
        handleLike();
      } else {
        handleDislike()
      };
    },
  });

  if (index >= users.length || users.length == 0) {
    return <Alert severity='info'>There are no more users to browse</Alert>;
  }

  const onModalYesClick = () => {
    handleModalClose();
    navigate("/chat", { state: { profile: users[index] } });
  }

  const onModalNoClick = () => {
    handleModalClose();
    incrementIndex();
  }


  if (error !== null)
    return <Alert severity='error'>Error: {error}</Alert>;

  return (
    <div {...handlers} style={{ touchAction: 'pan-y' }}>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {users[index].fullname}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Born {users[index].birthdate}
          </Typography>
          <Typography variant="body2">
            {users[index].profiletext ?? "The user has not given a profile text"}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleDislike}>Dislike</Button>
          <Button size="small" onClick={handleLike}>Like</Button>
        </CardActions>
      </Card>
      <MatchModal modalOpen={modalOpen} onModalNoClick={onModalNoClick} onModalYesClick={onModalYesClick}/>
    </div>
  );
}


export default UserBrowser;