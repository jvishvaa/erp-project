import React, { useState, useContext, useEffect, useRef } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { IconButton } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
// import { useLocation, useParams } from 'react-router-dom';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import './login.css';
import { login, aolLogin } from '../../redux/actions';
import Loader from '../../components/loader/loader';
import {
  fetchThemeApi,
  isFetchThemeRequired,
  themeGenerator,
} from '../../utility-functions/themeGenerator';

function TermsAndCondition(props) {
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

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function SignIn({ onLogin, history, aolOnLogin, setTheme }) {
  if (localStorage.getItem('userDetails') && localStorage.getItem('navigationData'))
    history.push('/profile');

  const loginButton = useRef(null);
  const [uname, pass, checked] =
    JSON.parse(localStorage.getItem('rememberDetails')) || [];
  const [username, setUsername] = useState('' || uname);
  const [password, setPassword] = useState('' || pass);
  const [check, setCheck] = useState(false || checked);
  const [passwordFlag, setPasswordFlag] = useState(true);
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  // const location = useLocation();
  const [loading, setLoading] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const erpSearch = urlParams.get('erp');

  const handleToggler = () => {
    setPasswordFlag((prev) => !prev);
  };

  const handleLogin = () => {
    if (erpSearch !== null) {
      aolOnLogin(erpSearch).then((response) => {
        if (response?.isLogin) {
          history.push('/online-class/attend-class');
        } else {
          setAlert('error', response?.message);
        }
      });
    } else if (username && password) {
      const params = {
        username,
        password,
      };
      onLogin(params).then((response) => {
        if (response?.isLogin) {
          // fetchThemeApi();
          history.push('/profile');
        } else {
          setAlert('error', response?.message);
        }
      });
    }

    if (check) {
      localStorage.setItem(
        'rememberDetails',
        JSON.stringify([username, password, check])
      );
    } else {
      localStorage.removeItem('rememberDetails');
    }
  };

  const handleForgot = () => {
    history.push('/forgot');
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
    if (erpSearch !== null) {
      setLoading(true);
      handleLogin();
    }
  }, [erpSearch]);

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
            <form
              className={classes.form}
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                id='email'
                label='User Name'
                name='email'
                autoComplete='email'
                autoFocus
                className='passwordField'
                value={username}
                inputProps={{ maxLength: 40 }}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                name='password'
                label='Password'
                type={passwordFlag ? 'password' : 'text'}
                id='password'
                className='passwordField'
                autoComplete='current-password'
                value={password}
                inputProps={{ maxLength: 20 }}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                InputProps={{
                  maxLength: 20,
                  endAdornment: (
                    <IconButton onClick={handleToggler}>
                      {passwordFlag ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value='remember'
                    color='primary'
                    checked={check}
                    onClick={(e) => setCheck(!check)}
                  />
                }
                label='Remember Me'
              />
              <Button
                fullWidth
                type='submit'
                variant='contained'
                color='primary'
                style={{ color: 'white' }}
                ref={loginButton}
                className={classes.submit}
                onClick={() => {
                  handleLogin();
                }}
              >
                Sign In
              </Button>

              <div
                onClick={() => {
                  handleForgot();
                }}
                className='forgot'
              >
                <Typography color='secondary'>Forgot Password ?</Typography>
              </div>
            </form>
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

const mapStateToProps = (state) => ({
  loginInProgress: state.auth.loginInProgress,
});

const mapDisptachToProps = (dispatch) => ({
  onLogin: (params) => {
    return dispatch(login(params));
  },
  aolOnLogin: (params) => {
    return dispatch(aolLogin(params));
  },
});

export default connect(mapStateToProps, mapDisptachToProps)(SignIn);
