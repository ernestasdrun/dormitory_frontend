import * as React from 'react';
import { useEffect } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom'

import '../App.css'

const pages = ['Rezervacijos', 'Dokumentai', 'Gedimai'];

const user = localStorage.getItem('user');

export const ResponsiveAppBar = () => {

  const [anchorElF, setAnchorElF] = React.useState(null);
  const openF = Boolean(anchorElF);
  const handleClickF = (event) => {
    setAnchorElF(event.currentTarget);
  };
  const handleCloseF = () => {
    setAnchorElF(null);
  };

  const [anchorElR, setAnchorElR] = React.useState(null);
  const openR = Boolean(anchorElR);
  const handleClickR = (event) => {
    setAnchorElR(event.currentTarget);
  };
  const handleCloseR = () => {
    setAnchorElR(null);
  };


  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogOut = () => {
    localStorage.clear();
    navigate('/');
  };

  /*useEffect(() => {
    if (localStorage.getItem('userType') == 10) {
      return 'Mano rezervacijos'
    } else return 'Gyventojų rezervacijos'
  }, []);*/

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            Bendrabutis
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              id="reservations-button"
              aria-controls={openR ? 'reservations-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openR ? 'true' : undefined}
              onClick={handleClickR}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Rezervacijos
            </Button>
            <Menu
              id="reservations-menu"
              anchorEl={anchorElR}
              open={openR}
              onClose={handleCloseR}
              MenuListProps={{
                'aria-labelledby': 'reservations-button',
              }}
            >
              <Link to="/reservations"><MenuItem onClick={handleCloseR} style={{ textDecoration: 'none', color: 'black' }}>Nauja kambario rezervacija</MenuItem></Link>
              <Link to="/reservList"><MenuItem onClick={handleCloseR} style={{ textDecoration: 'none', color: 'black' }}>Mano rezervacijos</MenuItem></Link>
            </Menu>
            <Button
              id="failures-button"
              aria-controls={openF ? 'failures-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openF ? 'true' : undefined}
              onClick={handleClickF}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Gedimai
            </Button>
            <Menu
              id="failures-menu"
              anchorEl={anchorElF}
              open={openF}
              onClose={handleCloseF}
              MenuListProps={{
                'aria-labelledby': 'failures-button',
              }}
            >
               <Link to="/failures"><MenuItem onClick={handleCloseF} style={{ textDecoration: 'none', color: 'black' }}>Registruoti gedimą</MenuItem></Link>
              <MenuItem onClick={handleCloseF}>Mano užregistruoti gedimai</MenuItem>
            </Menu>
            <Link to="/documents"><Button sx={{ my: 2, color: 'white', display: 'block' }}>Dokumentai</Button></Link>
          </Box>


          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            Sveiki, {user}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Link to="/profile" style={{ textDecoration: 'none', color: 'black' }}><MenuItem>Profilis</MenuItem></Link>
              <Link to="/bills" style={{ textDecoration: 'none', color: 'black' }}><MenuItem>Sąskaitos</MenuItem></Link>
              <MenuItem onClick={handleLogOut}>Atsijungti</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
