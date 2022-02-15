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
import { login, aolLogin, isMsAPI } from '../../redux/actions';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';

function LoginForm(props) {
  const { onLogin, isMsAPI, aolOnLogin, setLoading, history } = props;
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
  const [disableLogin, setDisableLogin] = useState(false);

  // const UdaanLogin = () => {
  //   axiosInstance
  //     .post(endpoints.sureLearning.login, {
  //       username: username,
  //     })
  //     .then((result) => {
  //       console.log(result);
  //       localStorage.setItem('udaanDetails', JSON.stringify(result.data));
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  const fetchERPSystemConfig = async (status) => {
    let data = await JSON.parse(localStorage.getItem('userDetails')) || {};
    const { branch } = data?.role_details;
    let payload = [];
    const result = axiosInstance
      .get(endpoints.checkAcademicView.isAcademicView)
      .then((res) => {
        if (res?.data?.status_code === 200) {
          if (res?.data?.result == 'True') {
            return true;
          } else if (res?.data?.result == 'False') {
            return false;
          } else if (res?.data?.result.length > 0) {
            branch.forEach((element) => {
              if (res.data.result[0].toString().includes(element.id)) {
                payload.push(element.id);
              }
            });
            return payload;
          }
        }
      });
    return result;
  };
  const handleLogin = () => {
    // UdaanLogin();
    if (erpSearch !== null) {
      setDisableLogin(true);
      aolOnLogin(erpSearch, false).then((response) => {
        if (response?.isLogin) {
          isMsAPI();
          history.push('/online-class/attend-class');
        } else {
          setAlert('error', response?.message);
          setDisableLogin(false);
        }
      });
    } else if (username && password) {
      setDisableLogin(true);
      const params = {
        username,
        password,
      };
      onLogin(params).then((response) => {
        if (response?.isLogin) {
          // history.push('/profile');
          isMsAPI();
          fetchERPSystemConfig(response?.isLogin).then((res) => {
            let erpConfig;
            if(res === true || res.length > 0) {
              erpConfig = res;
              history.push('/acad-calendar');
            } else if(res === false) {
              erpConfig = res;
              history.push('/dashboard');
            } else {
              erpConfig = res;
              history.push('/dashboard');
            }
            let userData = JSON.parse(localStorage.getItem('userDetails'));
            userData['erp_config'] = erpConfig;
            localStorage.setItem(
              'userDetails',
              JSON.stringify(userData)
            );
          });
        } else {
          setAlert('error', response?.message);
          setDisableLogin(false);
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
          disabled={disableLogin}
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
  isMsAPI: () => {
    return dispatch(isMsAPI());
  },
});

export default connect(mapStateToProps, mapDisptachToProps)(LoginForm);
