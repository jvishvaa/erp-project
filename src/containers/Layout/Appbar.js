import React, { useEffect, useState, useContext, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Divider } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, Typography } from '@material-ui/core';
import Grow from '@material-ui/core/Grow';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { logout } from '../../redux/actions';
import { throttle, debounce } from 'throttle-debounce';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

import logo from '../../assets/images/logo.png';
import logoMobile from '../../assets/images/logo_mobile.png';
import SearchBar from './SearchBar';
import AppSearchBarUseStyles from './AppSearchBarUseStyles';

const Appbar = ({ children, history, ...props }) => {
  const classes = AppSearchBarUseStyles();
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [centralSchoolLogo, setCentralSchoolLogo] = useState('');
  const [superUser, setSuperUser] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [navigationData, setNavigationData] = useState(false);
  const [searching, setSearching] = useState(false);
  const [globalSearchResults, setGlobalSearchResults] = useState(false);
  const [globalSearchError, setGlobalSearchError] = useState(false);
  const [searchedText, setSearchedText] = useState('');
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchUserDetails, setSearchUserDetails] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [userId, setUserId] = useState();
  const [displayUserDetails, setDisplayUserDetails] = useState(false);
  const [mobileSeach, setMobileSeach] = useState(false);
  const [open, setOpen] = React.useState(false);

  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const { role_details: roleDetails } =
    JSON.parse(localStorage.getItem('userDetails')) || {};

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

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
          tempData.push({
            id: items.id,
            name: items.name,
            erpId: items.erp_id,
            contact: items.contact,
          })
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
      const { is_superuser = false } = userDetails;
      setSuperUser(is_superuser);
    }
    if (containerRef.scrollTop > 50) {
      containerRef.scrollTop = 0;
    }
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    const list = ['rememberDetails'];
    Object.keys(localStorage).forEach((key) => {
      if (!list.includes(key)) localStorage.removeItem(key);
    });
    setIsLogout(true);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
    setProfileOpen(false);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
    setProfileOpen(!profileOpen);
  };

  useEffect(() => {
    if (isLogout) {
      window.location.href = '/';
      setIsLogout(false);
    }
  }, [isLogout]);

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      id={mobileMenuId}
      TransitionComponent={Grow}
      transitionDuration={500}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={profileOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={(e) => history.push('/profile')}>
        <IconButton aria-label='my profile' color='inherit'>
          <PermIdentityIcon color='primary' style={{ fontSize: '2rem' }} />
        </IconButton>
        <Typography color='secondary'>My Profile</Typography>
      </MenuItem>

      {superUser ? (
        <MenuItem onClick={(e) => history.push('/setting')}>
          <IconButton aria-label='settings' color='inherit'>
            <SettingsIcon color='primary' style={{ fontSize: '2rem' }} />
          </IconButton>
          <Typography color='secondary'>Settings</Typography>
        </MenuItem>
      ) : null}
      <MenuItem onClick={handleLogout}>
        <IconButton aria-label='logout button' color='inherit'>
          <ExitToAppIcon color='primary' style={{ fontSize: '2rem' }} />
        </IconButton>
        <Typography color='secondary'>Logout</Typography>
      </MenuItem>
    </Menu>
  );
  const AppBarProfileIcon = ({ imageSrc = '' }) => {
    const [isBrokenImg, setIsBrokenImg] = useState(false);

    if (!isBrokenImg && imageSrc) {
      return (
        <img
          src={imageSrc}
          alt=''
          className='profile_img'
          onError={() => setIsBrokenImg(true)}
        />
      );
    } else {
      return <AccountCircle color='primary' />;
    }
  };

  const { host } = new URL(axiosInstance.defaults.baseURL); // "dev.olvorchidnaigaon.letseduvate.com"
  const hostSplitArray = host.split('.');
  const subDomainLevels = hostSplitArray.length - 2;
  let domain = '';
  let subDomain = '';
  let subSubDomain = '';
  if (hostSplitArray.length > 2) {
    domain = hostSplitArray.slice(hostSplitArray.length - 2).join('');
  }
  if (subDomainLevels === 2) {
    subSubDomain = hostSplitArray[0];
    subDomain = hostSplitArray[1];
  } else if (subDomainLevels === 1) {
    subDomain = hostSplitArray[0];
  }

  const domainTobeSent = subDomain;

  useEffect(() => {
    const schoolData = localStorage.getItem('schoolDetails');
    if (schoolData === null) {
      const headers = {
        'x-api-key': 'vikash@12345#1231',
      };
      axios
        .get(`${endpoints.appBar.schoolLogo}?school_sub_domain_name=${domainTobeSent}`, {
          headers,
        })
        .then((response) => {
          const appBarLocalStorage = response.data.data;
          localStorage.setItem('schoolDetails', JSON.stringify(appBarLocalStorage));
          setCentralSchoolLogo(response.data.data.school_logo);
        })
        .catch((err) => console.log(err));
    } else {
      const logo = JSON.parse(schoolData);
      setCentralSchoolLogo(logo.school_logo);
    }
  }, []);

  return (
    <>
      <AppBar position='absolute' className={clsx(classes.appBar)}>
        <Toolbar className={classes.toolbar}>
          {isMobile && (
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
                  props.setDrawerOpen((prevState) => !prevState);
                }}
              >
                {props.drawerOpen ? (
                  <CloseIcon color='primary' />
                ) : (
                  <MenuIcon color='primary' />
                )}
              </IconButton>

              <IconButton className={classes.logoMobileContainer}>
                <img className={classes.logoMObile} src={logoMobile} alt='logo-small' />
                <Divider
                  variant='middle'
                  className={classes.verticalLine}
                  orientation='vertical'
                  flexItem
                />
                <img
                  src={centralSchoolLogo}
                  alt='logo'
                  style={{ maxHeight: '50px', maxWidth: '50px', objectFit: 'fill' }}
                />
              </IconButton>
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
            </Box>
          )}
          <Box px={7}>
            <img
              src={logo}
              alt='logo'
              style={{ height: '35px' }}
              className={clsx(classes.logoBtn, classes.desktopToolbarComponents)}
            />
          </Box>
          {isMobile ? null : <SearchBar/>}
          
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              aria-label='show more'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'
            >
              <AppBarProfileIcon imageSrc={roleDetails?.user_profile} />
            </IconButton>
            {centralSchoolLogo && (
              <IconButton
                className={classes.inputButton}
                disableRipple={true}
                aria-controls={mobileMenuId}
                aria-label='show school logo'
                color='inherit'
                aria-haspopup='true'
                size='small'
              >
                <img
                  src={centralSchoolLogo}
                  alt='logo'
                  className={clsx(
                    classes.schoolLogoBtn,
                    classes.desktopToolbarComponents
                  )}
                />
              </IconButton>
            )}
          </div>
          {!isMobile && (
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
          )}
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </>
  );
};

export default withRouter(Appbar);
