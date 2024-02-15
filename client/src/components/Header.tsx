import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { useState } from 'react';
import { Container } from '@mui/material';


const HeaderDrawerLinkItem = ({link, text}: {link: string, text: string}) => {
    return (
        <ListItem>
            <ListItemButton sx={{ textAlign: 'center' }} color="inherit" component={RouterLink} to={link}>
                <ListItemText primary={text}/>
            </ListItemButton>
        </ListItem>
    )
}


// Based on an example from https://mui.com/material-ui/react-app-bar/#app-bar-with-responsive-menu
// This component is responsible for the menu with links to pages
const Header = ({children}: any) => {
    const auth = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const drawerWidth = 240;

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ my: 2 }}>
            Match App
          </Typography>
          <Divider />
          <List>
            {!auth?.isLoggedIn() ? 
                    /* Show only if not logged in */
                    <>
                        <HeaderDrawerLinkItem link="/login" text="Login"/>
                        <HeaderDrawerLinkItem link="/register" text="Register"/>
                    </>
                    : null
                }
                {auth?.isLoggedIn() ? 
                    /* Show only if logged in */
                    <>
                        <HeaderDrawerLinkItem link="/" text="Matches"/>
                        <HeaderDrawerLinkItem link="/browse" text="Browse"/>
                        <HeaderDrawerLinkItem link="/profile" text="My profile"/>
                        <Button color="inherit" onClick={auth?.onLogout}>{"Logout"}</Button>
                    </>
                    : null
                }            
          </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
        <AppBar component="nav">
            <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
            >
                <MenuIcon />
            </IconButton>
            <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
                Match App
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
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
                        <Button color="inherit" component={RouterLink} to="/">{"Matches"}</Button>
                        <Button color="inherit" component={RouterLink} to="/browse">{"Browse"}</Button>
                        <Button color="inherit" component={RouterLink} to="/profile">{"My Profile"}</Button>
                        <Button color="inherit" onClick={auth?.onLogout}>{"Logout"}</Button>
                    </>
                    : null
                }
            </Box>
            </Toolbar>
        </AppBar>
        <nav>
            <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
                keepMounted: true,
            }}
            sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            >
            {drawer}
            </Drawer>
        </nav>
        <Container component="main" sx={{ p: 3 }}>
            <Toolbar />
            {children}
        </Container>
      </Box>
  );
}

export default Header;
