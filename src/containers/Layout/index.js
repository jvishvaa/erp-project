/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import Badge from '@material-ui/core/Badge';
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';
import clsx from 'clsx';
import { withRouter } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PeopleIcon from '@material-ui/icons/People';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import { logout } from '../../redux/actions';
import DrawerMenu from '../../components/drawer-menu';
import useStyles from './useStyles';
import './styles.scss';

import logo from '../../assets/images/logo.png';

const Layout = ({ children, history }) => {
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [navigationData, setNavigationData] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [masterMenuOpen, setMasterMenuOpen] = useState(false);
  const [superUser, setSuperUser] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  useEffect(() => {
    const navigationData = localStorage.getItem('navigationData');
    if (navigationData) {
      setNavigationData(JSON.parse(navigationData));
    }
    let userDetails = localStorage.getItem('userDetails');
    if (!userDetails) {
      history.push('/');
    }
    if (userDetails) {
      userDetails = JSON.parse(userDetails);
      const { is_superuser } = userDetails;
      setSuperUser(is_superuser);
    }
  }, []);

  useEffect(() => {
    if (isLogout) {
      history.push('/');
      setIsLogout(false);
    }
  }, [isLogout]);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsLogout(true);
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
  const renderMenu = () => (
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

  const handleRouting = (name) => {
    switch (name) {
      case 'Take Class': {
        history.push('/take-class');
        break;
      }
      case 'View Class': {
        history.push('/online-class/view-class');
        break;
      }
      case 'Resources': {
        history.push('/online-class/resource');
        break;
      }
      case 'Attend Online Class': {
        history.push('/online-class/attend-class');
        break;
      }
      case 'Create Class': {
        history.push('/online-class/create-class');
        break;
      }
      case 'Online Class': {
        history.push('/create-class');
        break;
      }
      case 'Communication': {
        history.push('/communication');
        break;
      }
      case 'Add Group': {
        history.push('/addgroup');
        break;
      }
      case 'View&Edit Group': {
        history.push('/viewgroup');
        break;
      }
      case 'Send Message': {
        history.push('/sendmessage');
        break;
      }
      case 'Add SMS Credit': {
        history.push('/smscredit');
        break;
      }
      case 'SMS&Email Log': {
        history.push('/messageLog');
        break;
      }

      default:
        break;
    }
  };

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
            <IconButton
              edge='end'
              aria-label='logout button'
              aria-controls={menuId}
              aria-haspopup='false'
              onClick={handleLogout}
              color='inherit'
            >
              <ExitToAppIcon color='primary' style={{ fontSize: '2rem' }} />
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
          <ListItem onClick={() => setDrawerOpen((prevState) => !prevState)}>
            <ListItemIcon className={classes.menuItemIcon}>
              {drawerOpen ? <CloseIcon /> : <MenuIcon />}
            </ListItemIcon>
            <ListItemText className={classes.menuItemText}>Menu</ListItemText>
          </ListItem>
          {drawerOpen ? (
            <ListItem
              button
              className={
                history.location.pathname === '/profile' ? 'menu_selection' : null
              }
              onClick={() => {
                history.push('/profile');
              }}
            >
              {' '}
              <ListItemIcon className={classes.menuItemIcon}>
                <AssignmentIndIcon />
              </ListItemIcon>
              <ListItemText className={classes.menuItemText}>View Profile</ListItemText>
            </ListItem>
          ) : null}
          {superUser && drawerOpen && (
            <>
              <ListItem
                button
                className={
                  history.location.pathname === '/dashboard' ? 'menu_selection' : null
                }
                onClick={() => {
                  history.push('/dashboard');
                }}
              >
                {' '}
                <ListItemIcon className={classes.menuItemIcon}>
                  <AssignmentIndIcon />
                </ListItemIcon>
                <ListItemText className={classes.menuItemText}>Dashboard</ListItemText>
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  setUserMenuOpen((prevState) => !prevState);
                }}
              >
                <ListItemIcon className={classes.menuItemIcon}>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText className={classes.menuItemText}>
                  User Management
                </ListItemText>
                {userMenuOpen ? (
                  <ExpandLess style={{ marginLeft: '2rem' }} />
                ) : (
                    <ExpandMore style={{ marginLeft: '2rem' }} />
                  )}
              </ListItem>
              <Collapse in={userMenuOpen}>
                <Divider />
                <List>
                  <ListItem
                    button
                    className={
                      history.location.pathname === '/user-management/create-user'
                        ? 'menu_selection'
                        : null
                    }
                    onClick={() => {
                      history.push('/user-management/create-user');
                    }}
                  >
                    <ListItemIcon className={classes.menuItemIcon}>
                      {/* <MenuIcon name={child.child_name} /> */}
                      {/* {menuIcon(child.child_name)} */}
                    </ListItemIcon>
                    <ListItemText
                      primary={`Create User`}
                      className={classes.menuItemText}
                    />
                  </ListItem>
                  <ListItem
                    button
                    className={
                      history.location.pathname === '/view-users'
                        ? 'menu_selection'
                        : null
                    }
                    onClick={() => {
                      history.push('/view-users');
                    }}
                  >
                    <ListItemIcon className={classes.menuItemIcon}>
                      {/* <MenuIcon name={child.child_name} /> */}
                      {/* {menuIcon(child.child_name)} */}
                    </ListItemIcon>
                    <ListItemText primary='View User' className={classes.menuItemText} />
                  </ListItem>

                  <ListItem
                    button
                    className={
                      history.location.pathname === '/user-management'
                        ? 'menu_selection'
                        : null
                    }
                    onClick={() => {
                      history.push('/user-management');
                    }}
                  >
                    <ListItemIcon className={classes.menuItemIcon}>
                      {/* <MenuIcon name={child.child_name} /> */}
                      {/* {menuIcon(child.child_name)} */}
                    </ListItemIcon>
                    <ListItemText
                      primary={`Assign Role`}
                      className={classes.menuItemText}
                    />
                  </ListItem>
                </List>
              </Collapse>


              <ListItem
                button
                onClick={() => {
                  setMasterMenuOpen((prevState) => !prevState);
                }}
              >
                <ListItemIcon className={classes.menuItemIcon}>
                  <SupervisorAccountIcon />
                </ListItemIcon>
                <ListItemText className={classes.menuItemText}>
                  Master Management
                </ListItemText>
                {masterMenuOpen ? (
                  <ExpandLess style={{ marginLeft: '2rem' }} />
                ) : (
                    <ExpandMore style={{ marginLeft: '2rem' }} />
                  )}
              </ListItem>
              <Collapse in={masterMenuOpen}>
                <Divider />
                <List>
                  <ListItem
                    button
                    className={
                      history.location.pathname === '/master-mgmt/subject-table'
                        ? 'menu_selection'
                        : null
                    }
                    onClick={() => {
                      history.push('/master-mgmt/subject-table');
                    }}
                  >
                    <ListItemIcon className={classes.menuItemIcon}>
                      {/* <MenuIcon name={child.child_name} /> */}
                      {/* {menuIcon(child.child_name)} */}
                    </ListItemIcon>
                    <ListItemText
                      primary={`Subject`}
                      className={classes.menuItemText}
                    />
                  </ListItem>
                  
                  <ListItem
                    button
                    className={
                      history.location.pathname === '/master-mgmt/section-table'
                        ? 'menu_selection'
                        : null
                    }
                    onClick={() => {
                      history.push('/master-mgmt/section-table');
                    }}
                  >
                    <ListItemIcon className={classes.menuItemIcon}>
                      {/* <MenuIcon name={child.child_name} /> */}
                      {/* {menuIcon(child.child_name)} */}
                    </ListItemIcon>
                    <ListItemText
                      primary={`Section`}
                      className={classes.menuItemText}
                    />
                  </ListItem>

                  <ListItem
                    button
                    className={
                      history.location.pathname === '/master-mgmt/grade-table'
                        ? 'menu_selection'
                        : null
                    }
                    onClick={() => {
                      history.push('/master-mgmt/grade-table');
                    }}
                  >
                    <ListItemIcon className={classes.menuItemIcon}>
                      {/* <MenuIcon name={child.child_name} /> */}
                      {/* {menuIcon(child.child_name)} */}
                    </ListItemIcon>
                    <ListItemText
                      primary={`Grade`}
                      className={classes.menuItemText}
                    />
                  </ListItem>
                </List>
              </Collapse>

              <ListItem
                button
                className={
                  history.location.pathname === '/role-management'
                    ? 'menu_selection'
                    : null
                }
                onClick={() => {
                  history.push('/role-management');
                }}
              >
                <ListItemIcon className={classes.menuItemIcon}>
                  <AssignmentIndIcon />
                </ListItemIcon>
                <ListItemText className={classes.menuItemText}>
                  Role management
                </ListItemText>
              </ListItem>
            </>
          )}

          {navigationData && drawerOpen && navigationData.length > 0 && (
            <DrawerMenu navigationItems={navigationData} onClick={handleRouting} />
          )}
        </List>
      </Drawer>
      <main className={classes.content}>
        <Toolbar className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
};

export default withRouter(Layout);
