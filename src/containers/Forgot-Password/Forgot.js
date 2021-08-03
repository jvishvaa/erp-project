import React, { useState, useContext, useEffect, useRef } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import './forgot.css';
import { login, aolLogin } from '../../redux/actions';
import Loader from '../../components/loader/loader';
import axiosInstance from '../../config/axios';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      {new Date().getFullYear()}, K12 Techno Services Pvt. Ltd.
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
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Forgot({ onLogin, history, aolOnLogin }) {
  if (localStorage.getItem('userDetails') && localStorage.getItem('navigationData'))
    history.push('/');

  const loginButton = useRef(null);
  const [uname, pass, checked] =
    JSON.parse(localStorage.getItem('rememberDetails')) || [];
  const [erpid, setErpid] = useState('' || uname);
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const erpSearch = urlParams.get('erp');

  const handleSubmit = () => {
    if (!erpid) return;
    axiosInstance
      .get(`/erp_user/forgot-password/?erp_id=${erpid}`)
      .then((response) => {
        const { data = {} } = response || {};
        const {
          status_code = 400,
          message = 'Something went wrong! Please try again later.',
        } = data || {};
        setAlert(status_code === 200 ? 'success' : 'error', message);
      })
      .catch((error) => {
        setAlert('error', error?.response?.data?.message);
      });
  };

  const handleLogin = () => {
    history.push('/');
  };

  useEffect(() => {
    if (erpSearch !== null) {
      setLoading(true);
      handleSubmit();
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
              Forgot Password
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
                id='ERP_ID'
                label='ERP ID'
                name='ERP ID'
                autoComplete='ERP ID'
                autoFocus
                className='passwordField'
                value={erpid}
                inputProps={{ maxLength: 40 }}
                onChange={(e) => {
                  setErpid(e.target.value);
                }}
              />

              <Button
                fullWidth
                type='submit'
                variant='contained'
                color='primary'
                ref={loginButton}
                className={classes.submit}
                onClick={() => {
                  handleSubmit();
                }}
              >
                Submit
              </Button>

              <div
                onClick={() => {
                  handleLogin();
                }}
                className='forgot'
              >
                Sign in
              </div>
            </form>
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      )}
      {loading && <Loader />}
    </>
  );
}

// const mapStateToProps = (state) => ({
//   loginInProgress: state.auth.loginInProgress,
// });

// const mapDisptachToProps = (dispatch) => ({
//   onLogin: (params) => {
//     return dispatch(login(params));
//   },
//   aolOnLogin: (params) => {
//     return dispatch(aolLogin(params));
//   },
// });

// export default connect(mapStateToProps, mapDisptachToProps)(Forgot);

export default Forgot;
