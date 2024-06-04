import React, { useEffect, useState, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, FormControl, MenuItem, AppBar, Grid } from '@material-ui/core';
import {
  DownOutlined,
  UserSwitchOutlined,
  UserOutlined,
  WalletOutlined,
  RedoOutlined,
} from '@ant-design/icons';
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
import endpointsV2 from 'v2/config/endpoints';
import axiosInstance from '../../config/axios';
import { logout } from '../../redux/actions';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import logoMobile from '../../assets/images/logo_mobile.png';
import orchidsLogo from '../../assets/images/orchids.png';
import SearchBar from './SearchBar';
import TopBarStyles from './TopBarStyles';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {
  currentSelectedYear,
  currentSelectedBranch,
  fetchAcademicYearList,
  fetchBranchList,
  selectedVersion,
} from '../../redux/actions/common-actions';
import ENVCONFIG from 'config/config';
import EventsIcon from 'assets/dashboardIcons/topbarIcons/events.svg';
import AcadCalendarIcon from 'v2/Assets/dashboardIcons/topbarIcons/acadCalendar.svg';
import AnnouncementIcon from 'v2/Assets/dashboardIcons/topbarIcons/announcements.svg';
import NotificationsIcon from 'assets/dashboardIcons/topbarIcons/notifications.svg';
import StaffIcon from 'assets/dashboardIcons/topbarIcons/defaultProfile.svg';
import RupeeSymbol from 'v2/Assets/dashboardIcons/topbarIcons/rupee-symbol.png';
import LiveHelpIcon from '@material-ui/icons/LiveHelpOutlined';
import { Avatar, List, Popover, Select, Skeleton, Space, Tooltip, message } from 'antd';
import CrmIcon from 'assets/images/crm.png';
import './styles.scss';
import { IsV2Checker } from 'v2/isV2Checker';
import { isMsAPI } from 'utility-functions';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { IsOrchidsChecker } from 'v2/isOrchidsChecker';
import { domain_name } from 'v2/commonDomain';
import CVbox from 'assets/images/cvbox.png';
import WalletIcon from 'assets/images/wallet.png';
import { AccessKey } from 'v2/cvboxAccesskey';
import { TrackerHandler } from 'v2/MixpanelTracking/Tracker';
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
  // const isOrchids =
  //   window.location.host.split('.')[0] === 'orchids' ||
  //     window.location.host.split('.')[0] === 'qa' || window.location.host.split('.')[0] === 'localhost:3000' || window.location.host.split('.')[0] === 'test' || window.location.host.split('.')[0] === 'dev'
  //     ? true
  //     : false;
  const isOrchids = IsOrchidsChecker();

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [centralSchoolLogo, setCentralSchoolLogo] = useState('');
  const [centralSchoolName, setcentralSchoolName] = useState('');
  const [superUser, setSuperUser] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  let { is_verified } = JSON.parse(localStorage.getItem('profileDetails')) || {};
  const [navigationData, setNavigationData] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const [isSwitch, setisSwitch] = useState(false);
  const [profileToShown, setProfileToShown] = useState([]);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  let userData = JSON.parse(localStorage.getItem('userDetails'));
  let apps = JSON.parse(localStorage.getItem('apps'));
  const { role_details: roleDetails } =
    JSON.parse(localStorage.getItem('userDetails')) || {};
  let selectedProfileDetails =
    JSON.parse(localStorage?.getItem('selectProfileDetails')) || {};
  let erpID = JSON.parse(localStorage.getItem('userDetails')) || {};

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const [profileOpen, setProfileOpen] = useState(false);
  const [academicYear, setAcademicYear] = useState('');
  const [branch, setBranch] = useState(selectedBranch?.branch?.branch_name);
  const profileDetails = JSON.parse(localStorage.getItem('profileDetails')) || {};
  const [profile, setProfile] = useState(selectedProfileDetails.name);
  const [hmac, setHmac] = useState(null);
  const getHmac = localStorage.getItem('hmac') || null;
  const getCVHmac = localStorage.getItem('CVhmac') || null;
  const cvUsersData = localStorage.getItem('cvusers') || null;
  const [cvboxUserLevel, setCvboxUserLevel] = useState(cvUsersData);
  const [storeWallet, setStoreWallet] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [storeWalletLoading, setStoreWalletLoading] = useState(false);
  const [showWalletPopover, setShowWalletPopover] = useState(false);

  const walletPrevData = JSON.parse(localStorage.getItem('walletLocal')) || null;
  const storewalletPrevData =
    JSON.parse(localStorage.getItem('storewalletLocal')) || null;

  useEffect(() => {
    if (walletPrevData?.amount && wallet == null) {
      setWallet(walletPrevData);
    }
    if (storewalletPrevData?.store_amount && storeWallet == null) {
      setStoreWallet(storewalletPrevData);
    }
  }, [walletPrevData, storewalletPrevData]);

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
  useEffect(() => {
    if (profileDetails) {
      let unselectedprofiles = profileDetails?.data?.filter(
        (item) => item.erp_id !== selectedProfileDetails?.erp_id
      );
      setProfileToShown(unselectedprofiles);
    }
    if (!cvboxUserLevel) {
      fetchUserAccessCvbox();
    }
  }, []);

  const fetchUserAccessCvbox = () => {
    axiosInstance
      .get(`${endpoints.academics.cvboxConfig}`)
      .then((res) => {
        console.log(res, 'usercv');
        setCvboxUserLevel(res.data.result);
        localStorage.setItem('cvusers', res.data.result);
        // setQuizAccess(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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

  const handlecvbox = () => {
    if (getCVHmac == 1) {
      message.error('User Not Registered in Careerbox');
    } else {
      window.open(`${ENVCONFIG?.apiGateway?.cvbox}/sso/?token=${getCVHmac}`, '_blank');
    }
  };

  const handleFinance = () => {
    window.location.href.includes('dheerajinternational')
      ? window.open(
          `https://formbuilder.ccavenue.com/live/dheeraj-international-school`,
          '_blank'
        )
      : window.open(
          `${ENVCONFIG?.apiGateway?.finance}/sso/finance/${token}#/auth/login`,
          '_blank'
        );
  };

  const handleCrm = () => {
    console.log(erpID, 'erp', typeof erpID);
    let onlyId = erpID?.erp;
    let encryptedID = encodeURIComponent(
      window.btoa(
        JSON.stringify({
          erp: onlyId.substr(0, onlyId?.length - 4),
          hmac: getHmac,
        })
      )
    );

    window.open(
      `${ENVCONFIG?.apiGateway?.crm}/sso-login/?token=${encryptedID}`,
      '_blank'
    );
  };

  useEffect(() => {
    if (getHmac == null && erpID?.erp && isOrchids) {
      fetchTokenCrm();
    }
    if (getCVHmac == null && getCVHmac != 1 && erpID?.erp && isOrchids) {
      fetchTokenCV();
    }
  }, [erpID]);

  const fetchTokenCrm = () => {
    let onlyId = erpID?.erp;
    let body = {
      erp: onlyId?.substr(0, onlyId.length - 4),
    };
    axios
      .post(`${endpoints.auth.crmHcmToken}`, body)
      .then((response) => {
        console.log(response, 'response');
        setHmac(response.data.result);
        localStorage.setItem('hmac', response.data.result);
      })
      .catch((error) => {
        console.error('error', error?.message);
      });
  };

  const fetchTokenCV = () => {
    let onlyId = erpID?.erp;
    let body = {
      erp_id: onlyId?.substr(0, onlyId.length - 4),
    };
    axios
      .post(`${endpoints.auth.CVhmac}`, body, {
        headers: {
          'Access-Api-Key': AccessKey,
        },
      })
      .then((response) => {
        console.log(response.data, 'cvhmac');
        if (response?.data?.data?.token) {
          setHmac(response.data.data.token);
          localStorage.setItem('CVhmac', response.data.data.token);
        }
      })
      .catch((error) => {
        console.error('error', error?.message);
        setHmac(1);
        localStorage.setItem('CVhmac', 1);
      });
  };

  const handleTicket = () => {
    window.open(
      `${ENVCONFIG?.apiGateway?.finance}/sso/ticket/${token}#/auth/login`,
      '_blank'
    );
  };
  const handleWalletCLick = () => {
    fetchStoreWalletData();
    fetchWalletData();
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
      {/* {profileDetails?.is_verified && (
        <>
          <MenuItem onClick={() => setisSwitch(!isSwitch)}>
            <IconButton aria-label='settings' color='inherit'>
              <SupervisorAccountIcon color='primary' style={{ fontSize: '2rem' }} />
            </IconButton>
            <Typography color='secondary'>Switch Profile2</Typography>
            {!isSwitch && <KeyboardArrowDownIcon />}
            {isSwitch && <KeyboardArrowUpIcon />}
          </MenuItem>
          {isSwitch &&
            profileToShown?.map((item) => (
              <MenuItem onClick={() => handleSwitchChange(item)}>
                {/* <IconButton aria-label='settings' color='inherit'>
            <SettingsIcon color='primary' style={{ fontSize: '2rem' }} />
          </IconButton> 
                <Typography color='secondary'>{item?.name}</Typography>
              </MenuItem>
            ))}
        </>
      )} */}
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
        .get(`${endpoints.appBar.schoolLogo}?school_sub_domain_name=${domain_name}`, {
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
    if (branchList === '' || branchList === null) {
      dispatch(fetchBranchList(acdemicCurrentYear?.id));
    }
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('isSessionChanged') === 'true') {
      dispatch(fetchBranchList(acdemicCurrentYear?.id));
    }
  }, [acdemicCurrentYear]);
  console.log({ showWalletPopover });

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

    if (window.location.pathname.includes('academic-calendar')) {
      history.push('/');
    }
    window.location.reload();
  };

  function reseteTheme() {
    const themecolors = [
      {
        theme_key: 'primary_color',
        theme_value: '#FF6B6B',
      },
      {
        theme_key: 'second_color',
        theme_value: '#014B7E',
      },
    ];
    localStorage.setItem('themeDetails', JSON.stringify(themecolors));
    axiosInstance
      .post(`${endpoints.themeAPI.school_theme}`, themecolors)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          // window.location.reload();
          setAlert('success', res.data.message);
        } else {
          setAlert('error', res.data.description);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const isV2 = IsV2Checker();

  const fetchERPSystemConfig = async (status) => {
    let data = (await JSON.parse(localStorage.getItem('userDetails'))) || {};
    const branch = data?.role_details?.branch;
    let payload = [];
    const result = axiosInstance
      .get(endpoints.checkAcademicView.isAcademicView)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          if (res?.data?.result[0] == 'True') {
            return true;
          } else if (res?.data?.result[0] == 'False') {
            return false;
          } else if (res?.data?.result[0]) {
            let resData = res?.data?.result[0];
            const selectedId = branch?.map((el) => el?.id);
            let checkData = resData?.some((item) => selectedId.includes(Number(item)));
            return checkData;
          }
        }
      });
    return result;
  };

  const handleSwitchChange = (item) => {
    sessionStorage.removeItem('branch_list');
    sessionStorage.removeItem('selected_branch');
    sessionStorage.removeItem('acad_session_list');
    sessionStorage.removeItem('acad_session');
    // let filterItem = profileDetails?.data?.filter((item) => item.name === (event.target.value || item?.name))
    let savedProfile =
      localStorage.setItem('selectProfileDetails', JSON.stringify(item)) || {};
    setProfile(item?.name);
    // setProfileName(event?.target?.value.name)
    const phone_number = JSON.parse(localStorage?.getItem('profileNumber')) || {};
    // localStorage.removeItem('userDetails');
    // localStorage.removeItem('navigationData');
    if (phone_number && item) {
      let payload = {
        contact: phone_number,
        erp_id: item?.erp_id,
        hmac: item?.hmac,
      };
      axiosInstance
        .post(
          typeof phone_number === 'object'
            ? endpoints.auth.siblingLogin
            : endpoints.auth.mobileLogin,
          payload
        )
        .then((result) => {
          if (result.status === 200) {
            localStorage.setItem('mobileLoginDetails', JSON.stringify(result));
            localStorage.setItem(
              'userDetails',
              JSON.stringify(result.data?.login_response?.result?.user_details)
            );
            localStorage.setItem(
              'navigationData',
              JSON.stringify(result.data?.login_response?.result?.navigation_data)
            );
            setAlert('success', result.data.message);
            isMsAPI();
            fetchERPSystemConfig(is_verified).then((res) => {
              let erpConfig;
              let userData = JSON.parse(localStorage.getItem('userDetails'));
              if (res === true || res.length > 0) {
                erpConfig = res;
                let refURL = localStorage.getItem('refURL');
                if (refURL) {
                  localStorage.removeItem('refURL');
                  window.location.href = refURL;
                } else if (userData?.user_level !== 4) {
                  history.push('/acad-calendar');
                } else {
                  history.push('/dashboard');
                }
              } else if (res === false) {
                erpConfig = res;
                history.push('/dashboard');
              } else {
                erpConfig = res;
                history.push('/dashboard');
              }
              userData['erp_config'] = erpConfig;
              localStorage.setItem('userDetails', JSON.stringify(userData));
              TrackerHandler('user_login');
              window.location.reload();
            });
          } else {
            setAlert('error', result.data.message);
            // setDisableLogin(false)
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  };

  const fetchStoreWalletData = () => {
    setStoreWalletLoading(true);
    axiosInstance
      .get(`${endpointsV2.finance.storeWalletList}?student_id=${erpID?.erp}`)
      .then((res) => {
        if (res?.data?.length > 0) {
          setStoreWallet(res?.data[0]);
          localStorage.setItem('storewalletLocal', JSON.stringify(res?.data[0]));
        }
      })
      .catch((err) => {
        console.log({ err });
      })
      .finally(() => {
        setStoreWalletLoading(false);
      });
  };

  const fetchWalletData = () => {
    setWalletLoading(true);
    axiosInstance
      .get(`${endpointsV2.finance.walletList}?student_id=${erpID?.erp}`)
      .then((res) => {
        if (res?.data?.length > 0) {
          setWallet(res?.data[0]);
          localStorage.setItem('walletLocal', JSON.stringify(res?.data[0]));
        }
      })
      .catch((err) => {
        console.log({ err });
      })
      .finally(() => {
        setWalletLoading(false);
      });
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
              alignItems='center'
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

              <Grid
                container
                rowSpacing={1}
                // columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                className='align-items-center'
              >
                <Grid item xs={2} sm={2} style={{ textAlign: 'center' }}>
                  <IconButton className={classes.logoMobileContainer}>
                    <img
                      className={classes.logoMObile}
                      src={centralSchoolLogo}
                      // alt='logo-small'
                    />
                    {/* <Divider
                      variant='middle'
                      className={classes.verticalLine}
                      orientation='vertical'
                      flexItem
                    /> */}
                    {/* <img
                      src={orchidsLogo}
                      alt='logo'
                      style={{
                        maxHeight: '38px',
                        maxWidth: '38px',
                        objectFit: 'fill',
                        fontSize: '12px',
                      }}
                    /> */}
                  </IconButton>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sm={6}
                  style={{
                    textAlign: 'center',
                    paddingTop: 10,
                    display: 'flex',
                  }}
                >
                  {/* <FormControl
                    variant='standard'
                    // sx={{ m: 1, minWidth: window.innerWidth < 576 ? 40 : 100 }}
                    className='flex-row'
                  > */}
                  <Select
                    onChange={handleBranchChange}
                    value={branch ? branch : branchList ? branchList[0] : ''}
                    className='th-primary th-bg-white th-br-4 th-12 text-left mr-1 w-50'
                    // style={{ width: window.innerWidth < 576 ? '80%' : '45%' }}
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
                    className='th-primary th-bg-white th-br-4 th-12 text-center'
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
                  {/* </FormControl> */}
                </Grid>
                <Grid
                  item
                  xs={4}
                  sm={4}
                  style={{ textAlign: 'center', paddingTop: 10, display: 'flex' }}
                >
                  <div className='ml-3 d-flex align-items-center'>
                    {userData?.user_level == 1 ||
                    userData?.user_level == 11 ||
                    userData?.user_level == 25 ||
                    userData?.user_level == 13 ||
                    userData?.user_level == 8 ||
                    userData?.user_level == 14 ||
                    userData?.user_level == 26 ||
                    userData?.user_level == 27 ||
                    userData?.is_superuser == true ? (
                      <>
                        {apps?.finance == true ? (
                          <>
                            {isMobile ? (
                              <IconButton
                                className={classes.grow}
                                style={{ margin: '0' }}
                                onClick={handleFinance}
                              >
                                <img src={RupeeSymbol} width='24px' />
                              </IconButton>
                            ) : null}
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                    {userData?.user_level == 1 ||
                    userData?.user_level == 25 ||
                    userData?.user_level == 13 ||
                    userData?.is_superuser == true ? (
                      <>
                        {isMobile ? (
                          <IconButton
                            className={classes.grow}
                            style={{ margin: '0' }}
                            onClick={handleTicket}
                          >
                            <LiveHelpIcon />
                          </IconButton>
                        ) : null}
                      </>
                    ) : (
                      <></>
                    )}

                    <div className={classes.sectionMobile}>
                      <IconButton
                        aria-label='show more'
                        aria-controls={mobileMenuId}
                        aria-haspopup='true'
                        onClick={handleMobileMenuOpen}
                        color='inherit'
                        className='p-0'
                      >
                        <MoreIcon />
                      </IconButton>
                    </div>
                  </div>
                </Grid>
              </Grid>
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
                        src={centralSchoolLogo}
                        // src={orchidsLogo}
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
                        src={centralSchoolLogo}
                        // src={orchidsLogo}
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

          <div className='d-flex align-items-center'>
            {isMobile ? null : (
              <div className={classes.grow} style={{ margin: '0' }}>
                <FormControl
                  className='d-flex flex-row align-items-center th-bg-white th-br-4 '
                  variant='standard'
                  sx={{ m: 1, minWidth: 100 }}
                >
                  <div className='px-2 th-black-2 th-14'> Select Branch:</div>
                  <Select
                    onChange={handleBranchChange}
                    value={branch ? branch : branchList ? branchList[0] : ''}
                    className='th-primary th-bg-white th-br-4 text-left th-topbar-select'
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
                    className='th-primary th-bg-white th-br-4 text-center'
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
            {(cvboxUserLevel?.includes(userData?.user_level?.toString()) && isOrchids) ||
            (userData?.is_superuser == true && isOrchids) ? (
              <>
                {isMobile ? null : (
                  <Tooltip title='Redirect to CVBox'>
                    <IconButton
                      className={classes.grow}
                      style={{ margin: '0' }}
                      onClick={handlecvbox}
                    >
                      <img src={CVbox} width='24px' />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            ) : (
              <></>
            )}
            {userData?.user_level == 1 ||
            userData?.user_level == 11 ||
            userData?.user_level == 25 ||
            userData?.user_level == 13 ||
            userData?.user_level == 8 ||
            userData?.user_level == 14 ||
            userData?.user_level == 26 ||
            userData?.user_level == 27 ||
            userData?.is_superuser == true ? (
              <>
                {apps?.finance == true ? (
                  <>
                    {isMobile ? null : (
                      <Tooltip title='Redirect to Finance'>
                        <IconButton
                          className={classes.grow}
                          style={{ margin: '0' }}
                          onClick={handleFinance}
                        >
                          <img src={RupeeSymbol} width='24px' />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
            {userData?.user_level == 1 ||
            userData?.user_level == 8 ||
            userData?.user_level == 13 ||
            userData?.user_level == 14 ||
            userData?.user_level == 35 ||
            userData?.is_superuser == true ? (
              <>
                {isMobile ? null : (
                  <Tooltip title='Grievances'>
                    <IconButton
                      className={classes.grow}
                      style={{ margin: '0' }}
                      onClick={handleTicket}
                    >
                      <LiveHelpIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            ) : (
              <></>
            )}
            {(userData?.user_level == 14 && isOrchids) ||
            (userData?.user_level == 8 && isOrchids) ? (
              <Tooltip title='Redirect to CRM'>
                <div className='py-2 th-icon-no-hover th-pointer' onClick={handleCrm}>
                  <img src={CrmIcon} width='24px' height='24px' />
                </div>
              </Tooltip>
            ) : (
              ''
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
                {/* <IconButton
                  className='py-2 th-icon-no-hover'
                  aria-label='show more'
                  aria-controls={mobileMenuId}
                  aria-haspopup='true'
                  // onClick={handleMobileMenuOpen}
                  color='inherit'
                > */}
                {/* <AppBarProfileIcon imageSrc={roleDetails?.user_profile} />
                 */}
                {/* <Link to='/acad-calendar'>
                    {window.location.pathname.includes('/acad-calendar') ? (
                      <img src={AcadCalendarIcon} width='20px' height='20px' />
                    ) : (
                      <img src={EventsIcon} width='20px' height='20px' />
                    )}
                  </Link> */}
                {/* </IconButton> */}
                <Tooltip title='Notifications'>
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
                </Tooltip>
                <div className={classes.sectionDesktop}>
                  {userData?.user_level == 13 ? (
                    <Popover
                      trigger={'click'}
                      visible={showWalletPopover}
                      onVisibleChange={(open) => {
                        if (open) {
                          setShowWalletPopover(true);
                        } else {
                          setShowWalletPopover(false);
                        }
                      }}
                      placement='bottomRight'
                      content={
                        <div style={{ width: 200 }}>
                          {walletLoading || storeWalletLoading ? (
                            <Space direction='vertical'>
                              {[1, 2, 3]?.map((el) => (
                                <Skeleton.Input
                                  active
                                  block
                                  style={{ height: 15, width: 200 }}
                                />
                              ))}
                            </Space>
                          ) : (
                            <>
                              <div className='d-flex justify-content-between'>
                                <div>Academic Wallet :</div>
                                <div className='th-fw-600'>₹ {wallet?.amount ?? 0}</div>
                              </div>
                              <div className='d-flex justify-content-between pb-2'>
                                <div>Store Wallet :</div>
                                <div className='th-fw-600'>
                                  ₹ {storeWallet?.store_amount ?? 0}
                                </div>
                              </div>
                              <div className='d-flex justify-content-center'>
                                <div
                                  className='px-2 py-1 th-br-8 th-bg-grey th-pointer th-12'
                                  onClick={() => {
                                    handleWalletCLick();
                                  }}
                                >
                                  <span className='px-2'>
                                    <RedoOutlined />
                                  </span>
                                  Refresh
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      }
                    >
                      <Tooltip title='Wallet'>
                        <div
                          className='th-primary d-flex align-items-center th-pointer px-1'
                          onClick={() => {
                            if (localStorage.getItem('storewalletLocal') === null) {
                              handleWalletCLick();
                            }
                          }}
                        >
                          {/* <WalletOutlined className='th-20 px-1' /> */}
                          <img width='24px' src={WalletIcon} />
                        </div>
                      </Tooltip>
                    </Popover>
                  ) : (
                    ''
                  )}
                  {profileDetails?.is_verified && (
                    <Popover
                      trigger={'click'}
                      placement='bottomRight'
                      content={
                        <List
                          style={{ width: 200 }}
                          itemLayout='horizontal'
                          dataSource={profileToShown}
                          renderItem={(item) => {
                            let imageLink = `${endpoints.profile.Profilestories}${
                              [
                                'orchids-stage.stage-vm.letseduvate.com',
                                'localhost',
                              ]?.includes(window.location.hostname)
                                ? 'dev'
                                : 'prod'
                            }/media/${item?.profile}`;
                            return (
                              <List.Item
                                onClick={() => {
                                  handleSwitchChange(item);
                                }}
                                className='th-pointer'
                              >
                                <List.Item.Meta
                                  avatar={
                                    <Avatar
                                      size={42}
                                      src={imageLink}
                                      icon={
                                        item?.profile === '' ? <UserOutlined /> : null
                                      }
                                    />
                                  }
                                  title={
                                    <div className='th-truncate-2'>{item?.name}</div>
                                  }
                                  description={
                                    <span className='th-12'>{item?.branch_name}</span>
                                  }
                                />
                              </List.Item>
                            );
                          }}
                        />
                      }
                    >
                      <div className='text-center th-pointer px-2'>
                        <div className='th-primary'>
                          <UserSwitchOutlined className='px-1 th-16' />
                        </div>
                        <div className='th-10 th-grey'> {profile?.split(' ')[0]}</div>
                      </div>
                    </Popover>
                  )}
                  <Tooltip title='Profile'>
                    <IconButton
                      className='py-2 th-icon-no-hover'
                      aria-label='show more'
                      aria-controls={mobileMenuId}
                      aria-haspopup='true'
                      onClick={handleMobileMenuOpen}
                      color='inherit'
                    >
                      {/* <AppBarProfileIcon imageSrc={roleDetails?.user_profile} /> */}

                      {/* {profileDetails?.is_verified ? (
                      <Typography>
                        {profile}
                        <KeyboardArrowDownIcon />
                      </Typography>
                    ) : ( */}
                      <img
                        width='20px'
                        height='20px'
                        src={
                          roleDetails?.user_profile
                            ? roleDetails?.user_profile
                            : StaffIcon
                        }
                      />
                      {/* )} */}
                    </IconButton>
                  </Tooltip>
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
