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
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import './styles.scss';
import logoMobile from '../../assets/images/logo_mobile.png';

import logo from '../../assets/images/logo.png';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

const Layout = ({ children, history }) => {
  const dispatch = useDispatch();
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const { role_details: roleDetails } =
    JSON.parse(localStorage.getItem('userDetails')) || {};
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
  const getGlobalUserRecords = async (text) => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.gloabSearch.getUsers}?search=${text}&page=${currentPage}&page_size=100`,
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
      getGlobalUserRecords(q);
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

  useEffect(() => {
    if (searchedText !== '') {
      setGlobalSearchResults(false);
      setSearching(false);
      setSearchUserDetails([]);
      setTotalPage(0);
      setCurrentPage(1);
    }
  }, [history.location.pathname]);

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
      return;
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

  const handleTextSearchClear = () => {
    setTimeout(() => {
      setSearchedText('');
      setGlobalSearchResults(false);
      setSearching(false);
      setSearchUserDetails([]);
      setTotalPage(0);
      setCurrentPage(1);
    }, 500);
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

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  return (
    <div className={classes.root}>
      <AppBar position='absolute' className={clsx(classes.appBar)}>
        <Toolbar className={classes.toolbar}>
          <Box
            className={classes.mobileToolbar}
            display='flex'
            justifyContent='space-between'
          >
            <IconButton
              edge='start'
              color='inherit'
              aria-label='open drawer'
              onClick={() => {
                setDrawerOpen((prevState) => !prevState);
              }}
            >
              {drawerOpen ? <CloseIcon color='primary' /> : <MenuIcon color='primary' />}
            </IconButton>

            <IconButton className={classes.logoMobileContainer}>
              <img className={classes.logoMObile} src={logoMobile} alt='logo-small' />
            </IconButton>

            <IconButton />
          </Box>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            className={clsx(classes.logoBtn, classes.desktopToolbarComponents)}
          >
            <img src={logo} alt='logo' style={{ maxHeight: '100%' }} />
          </IconButton>
          <Typography
            className={classes.desktopToolbarComponents}
            component='h1'
            variant='h6'
            color='inherit'
            noWrap
          >
            Welcome!
            <span style={{ fontSize: '1rem', marginLeft: '1rem' }}>Have a great day</span>
          </Typography>
          {superUser ? (
            <div className={clsx(classes.grow, classes.desktopToolbarComponents)}>
              <Paper component='form' className={classes.searchInputContainer}>
                <InputBase
                  value={searchedText}
                  className={classes.searchInput}
                  placeholder='Search..'
                  inputProps={{ 'aria-label': 'search across site' }}
                  inputRef={searchInputRef}
                  onChange={changeQuery}
                  onBlur={handleTextSearchClear}
                />
                {searchedText ? (
                  <IconButton
                    type='submit'
                    className={classes.clearIconButton}
                    aria-label='search'
                    onClick={handleTextSearchClear}
                  >
                    <CloseIcon />
                  </IconButton>
                ) : null}
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
                      searchInputRef.current.getBoundingClientRect().width
                  }px)`,
                  zIndex: 3000,
                }}
                transition
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <Paper>
                      <Grid container style={{ flexDirection: 'column' }}>
                        {globalSearchResults && searchUserDetails.length ? (
                          <>
                            <Grid item>
                              <Grid
                                container
                                style={{
                                  flexDirection: 'row',
                                  paddingBottom: 12,
                                  paddingTop: 12,
                                  paddingLeft: 16,
                                  backgroundColor: 'rgb(224 224 224)',
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
                                            background: 'rgb(224 224 224)',
                                            width: '100%',
                                            color: '#014B7E',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                          }}
                                        >
                                          Users
                                        </ListSubheader>
                                      }
                                    >
                                      {globalSearchResults &&
                                        searchUserDetails.length &&
                                        searchUserDetails.map((result, index) => {
                                          return (
                                            <ListItem
                                              style={{ width: 324 }}
                                              className='user_rows_details'
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
                            <span
                              style={{
                                padding: 1,
                                textAlign: 'center',
                                margin: 'auto',
                                color: '#014B7E',
                              }}
                            >
                              No data available.
                            </span>
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
          ) : null}
          <div
            className={`${clsx(
              classes.sectionDesktop,
              classes.desktopToolbarComponents
            )} ${superUser ? 'null' : 'layout_user_icon'}`}
          >
            <IconButton
              aria-label='show more'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'
            >
              {roleDetails && roleDetails.user_profile ? (
                <img
                  style={{ fontSize: '0.4rem' }}
                  src={roleDetails.user_profile}
                  alt='no img'
                  className='profile_img'
                />
              ) : (
                <AccountCircle color='primary' style={{ fontSize: '2rem' }} />
              )}
              {profileOpen ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </div>

          {/* <div className={classes.sectionMobile}>
            <IconButton
              aria-label='show more'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'
            >
              <MoreIcon />
            </IconButton>
          </div> */}
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      <Drawer
        open={drawerOpen}
        variant={isMobile ? '' : 'permanent'}
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
        <div className={classes.appBarSpacer} />
        <List>
          <ListItem
            className={classes.menuControlContainer}
            onClick={() => setDrawerOpen((prevState) => !prevState)}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              {drawerOpen ? <CloseIcon /> : <MenuIcon />}
            </ListItemIcon>
            <ListItemText className='menu-item-text'>Menu</ListItemText>
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
              <ListItemText className='menu-item-text'>View Profile</ListItemText>
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
                <ListItemText className='menu-item-text'>Dashboard</ListItemText>
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
                <ListItemText className='menu-item-text'>User Management</ListItemText>
                {userMenuOpen ? (
                  <ExpandLess className={classes.expandIcons} />
                ) : (
                  <ExpandMore className={classes.expandIcons} />
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
                    <ListItemText primary={`Create User`} className='menu-item-text' />
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
                    <ListItemText primary='View User' className='menu-item-text' />
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
                    <ListItemText primary={`Assign Role`} className='menu-item-text' />
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
                <ListItemText className='menu-item-text'>Master Management</ListItemText>
                {masterMenuOpen ? (
                  <ExpandLess className={classes.expandIcons} />
                ) : (
                  <ExpandMore className={classes.expandIcons} />
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
                    <ListItemText primary={`Subject`} className='menu-item-text' />
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
                    <ListItemText primary={`Section`} className='menu-item-text' />
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
                    <ListItemText primary={`Grade`} className='menu-item-text' />
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
                <ListItemText className='menu-item-text'>Role management</ListItemText>
              </ListItem>
            </>
          )}

          {navigationData && drawerOpen && navigationData.length > 0 && (
            <DrawerMenu navigationItems={navigationData} onClick={handleRouting} />
          )}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container className={classes.container}>{children}</Container>
      </main>
    </div>
  );
};

export default withRouter(Layout);
