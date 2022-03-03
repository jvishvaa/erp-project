import React, { useState, useEffect, useContext } from 'react';
import { useStyles } from './useStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { IconButton } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { connect } from 'react-redux';
import { login, handleSendOtp, isMsAPI } from '../../redux/actions';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';

const OTP_REGEX = /^[0-9]{0,6}$/;

function LoginOTPForm({ onLogin, history, isMsAPI }) {
  const classes = useStyles();
  const [attempts, setAttempts] = useState(null);
  const [timer, setTimer] = useState();
  const [uname = ''] = JSON.parse(localStorage.getItem('rememberDetails')) || [];
  const [username, setUsername] = useState('' || uname);
  const [otp, setOtp] = useState('');
  const [passwordFlag, setPasswordFlag] = useState(true);
  const { setAlert } = useContext(AlertNotificationContext);
  const [disableLogin, setDisableLogin] = useState(false);

  const handleOtp = (event) => {
    const otpValue = event.target.value;
    if (otpValue.match(OTP_REGEX)) {
      setOtp(otpValue);
    }
  };
  const fetchERPSystemConfig = async (status) => {
    let data = await JSON.parse(localStorage.getItem('userDetails')) || {};
    const { branch } = data?.role_details;
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
            let resData = res?.data?.result[0]
          
            const selectedId = branch?.map((el) => el?.id);
            let checkData = resData?.some(item => selectedId.includes(Number(item)))
            console.log(checkData, "check");
            return checkData;
          }
        }
      });
    return result;
  };

  const handleOTPLogin = () => {
    if (username && otp.length === 6) {
      const params = {
        erp_id: username,
        otp,
      };
      setDisableLogin(true);
      onLogin(params, true).then((response) => {
        if (response?.isLogin) {
          isMsAPI();
          fetchERPSystemConfig(response?.isLogin).then((res) => {
            let erpConfig;
            let userData = JSON.parse(localStorage.getItem('userDetails'));
            if(res === true || res.length > 0) {
              erpConfig = res;
              if(userData?.user_level === 11 || userData?.user_level ===  13){
                history.push('/acad-calendar');
                console.log(userData?.user_level , "level");
                } else {
                history.push('/dashboard');
                }
            } else if(res === false) {
              erpConfig = res;
              history.push('/dashboard');
            } else {
              erpConfig = res;
              history.push('/dashboard');
            }
            userData['erp_config'] = erpConfig;
            localStorage.setItem(
              'userDetails',
              JSON.stringify(userData)
            );
          });
        }
         else {
          setAlert('error', response?.message);
          setDisableLogin(false);
        }
      });
    }
  };

  const handleSend = () => {
    const params = { erp_id: username };
    handleSendOtp(params).then((response) => {
      setTimer(response?.expiryTime);
      if (response?.status === 200) {
        setAttempts(response.attempts);
        // setTimer(response.attempts === 0 ? 0 : +response?.expiration_in_sec);
        setAlert('success', response?.message, 4000);
      } else {
        setAttempts(null);
        setAlert('error', response?.message, 5000);
      }
    });
  };

  useEffect(() => {
    let timeout = '';
    if (timer > 0 && attempts > 0)
      timeout = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    return () => clearTimeout(timeout);
  }, [timer, attempts]);

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
          disabled={attempts !== null}
          inputProps={{ maxLength: 40 }}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        {attempts !== null && (
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='otp'
            label='OTP'
            type={passwordFlag ? 'password' : 'text'}
            id='otp'
            className='passwordField'
            autoComplete='current-otp'
            value={otp}
            inputProps={{ maxLength: 6, pattern: '^[0-9]{6}$' }}
            onChange={handleOtp}
            InputProps={{
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
        )}
        {attempts !== null ? (
          <>
            <Button
              fullWidth
              type='submit'
              variant='contained'
              color='primary'
              style={{ color: 'white' }}
              className={classes.otpButton}
              disabled={disableLogin}
              onClick={() => {
                handleOTPLogin();
              }}
            >
              Sign In
            </Button>
            {timer > 0 ? (
              <Typography variant='body1' color='textSecondary' align='center'>
                Resend OTP in{' '}
                <Typography variant='span' color='secondary' align='center'>
                  {timer}
                </Typography>
                {timer === 1 ? ' second.' : ' seconds.'}
              </Typography>
            ) : (
              <>
                {attempts > 0 ? (
                  <Typography
                    className={classes.resendOtpButton}
                    variant='body1'
                    color='secondary'
                    align='center'
                    onClick={() => handleSend()}
                  >
                    Resend OTP
                  </Typography>
                ) : (
                  <Typography variant='body1' color='error' align='center'>
                    {attempts === 0 && 'No attempts remaining.'}
                  </Typography>
                )}
              </>
            )}
          </>
        ) : (
          <Button
            fullWidth
            type='submit'
            variant='contained'
            color='primary'
            style={{ color: 'white' }}
            className={classes.otpButton}
            onClick={() => handleSend()}
          >
            Send OTP
          </Button>
        )}
      </form>
    </div>
  );
}

const mapDisptachToProps = (dispatch) => ({
  onLogin: (params, isOtpLogin) => {
    return dispatch(login(params, isOtpLogin));
  },
  isMsAPI: () => {
    return dispatch(isMsAPI());
  },
});

export default connect(null, mapDisptachToProps)(LoginOTPForm);
