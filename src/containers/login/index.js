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
  if (localStorage.getItem('userDetails') && localStorage.getItem('navigationData'))
    history.push('/dashboard');
  const theme = useTheme();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (isFetchThemeRequired())
      fetchThemeApi()
        .then(() => {
          const response = themeGenerator();
          setTheme(() => response);
        })
        .catch(() => {});
  }, []);

  const tabStyle = {
    width: '100%',
    margin: '3% auto',
    borderRadius: '10px 10px 0 0',
  };

  return (
    <>
      {!loading && (
        <Container component='main' maxWidth='xs'>
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
              Sign In
            </Typography>
            <TabPanel
              tabValue={tabValue}
              setTabValue={setTabValue}
              tabValues={['Password', 'OTP']}
              fullWidth={true}
              style={tabStyle}
            />
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={tabValue}
            >
              <LoginForm history={history} setLoading={setLoading} />
              <LoginOTPForm history={history} setLoading={setLoading} />
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
    </>
  );
}

export default SignIn;
