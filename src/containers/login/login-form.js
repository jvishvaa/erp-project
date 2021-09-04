import React, { useState, useEffect, useContext } from 'react';
import { useStyles } from './useStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { IconButton } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { connect } from 'react-redux';
import { login, aolLogin } from '../../redux/actions';

function LoginForm(props) {
  const { onLogin, aolOnLogin, setLoading, history } = props;
  const classes = useStyles();
  const [uname, pass, checked] =
    JSON.parse(localStorage.getItem('rememberDetails')) || [];
  const [username, setUsername] = useState('' || uname);
  const [password, setPassword] = useState('' || pass);
  const [check, setCheck] = useState(false || checked);
  const [passwordFlag, setPasswordFlag] = useState(true);
  const { setAlert } = useContext(AlertNotificationContext);
  const urlParams = new URLSearchParams(window.location.search);
  const erpSearch = urlParams.get('erp');

  const handleLogin = () => {
    if (erpSearch !== null) {
      aolOnLogin(erpSearch, false).then((response) => {
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
          // history.push('/profile');
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

  const handleForgot = () => {
    history.push('/forgot');
  };

  useEffect(() => {
    if (erpSearch !== null) {
      setLoading(true);
      handleLogin();
    }
  }, [erpSearch]);

  return (
    <div>
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
          label='ERP'
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
              <IconButton
                style={{ padding: '0 0 0 2%' }}
                onClick={() => setPasswordFlag((prev) => !prev)}
              >
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
          className={classes.forgot}
        >
          <Typography color='secondary'>Forgot Password ?</Typography>
        </div>
      </form>
    </div>
  );
}

const mapStateToProps = (state) => ({
  loginInProgress: state.auth.loginInProgress,
});

const mapDisptachToProps = (dispatch) => ({
  onLogin: (params, isOtpLogin) => {
    return dispatch(login(params, isOtpLogin));
  },
  aolOnLogin: (params) => {
    return dispatch(aolLogin(params));
  },
});

export default connect(mapStateToProps, mapDisptachToProps)(LoginForm);
