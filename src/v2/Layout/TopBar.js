import React, { useEffect, useState, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, FormControl, MenuItem, AppBar, Grid } from '@material-ui/core';
import { DownOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, Typography } from '@material-ui/core';
import Grow from '@material-ui/core/Grow';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import { logout } from '../../redux/actions';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import logoMobile from '../../assets/images/logo_mobile.png';
import orchidsLogo from '../../assets/images/orchids.png';
import SearchBar from './SearchBar';
import TopBarStyles from './TopBarStyles';
import {
  currentSelectedYear,
  currentSelectedBranch,
  fetchAcademicYearList,
  fetchBranchList,
} from '../../redux/actions/common-actions';
import ENVCONFIG from 'config/config';
import EventsIcon from 'assets/dashboardIcons/topbarIcons/events.svg';
import AcadCalendarIcon from 'v2/Assets/dashboardIcons/topbarIcons/acadCalendar.svg';
import AnnouncementIcon from 'v2/Assets/dashboardIcons/topbarIcons/announcements.svg';
import NotificationsIcon from 'assets/dashboardIcons/topbarIcons/notifications.svg';
import StaffIcon from 'assets/dashboardIcons/topbarIcons/defaultProfile.svg';
import RupeeSymbol from 'v2/Assets/dashboardIcons/topbarIcons/rupee-symbol.png';
import { Select } from 'antd';
import './styles.scss';
// import { Item } from 'semantic-ui-react';
const { Option } = Select;

const Appbar = ({ children, history, ...props }) => {
  const classes = TopBarStyles();
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  let academicYearlist = useSelector(
    (state) => state.commonFilterReducer.academicYearList
  );
  let acdemicCurrentYear = useSelector((state) => state.commonFilterReducer.selectedYear);
  let branchList = useSelector((state) => state.commonFilterReducer.branchList);
  let selectedBranch = useSelector((state) => state.commonFilterReducer.selectedBranch);

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [centralSchoolLogo, setCentralSchoolLogo] = useState('');
  const [centralSchoolName, setcentralSchoolName] = useState('');
  const [superUser, setSuperUser] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [navigationData, setNavigationData] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);

  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  let userData = JSON.parse(localStorage.getItem('userDetails'));
  let apps = JSON.parse(localStorage.getItem('apps'));
  const { role_details: roleDetails } =
    JSON.parse(localStorage.getItem('userDetails')) || {};

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const [profileOpen, setProfileOpen] = useState(false);
  const [academicYear, setAcademicYear] = useState('');
  const [branch, setBranch] = useState(selectedBranch?.branch?.branch_name);

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

  useEffect(() => {
    if (academicYearlist === null) {
      dispatch(fetchAcademicYearList());
    }
  }, []);

  useEffect(() => {
    setBranch(selectedBranch?.branch?.branch_name);
  }, [selectedBranch]);

  useEffect(() => {
    if (academicYearlist && acdemicCurrentYear) {
      setAcademicYear(acdemicCurrentYear?.session_year);
    }
  }, [acdemicCurrentYear, academicYearlist]);

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

  const handleChange = (event) => {
    setAcademicYear(event);

    let acdemicCurrentYear;
    academicYearlist.forEach((item) => {
      if (item.session_year === event) {
        acdemicCurrentYear = item;
      }
    });
    // dispatch(resetSelectedBranch({}));
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

  const handleBranchChange = (event) => {
    setBranch(event);
    let selectedBranch;

    branchList.forEach((item) => {
      if (item.branch.branch_name === event) {
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
                <Grid item xs={6} style={{ textAlign: 'center' }}>
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
                      //   src={centralSchoolLogo}
                      src={orchidsLogo}
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
                  style={{ textAlign: 'center', paddingTop: 10, display: 'flex' }}
                >
                  <FormControl variant='standard' sx={{ m: 1, minWidth: 120 }}>
                    <Select
                      onChange={handleBranchChange}
                      value={branch ? branch : branchList ? branchList[0] : ''}
                      className='th-primary th-bg-grey th-br-4  text-left'
                      placement='bottomRight'
                      bordered={false}
                      showSearch={true}
                      suffixIcon={<DownOutlined className='th-primary' />}
                      dropdownMatchSelectWidth={false}
                      optionFilterProp='children'
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {branchList?.map((item) => {
                        return (
                          <Option value={item?.branch?.branch_name}>
                            {item?.branch?.branch_name}
                          </Option>
                        );
                      })}
                    </Select>
                    <Select
                      onChange={handleChange}
                      value={academicYear}
                      className='th-primary th-bg-grey th-br-4 text-center'
                      placement='bottomRight'
                      bordered={false}
                      showSearch={true}
                      suffixIcon={<DownOutlined className='th-primary' />}
                      dropdownMatchSelectWidth={false}
                      optionFilterProp='children'
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {academicYearlist?.map((year) => (
                        <Option value={year.session_year}>{year.session_year}</Option>
                      ))}
                    </Select>
                  </FormControl>
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
            <div className='d-flex align-items-center'>
              <div>
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
                        //   src={centralSchoolLogo}
                        src={orchidsLogo}
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

              {isMobile ? null : <SearchBar />}
            </div>
          ) : (
            <div className='d-flex align-items-center'>
              <div>
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
                        //   src={centralSchoolLogo}
                        src={orchidsLogo}
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
              {isMobile ? null : <SearchBar />}
            </div>
          )}
          {/* {isMobile ? null : <SearchBar />} */}
          <div className='d-flex'>
            {isMobile ? null : (
              <div className={classes.grow} style={{ margin: '0' }}>
                <FormControl
                  className='d-flex flex-row align-items-center th-bg-white th-br-4'
                  variant='standard'
                  sx={{ m: 1, minWidth: 100 }}
                >
                  <div className='px-2 th-black-2 th-14'> Select Branch:</div>
                  <Select
                    onChange={handleBranchChange}
                    value={branch ? branch : branchList ? branchList[0] : ''}
                    className='th-primary th-bg-grey th-br-4 text-left'
                    placement='bottomRight'
                    bordered={false}
                    showSearch={true}
                    suffixIcon={<DownOutlined className='th-primary' />}
                    dropdownMatchSelectWidth={false}
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {branchList?.map((item) => {
                      return (
                        <Option value={item?.branch?.branch_name}>
                          {item?.branch?.branch_name}
                        </Option>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
            )}

            {isMobile ? null : (
              <div className={classes.grow} style={{ margin: '0' }}>
                <FormControl
                  className='d-flex flex-row align-items-center th-bg-white th-br-4'
                  variant='standard'
                  sx={{ m: 1, minWidth: 100 }}
                >
                  <div className='px-2 th-black-2'> Academic Year:</div>
                  <Select
                    onChange={handleChange}
                    value={academicYear}
                    className='th-primary th-bg-grey th-br-4 text-center'
                    placement='bottomRight'
                    bordered={false}
                    showSearch={true}
                    suffixIcon={<DownOutlined className='th-primary' />}
                    dropdownMatchSelectWidth={false}
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {academicYearlist?.map((year) => (
                      <Option value={year.session_year}>{year.session_year}</Option>
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
                        <img src={RupeeSymbol} width='24px' />
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

            {isMobile ? null : (
              <>
                {' '}
                {/* <IconButton
                  className='py-2 th-icon-no-hover'
                  aria-label='show more'
                  aria-controls={mobileMenuId}
                  aria-haspopup='true'
                  // onClick={handleMobileMenuOpen}
                  color='inherit'
                >
                  <img src={MusicIcon} width='20px' height='20px' />
                </IconButton> */}
                <IconButton
                  className='py-2 th-icon-no-hover'
                  aria-label='show more'
                  aria-controls={mobileMenuId}
                  aria-haspopup='true'
                  // onClick={handleMobileMenuOpen}
                  color='inherit'
                >
                  {/* <AppBarProfileIcon imageSrc={roleDetails?.user_profile} />
                   */}
                  <Link to='/acad-calendar'>
                    {window.location.pathname.includes('/acad-calendar') ? (
                      <img src={AcadCalendarIcon} width='20px' height='20px' />
                    ) : (
                      <img src={EventsIcon} width='20px' height='20px' />
                    )}
                  </Link>
                </IconButton>
                <IconButton
                  className='py-2 th-icon-no-hover'
                  aria-label='show more'
                  aria-controls={mobileMenuId}
                  aria-haspopup='true'
                  // onClick={handleMobileMenuOpen}
                  color='inherit'
                >
                  <Link to='/announcement-list'>
                    {window.location.pathname.includes('/announcement-list') ? (
                      <img src={AnnouncementIcon} width='20px' height='20px' />
                    ) : (
                      <img src={NotificationsIcon} width='20px' height='20px' />
                    )}
                  </Link>
                </IconButton>
                <div className={classes.sectionDesktop}>
                  <IconButton
                    className='py-2 th-icon-no-hover'
                    aria-label='show more'
                    aria-controls={mobileMenuId}
                    aria-haspopup='true'
                    onClick={handleMobileMenuOpen}
                    color='inherit'
                  >
                    {/* <AppBarProfileIcon imageSrc={roleDetails?.user_profile} /> */}

                    <img
                      width='20px'
                      height='20px'
                      src={
                        roleDetails?.user_profile ? roleDetails?.user_profile : StaffIcon
                      }
                    />
                  </IconButton>
                </div>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </>
  );
};

export default withRouter(Appbar);
