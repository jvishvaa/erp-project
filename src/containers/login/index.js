import React, { useState, useContext, useEffect } from 'react';
import { useStyles } from './useStyles';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LoginForm from './login-form';
import LoginOTPForm from './login-otp-form';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';
import Loader from '../../components/loader/loader';
import {
  fetchThemeApi,
  isFetchThemeRequired,
  themeGenerator,
} from '../../utility-functions/themeGenerator';
import TabPanel from '../../components/tab-panel';
import SwipeableViews from 'react-swipeable-views';
import { parseJwt } from '../../utility-functions';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import LoginMobileForm from './login-mobile-form';
import axios from 'axios';
import endpoints from 'v2/config/endpoints';
import LetsEduvateLogo from '../../assets/images/logo.png';
function TermsAndCondition() {
  return (
    <Typography variant='body1' color='textSecondary' align='center'>
      By proceeding, you agree to our
      <Link
        style={{ cursor: 'pointer', textDecoration: 'none' }}
        onClick={() => (window.location.pathname = '/terms-condition')}
      >
        &nbsp;Terms and Conditions&nbsp;
      </Link>
      and
      <Link
        style={{ cursor: 'pointer', textDecoration: 'none' }}
        onClick={() => (window.location.pathname = '/privacy-policy')}
      >
        &nbsp;Privacy Policy
      </Link>
      .
    </Typography>
  );
}

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright  '}
      &copy; {new Date().getFullYear()}, K12 Techno Services Pvt. Ltd.
    </Typography>
  );
}

function SignIn({ history, setTheme }) {
  if (localStorage.getItem('userDetails') && localStorage.getItem('navigationData')) {
    const { erp_config } = JSON.parse(localStorage.getItem('userDetails'));
    if (erp_config === true || erp_config?.length > 0) {
      history.push('/acad-calendar');
    } else if (erp_config === false) {
      history.push('/dashboard');
    } else {
      history.push('/dashboard');
    }
  }
  const theme = useTheme();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [schoolInfo, setSchoolInfo] = useState();
  const { setAlert } = useContext(AlertNotificationContext);
  const searchParams = new URLSearchParams(window.location.search);
  const redirectionToken = searchParams.get('redirect_key'); //token
  const online_class_id = +searchParams.get('online_class_id');
  const user_level = +searchParams.get('user_level');
  const question_paper_id = +searchParams.get('question_paper_id');
  const redirectionView = +searchParams.get('wb_view'); // 1-android , 2-ios
  const pathIdentifier = +searchParams.get('path_value'); // 1-view-orchadio , 2-manage-orchadio
  var splitedUrlAddress = window.location.origin.split('.');
  const subDomain = splitedUrlAddress[0]?.split('//')[1];
  const fetchSchoolDetails = () => {
    axios
      .get(`${endpoints.schoolDetails}?sub_domain=${subDomain}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
          // Authorization: '',
        },
      })
      .then((response) => {
        setSchoolInfo(response?.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (isFetchThemeRequired())
      fetchThemeApi()
        .then(() => {
          const response = themeGenerator();
          setTheme(() => response);
        })
        .catch(() => {});
  }, []);

  useEffect(() => {
    if (redirectionToken) {
      const redirectionDetails = parseJwt(redirectionToken);
      localStorage.setItem(
        'userDetails',
        JSON.stringify({
          ...redirectionDetails,
          token: redirectionToken,
          user_level: user_level,
        })
      );
      if (pathIdentifier === 1) {
        history.push(`/orchadio/view-orchadio/?wb_view=${redirectionView}`);
      } else if (pathIdentifier === 2) {
        history.push(`/orchadio/manage-orchadio/?wb_view=${redirectionView}`);
      } else if (pathIdentifier === 3) {
        history.push(
          `/erp-online-class/${online_class_id}/${question_paper_id}/pre-quiz/?wb_view=${redirectionView}`
        );
        // window.location.reload()
      }
    }
  }, [redirectionToken]);

  let isLoggedOut = null;
  isLoggedOut = localStorage.getItem('loggedOut');
  useEffect(() => {
    if (isLoggedOut === '412') {
      setAlert('error', 'Login Expired. Please Login Again!');
      localStorage.clear();
    }
  }, []);
  useEffect(() => {
    fetchSchoolDetails();
  }, []);

  const tabStyle = {
    width: '100%',
    margin: '3% auto',
    borderRadius: '10px 10px 0 0',
  };

  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      {!loading && (
        <Container
          component='main'
          maxWidth='sm'
          // style={{ overflow: 'auto', height: '100vh' }}
        >
          <CssBaseline />
          <div className={classes.paper}>
            <div className='row py-2 text-center'>
              <div className='col-12'>
                <img
                  src={
                    schoolInfo?.school_logo ? schoolInfo?.school_logo : LetsEduvateLogo
                  }
                  alt='image'
                  style={{
                    height: schoolInfo?.school_logo ? 80 : 50,
                    objectFit: 'fill',
                  }}
                />
              </div>
              <div className='col-12 mt-2'>
                <div className='th-24 th-fw-500 text-uppercase'>
                  {schoolInfo?.school_name}
                </div>
                {/* <div className='th-14 th-fw-400 th-black-1'>
                  {schoolInfo?.school_address}
                </div> */}
              </div>
            </div>
            {/* <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar> */}
            <div className='pt-2 th-20 th-fw-500'>Sign In</div>
            <TabPanel
              tabValue={tabValue}
              setTabValue={setTabValue}
              tabValues={['Password', 'OTP', 'Mobile']}
              fullWidth={true}
              style={tabStyle}
            />
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={tabValue}
            >
              <LoginForm history={history} setLoading={setLoading} />
              <LoginOTPForm history={history} setLoading={setLoading} />
              <LoginMobileForm history={history} setLoading={setLoading} />
            </SwipeableViews>
          </div>
          <Box mt={4}>
            <TermsAndCondition />
          </Box>
          <Box mt={4}>
            <Copyright />
          </Box>
        </Container>
      )}
      {loading && <Loader />}
    </div>
  );
}

export default SignIn;
