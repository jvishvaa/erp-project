/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-use-before-define */
/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
import React, { useContext, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { throttle, debounce } from 'throttle-debounce';
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
import {
  Popper,
  Fade,
  Paper,
  Grid,
  ListItemSecondaryAction,
  ListItemIcon,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/EditOutlined';
import { fade } from '@material-ui/core/styles/colorManipulator';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import SupervisorAccountOutlinedIcon from '@material-ui/icons/SupervisorAccountOutlined';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import clsx from 'clsx';
import { withRouter } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import LinearProgress from '@material-ui/core/LinearProgress';
import DeleteIcon from '@material-ui/icons/Delete';
import { logout } from '../../redux/actions';
import DrawerMenu from '../../components/drawer-menu';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import UserDetails from './userDetails/user-details';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import useStyles from './useStyles';
import Grow from '@material-ui/core/Grow';
import './styles.scss';

import logo from '../../assets/images/logo.png';

const Layout = ({ children, history }) => {
  const dispatch = useDispatch();
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [navigationData, setNavigationData] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [masterMenuOpen, setMasterMenuOpen] = useState(false);
  const [superUser, setSuperUser] = useState(false);
  const [searchUserDetails, setSearchUserDetails] = useState([]);
  const searchInputRef = useRef();
  const { setAlert } = useContext(AlertNotificationContext);
  const [searching, setSearching] = useState(false);
  const [globalSearchResults, setGlobalSearchResults] = useState(false);
  const [globalSearchError, setGlobalSearchError] = useState(false);
  const [searchedText, setSearchedText] = useState('');
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scrollDone, setScrollDone] = useState(false);
  const [displayUserDetails, setDisplayUserDetails] = useState(false);
  const [userId, setUserId] = useState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const getGlobalUserRecords = async () => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.gloabSearch.getUsers}?search=${searchedText}&page=${currentPage}&page_size=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.data.status_code === 200) {
        const tempData = [];
        result.data.data.results.map((items) =>
          tempData.push({ id: items.id, name: items.name, erpId: items.erp_id })
        );
        setTotalPage(result.data.data.total_pages);
        setSearchUserDetails(tempData);
      } else {
        setAlert('error', result.data.message);
        setGlobalSearchError(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setGlobalSearchError(false);
    }
  };
  const autocompleteSearch = (q, pageId, isDelete) => {
    if (q !== '') {
      setSearching(true);
      setGlobalSearchResults(true);
      getGlobalUserRecords();
    }
  };
  const autocompleteSearchDebounced = debounce(500, autocompleteSearch);
  const autocompleteSearchThrottled = throttle(500, autocompleteSearch);
  const [profileOpen, setProfileOpen] = useState(false);

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

  //   useEffect(() => {
  //     if (searchedText !== '') {
  //       getGlobalUserRecords();
  //     }
  //   }, [currentPage]);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleLogout = () => {
    dispatch(logout());
    setIsLogout(true);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
    setProfileOpen(false);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
    setProfileOpen(true);
  };

  const changeQuery = (event) => {
    setSearchedText(event.target.value);
    if (event.target.value === '') {
      setGlobalSearchResults(false);
      setSearching(false);
      setSearchUserDetails([]);
      setTotalPage(0);
      setCurrentPage(1);
    }
    const q = event.target.value;
    if (q.length < 5) {
      setCurrentPage(1);
      autocompleteSearchThrottled(event.target.value);
    } else {
      setCurrentPage(1);
      autocompleteSearchDebounced(event.target.value);
    }
  };

  //   const handleScroll = (event) => {

  //     if (
  //       target.scrollTop + target.clientHeight === target.scrollHeight &&
  //       currentPage < totalPage
  //     ) {
  //       setScrollDone(true);
  //       setCurrentPage(currentPage + 1);
  //     }
  //   };

  const classes = useStyles();

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      id={mobileMenuId}
      TransitionComponent={Grow}
      transitionDuration={500}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={(e) => history.push('/profile')}>
        <IconButton aria-label='my profile' color='inherit'>
          <PermIdentityIcon color='primary' style={{ fontSize: '2rem' }} />
        </IconButton>
        <p style={{ color: '#014B7E' }}>My Profile</p>
      </MenuItem>

      <MenuItem onClick={handleLogout}>
        <IconButton aria-label='logout button' color='inherit'>
          <ExitToAppIcon color='primary' style={{ fontSize: '2rem' }} />
        </IconButton>
        <p style={{ color: '#014B7E' }}>Logout</p>
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
                inputRef={searchInputRef}
                onChange={changeQuery}
              />
              <IconButton
                type='submit'
                className={classes.searchIconButton}
                aria-label='search'
              >
                <SearchIcon />
              </IconButton>
            </Paper>
            <Popper
              open={searching}
              className={classes.searchDropdown}
              placement='bottom'
              style={{
                position: 'fixed',
                top:
                  searchInputRef.current &&
                  searchInputRef.current.getBoundingClientRect().top + 32,
                left: 'auto',
                right: `calc(100vw - ${
                  searchInputRef.current &&
                  searchInputRef.current.getBoundingClientRect().left +
                    searchInputRef.current.getBoundingClientRect().width +
                    70
                }px)`,
                zIndex: 3000,
              }}
              transition
            >
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                  <Paper>
                    <Grid container style={{ flexDirection: 'column' }}>
                      {globalSearchResults ? (
                        <>
                          <Grid item>
                            <Grid
                              container
                              style={{
                                flexDirection: 'row',
                                paddingBottom: 12,
                                paddingTop: 12,
                                paddingLeft: 16,
                                backgroundColor: '#eee',
                                paddingRight: 16,
                                minWidth: 374,
                              }}
                            >
                              <Grid
                                // onScroll={(event) => handleScroll(event)}
                                style={{
                                  paddingRight: 8,
                                  maxHeight: 385,
                                  height: 300,
                                  overflow: 'auto',
                                }}
                                item
                              >
                                {globalSearchResults && (
                                  <List
                                    style={{ minWidth: 61 }}
                                    subheader={
                                      <ListSubheader
                                        style={{
                                          background: 'rgb(238, 238, 238)',
                                          width: '100%',
                                        }}
                                      >
                                        Users
                                      </ListSubheader>
                                    }
                                  >
                                    {globalSearchResults &&
                                      searchUserDetails.map((result, index) => {
                                        return (
                                          <ListItem
                                            style={{ width: 324 }}
                                            button
                                            onClick={() => {
                                              console.log('I amcalled...');
                                              setSearching(false);
                                              setUserId(result.id);
                                              setDisplayUserDetails(true);
                                            }}
                                          >
                                            <ListItemText
                                              primary={result.name}
                                              secondary={result.erpId}
                                            />
                                            {/* <ListItemSecondaryAction>
                                              <IconButton
                                                aria-label='Delete'
                                                onClick={() =>
                                                  handleUserDelete(result.id, index)
                                                }
                                                className={classes.margin}
                                              >
                                                <DeleteIcon fontSize='small' />
                                              </IconButton>
                                            </ListItemSecondaryAction> */}
                                          </ListItem>
                                        );
                                      })}
                                  </List>
                                )}
                              </Grid>
                            </Grid>
                          </Grid>
                        </>
                      ) : (
                        <Grid
                          container
                          style={{
                            flexDirection: 'row',
                            backgroundColor: '#eee',
                            minHeight: 324,
                            minWidth: 374,
                            flexGrow: 1,
                          }}
                        >
                          {searchedText.length > 0 ? (
                            <LinearProgress
                              style={{ width: '100%' }}
                              color='secondary'
                              variant='query'
                            />
                          ) : (
                            <span style={{ padding: 1 }}>Type something to search.</span>
                          )}
                        </Grid>
                      )}
                    </Grid>
                    <Grid container>
                      {globalSearchError && (
                        <Grid
                          style={{ padding: 8, width: '100%', backgroundColor: '#eee' }}
                          xs={12}
                          item
                        >
                          Something went wrong.
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Fade>
              )}
            </Popper>
            {displayUserDetails ? (
              <UserDetails
                close={setDisplayUserDetails}
                userId={userId}
                setUserId={setUserId}
                setSearching={setSearching}
              />
            ) : null}
          </div>

          <div className={classes.sectionDesktop}>
            <IconButton
              aria-label='show more'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'
            >
              <AccountCircle color='primary' style={{ fontSize: '2rem' }} />
              {profileOpen ? <ExpandLess /> : <ExpandMore />}
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
                  <SupervisorAccountOutlinedIcon />
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
                    <ListItemText primary={`Subject`} className={classes.menuItemText} />
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
                    <ListItemText primary={`Section`} className={classes.menuItemText} />
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
                    <ListItemText primary={`Grade`} className={classes.menuItemText} />
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
