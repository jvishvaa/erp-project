import React, { useEffect, useState, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Divider, FormControl, MenuItem, Select, AppBar, Grid } from '@material-ui/core';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
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
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import logoMobile from '../../assets/images/logo_mobile.png';
import SearchBar from './SearchBar';
import AppSearchBarUseStyles from './AppSearchBarUseStyles';
import {
  currentSelectedYear,
  currentSelectedBranch,
  resetSelectedBranch,
  fetchAcademicYearList,
  fetchBranchList,
  selectedVersion,
} from '../../redux/actions/common-actions';
import ENVCONFIG from 'config/config';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import './styles.scss';
import { Switch } from 'antd';

const Appbar = ({ children, history, ...props }) => {
  const classes = AppSearchBarUseStyles();
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [centralSchoolLogo, setCentralSchoolLogo] = useState('');
  const [centralSchoolName, setcentralSchoolName] = useState('');
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
  const [academicYearDropdown, setAcademicYearDropdown] = useState([]);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  let userData = JSON.parse(localStorage.getItem('userDetails'));
  let apps = JSON.parse(localStorage.getItem('apps'));
  let branchList = useSelector((state) => state.commonFilterReducer.branchList);
  let selectedBranch = useSelector((state) => state.commonFilterReducer.selectedBranch);
  const { role_details: roleDetails } =
    JSON.parse(localStorage.getItem('userDetails')) || {};
  const [branch, setBranch] = useState(selectedBranch?.branch?.branch_name);

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
  const [academicYear, setAcademicYear] = useState('');

  useEffect(() => {
    const navigationData = localStorage.getItem('navigationData');
    if (navigationData) {
      setNavigationData(JSON.parse(navigationData));
    }
    let userDetails = localStorage.getItem('userDetails');
    if (!userDetails) {
      if (window.location.pathname != '/') {
        localStorage.setItem('refURL', window.location.pathname);
      }
      history.push('/');
      // window.location.href = '/' ;
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

  const handleFinance = () => {
    window.open(`${ENVCONFIG?.apiGateway?.finance}/sso/${token}#/auth/login`, '_blank');
  };

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

  let host;
  if (
    window.location.href.includes('localhost') ||
    window.location.href.includes('ui-revamp') ||
    window.location.href.includes('dev')
  ) {
    host = 'dev.olvorchidnaigaon.letseduvate.com';
  } else {
    host = new URL(axiosInstance.defaults.baseURL).host;
  }
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
          setcentralSchoolName(response.data.data.school_name);
        })
        .catch((err) => console.log(err));
    } else {
      const logo = JSON.parse(schoolData);
      setCentralSchoolLogo(logo.school_logo);
      setcentralSchoolName(logo.school_name);
    }
  }, []);

  let academicYearlist = useSelector(
    (state) => state.commonFilterReducer.academicYearList
  );
  let acdemicCurrentYear = useSelector((state) => state.commonFilterReducer.selectedYear);

  useEffect(() => {
    if (academicYearlist === null) {
      dispatch(fetchAcademicYearList());
    }
  }, []);

  useEffect(() => {
    if (academicYearlist && acdemicCurrentYear) {
      setAcademicYear(acdemicCurrentYear?.session_year);
    }
  }, [acdemicCurrentYear, academicYearlist]);

  const handleBranchChange = (event) => {
    setBranch(event.target.value);
    let selectedBranch;

    branchList.forEach((item) => {
      if (item.branch.branch_name === event.target.value) {
        selectedBranch = item;
      }
    });
    dispatch(currentSelectedBranch(selectedBranch));
    sessionStorage.setItem('selected_branch', JSON.stringify(selectedBranch));
    localStorage.setItem('isV2', selectedBranch?.isV2);
    if (window.location.pathname.includes('academic-calendar')) {
      history.push('/');
    }
    window.location.reload();
  };
  const handleChange = (event) => {
    setAcademicYear(event.target.value);
    let acdemicCurrentYear;
    academicYearlist.forEach((item) => {
      if (item.session_year === event.target.value) {
        acdemicCurrentYear = item;
      }
    });
    sessionStorage.setItem('selected_branch', '');
    sessionStorage.setItem('isSessionChanged', true);
    dispatch(currentSelectedYear(acdemicCurrentYear));
    dispatch(fetchBranchList(acdemicCurrentYear?.id));
    sessionStorage.setItem('acad_session', JSON.stringify(acdemicCurrentYear));
    if (window.location.pathname.includes('academic-calendar')) {
      history.push('/');
    }
    window.location.reload();
  };
  useEffect(() => {
    if (branchList === '') {
      dispatch(fetchBranchList(acdemicCurrentYear?.id));
    }
  }, []);
  useEffect(() => {
    if (sessionStorage.getItem('isSessionChanged') === 'true') {
      dispatch(fetchBranchList(acdemicCurrentYear?.id));
    }
  }, [acdemicCurrentYear]);
  useEffect(() => {
    setBranch(selectedBranch?.branch?.branch_name);
  }, [selectedBranch]);

  function reseteTheme() {
    const themecolors =
      [
        {
          theme_key: "primary_color",
          theme_value: "#FF6B6B",
        },
        {
          theme_key: "second_color",
          theme_value: "#014B7E",
        }
      ]
    localStorage.setItem("themeDetails", JSON.stringify(themecolors));
    axiosInstance
      .post(`${endpoints.themeAPI.school_theme}`, themecolors)
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          window.location.reload()
          setAlert('success', res.data.message);
        } else {
          setAlert('error', res.data.description);
        }
      }).catch((error) => {
        console.log(error);
      });
  }

  const handleVersion = (status) => {
    dispatch(selectedVersion(status));
    localStorage.setItem('selectedVersion', status);
    reseteTheme();
  };
  const isV2 = useSelector(
    (state) =>
      state.commonFilterReducer.selectedBranch?.isV2 &&
      state.commonFilterReducer.selectedVersion
  );
  const isBranchV2 = useSelector(
    (state) => state.commonFilterReducer.selectedBranch?.isV2
  );
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

              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6} style={{ textAlign: 'center', paddingTop: '10px' }}>
                  <IconButton className={classes.logoMobileContainer}>
                    <img
                      className={classes.logoMObile}
                      src={logoMobile}
                      alt='logo-small'
                    />
                    <Divider
                      variant='middle'
                      className={classes.verticalLine}
                      orientation='vertical'
                      flexItem
                    />
                    <img
                      src={centralSchoolLogo}
                      alt='logo'
                      style={{
                        maxHeight: '38px',
                        maxWidth: '38px',
                        objectFit: 'fill',
                        fontSize: '12px',
                      }}
                    />
                  </IconButton>
                </Grid>
                <Grid
                  item
                  xs={6}
                  style={{
                    textAlign: 'center',
                    paddingTop: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <FormControl variant='standard'>
                      <Select
                        onChange={handleBranchChange}
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={branch ? branch : branchList ? branchList[0] : ''}
                        className={classes.branch}
                        inputProps={{
                          'aria-label': 'Without label',
                          classes: {
                            icon: 'th-select-icon',
                          },
                        }}
                        IconComponent={KeyboardArrowDownIcon}
                        MenuProps={{
                          anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                          },
                          transformOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                          },
                        }}
                      >
                        {branchList?.map((item) => (
                          <MenuItem value={item?.branch?.branch_name}>
                            <>{item?.branch?.branch_name}</>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl variant='standard'>
                      <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={academicYear}
                        onChange={handleChange}
                        // className={classes.year}
                        inputProps={{
                          'aria-label': 'Without label',
                          classes: {
                            icon: 'th-select-icon',
                          },
                        }}
                        IconComponent={KeyboardArrowDownIcon}
                      >
                        {academicYearlist?.map((year) => (
                          <MenuItem value={year.session_year}>
                            {year.session_year}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <IconButton onClick={handleFinance} style={{ padding: '1%' }}>
                      <MonetizationOnIcon />
                    </IconButton>
                  </div>
                </Grid>
              </Grid>

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
          {props.drawerOpen ? (
            <div style={{ display: 'flex' }}>
              <Box pr={1} pl={38} component='span'>
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
              </Box>
            </div>
          ) : (
            <div style={{ display: 'flex' }}>
              <Box pr={1} pl={7}>
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
              </Box>
            </div>
          )}
          {isMobile ? null : <SearchBar />}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isBranchV2 ? (
              <Switch
                checked={isV2}
                checkedChildren='Older Version'
                unCheckedChildren='Newer Version'
                onChange={handleVersion}
              />
            ) : null}

            {isMobile ? null : (
              <div className={classes.grow} style={{ margin: '0' }}>
                <FormControl variant='standard' sx={{ m: 1, minWidth: 100 }}>
                  <Select
                    onChange={handleBranchChange}
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={branch ? branch : branchList ? branchList[0] : ''}
                    className={classes.branch}
                    inputProps={{
                      'aria-label': 'Without label',
                      classes: {
                        icon: 'th-select-icon-grey',
                      },
                    }}
                    MenuProps={{
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                    }}
                  >
                    {branchList?.map((item) => (
                      <MenuItem value={item?.branch?.branch_name}>
                        <>{item?.branch?.branch_name}</>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl variant='standard' sx={{ m: 1, minWidth: 100 }}>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={academicYear}
                    onChange={handleChange}
                    className={classes.year}
                  >
                    {academicYearlist?.map((year) => (
                      <MenuItem value={year.session_year}>{year.session_year}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}

            {userData?.user_level == 1 ||
            userData?.user_level == 25 ||
            userData?.user_level == 13 ||
            userData?.is_superuser == true ? (
              <>
                {apps?.finance == true ? (
                  <>
                    {isMobile ? null : (
                      <IconButton
                        className={classes.grow}
                        style={{ margin: '0' }}
                        onClick={handleFinance}
                      >
                        <MonetizationOnIcon />
                      </IconButton>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}

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
            </div>
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
