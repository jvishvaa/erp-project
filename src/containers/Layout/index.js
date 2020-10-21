/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/More';

import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import Badge from '@material-ui/core/Badge';
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';
import clsx from 'clsx';
import './styles.scss';

import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import MainListItems from './listItems';
import useStyles from './useStyles';
import logo from '../../assets/images/logo.png';

const Layout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const classes = useStyles();

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label='show 11 new notifications' color='inherit'>
          <Badge badgeContent={11} color='secondary'>
            <NotificationsNoneOutlinedIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label='account of current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          color='inherit'
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className='layout-container'>
      <AppBar position='absolute' className={clsx(classes.appBar)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            className={classes.logoBtn}
          >
            <img src={logo} alt='logo' style={{ maxHeight: '100%' }} />
          </IconButton>
          <Typography component='h1' variant='h6' color='inherit' noWrap>
            Welcome!
            <span style={{ fontSize: '1rem', marginLeft: '1rem' }}>Have a great day</span>
          </Typography>

          <div className={classes.grow}>
            <Paper component='form' className={classes.searchInputContainer}>
              <InputBase
                className={classes.searchInput}
                placeholder='Search..'
                inputProps={{ 'aria-label': 'search across site' }}
              />
              <IconButton
                type='submit'
                className={classes.searchIconButton}
                aria-label='search'
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </div>
          <div className={classes.sectionDesktop}>
            <IconButton aria-label='show 17 new notifications' color='inherit'>
              <Badge
                badgeContent={17}
                color='primary'
                classes={{
                  badge: classes.notificationNumber,
                  root: classes.notificationNumber,
                }}
              >
                <NotificationsNoneOutlinedIcon
                  color='primary'
                  style={{ fontSize: '2rem' }}
                />
              </Badge>
            </IconButton>
            <IconButton
              edge='end'
              aria-label='account of current user'
              aria-controls={menuId}
              aria-haspopup='true'
              onClick={handleProfileMenuOpen}
              color='inherit'
            >
              <AccountCircle color='primary' style={{ fontSize: '2rem' }} />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label='show more'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
      {renderMobileMenu}
      <Drawer
        open={drawerOpen}
        variant='permanent'
        className={clsx(classes.drawer, {
          [classes.drawerPaper]: drawerOpen,
          [classes.drawerPaperClose]: !drawerOpen,
        })}
        classes={{
          paper: clsx({
            [classes.drawer]: true,
            [classes.drawerPaper]: drawerOpen,
            [classes.drawerPaperClose]: !drawerOpen,
          }),
        }}
        onClose={() => setDrawerOpen(false)}
      >
        <Toolbar className={classes.toolbar} />
        <List>
          <ListItem>
            <ListItemIcon
              onClick={() => setDrawerOpen((prevState) => !prevState)}
              className={classes.menuItemIcon}
            >
              {drawerOpen ? <CloseIcon /> : <MenuIcon />}
            </ListItemIcon>
            <ListItemText className={classes.menuItemText}>Menu</ListItemText>
          </ListItem>
          <MainListItems />
        </List>
      </Drawer>
      <main className={classes.content}>
        <Toolbar className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
};

export default Layout;
