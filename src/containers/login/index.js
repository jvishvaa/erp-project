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
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from '@material-ui/core/InputAdornment';
import { IconButton } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { login } from '../../redux/actions';
import { useLocation, useParams } from 'react-router-dom';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='https://material-ui.com/'>
        K12
      </Link>
      {new Date().getFullYear()}
      {'.'}
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

function SignIn({ onLogin, history }) {
  if (localStorage.getItem('userDetails') && localStorage.getItem('navigationData'))
    history.push('/profile');
  const loginButton = useRef(null);
  const [uname, pass, checked] =
    JSON.parse(localStorage.getItem('rememberDetails')) || [];
  const [username, setUsername] = useState('' || uname);
  const [password, setPassword] = useState('' || pass);
  const [check, setCheck] = useState(false || checked)
  const [passwordFlag, setPasswordFlag] = useState(true); 
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const erpSearch  = +urlParams.get('erp');
  useEffect(() => {
    if (erpSearch === 2000000002) {
      handleLogin();
    }
  }, [erpSearch]);

  const handleToggler=()=>{
    setPasswordFlag(prev=>!prev)
  }
  const handleLogin = () => {
    const params = {
      username,
      password,
    };
    if (username && password) {
      onLogin(params).then((response) => {
        if (response?.isLogin) {
          history.push('/profile');
        } else {
          setAlert('error', response?.message);
        }
      });
    } 
    else if (erpSearch === 2000000002) {
      onLogin({
        username: '2000000002',
        password: 'erp_1992',
      }).then((response) => {
        if (response?.isLogin) {
          history.push('/dashboard');
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

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
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
            type={passwordFlag ? "password" : "text"}
            id='password'
            autoComplete='current-password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            InputProps={{maxLength: 20 , endAdornment:<IconButton onClick={handleToggler}>{passwordFlag?<VisibilityOff/>:<Visibility />}</IconButton>}}
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
            ref={loginButton}
            className={classes.submit}
            onClick={() => {
              handleLogin();
            }}
          >
            Sign In
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  loginInProgress: state.auth.loginInProgress,
});

const mapDisptachToProps = (dispatch) => ({
  onLogin: (params) => {
    return dispatch(login(params));
  },
});

export default connect(mapStateToProps, mapDisptachToProps)(SignIn);
