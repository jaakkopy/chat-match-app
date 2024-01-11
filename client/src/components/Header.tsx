import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from './AuthProvider';


const Header = () => {
    const auth = useAuth();
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                <Button color="inherit" component={RouterLink} to="/">{"Home"}</Button>
                {!auth?.isLoggedIn() ? 
                    /* Show only if not logged in */
                    <>
                        <Button color="inherit" component={RouterLink} to="/login">{"Login"}</Button>
                        <Button color="inherit" component={RouterLink} to="/register">{"Register"}</Button>
                    </>
                    : null
                }
                {auth?.isLoggedIn() ? 
                    /* Show only if logged in */
                    <>

                        <Button color="inherit" onClick={auth?.onLogout}>{"Logout"}</Button>
                        <Button color="inherit" component={RouterLink} to="/match">{"Matches"}</Button>
                    </>
                    : null
                }
                </Toolbar>
            </AppBar>
        </Box>
  );
}

export default Header;
