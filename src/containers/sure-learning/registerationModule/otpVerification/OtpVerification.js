/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useContext } from 'react';
// import TextField from '@material-ui/core/TextField';
// import Visibility from '@material-ui/icons/Visibility';
// import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// import Grid from '@material-ui/core/Grid'
import Grid from '@material-ui/core/Grid';
// import LockOpenIcon from "@material-ui/icons/LockOpen";
// import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import Loader from '../../hoc/loader';
import endpoints from 'config/endpoints';
import OtpInput from "react-otp-input";

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      margin: ' 0 auto',
      width: '100%',
      textAlign: 'center',
    },
    '& .MuiIconButton-root': {
      color: 'white',
    },
  },

  normal: {
    '& label.Mui-focused': {
      color: 'white',
    },
    '&  .MuiInputLabel-root': {
      color: 'white',
    },
    '& .MuiInput-underline': {
      borderBottomColor: 'white',
    },
    '& .MuiInput-input': {
      color: 'white',
    },

    '& .MuiInput-underline:before': {
      borderBottomColor: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& .MuiFormHelperText-root': {
      color: 'white',
    },
  },

  errorClass: {
    '& .MuiInput-underline:after': {
      borderBottomColor: 'red',
    },
  },
  paper: {
    padding: theme.spacing(2),
    margin: '50px auto',
    border: '1px solid blue',
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: 500,
  },
  close: {
    padding: theme.spacing(0.5),
  },
  warning: {
    backgroundColor: 'amber',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  formHeadAlign: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
}));

// const errorStyles = makeStyles({
//   error: {
//     '& label.Mui-focused': {
//       color: 'red',
//     },
//     '& .MuiInputLabel-root': {
//       color: 'red',
//     },
//     '& .MuiInput-underline:before': {
//       borderBottomColor: 'red',
//     },
//   },
// });
function OtpVerification(props) {
  const classes = useStyles();
  // const errorClass = errorStyles();
  const { setAlert } = useContext(AlertNotificationContext);

  const emailRef = useRef();
  const passRef = useRef();

  // const [showPassword, setShowPassword] = useState(false);
  // const [passwordcolor] = useState(true);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  // const [prop,setProp]=useState(props);
  const email = JSON.parse(localStorage.getItem('email'))

  let loader = null;
  if (loading) {
    loader = <Loader open />;
  }



  const loginData = (data) => {
    localStorage.setItem('UserLogin', JSON.stringify(data));
    localStorage.setItem('roleType', JSON.stringify(data.personal_info.role));
    // const roleType = data.personal_info.role;
    localStorage.setItem('isLoggedIn', true);
    // console.log(roleType);
    // window.location.reload();
    // if (
    //   roleType === "ContentWriter" ||
    //   roleType === "SuperAdmin" ||
    //   roleType === "Admin"
    // ) {
    //   window.location.href = "/";
    //   // console.log(roleType);
    // } else {
    //   window.location.href = "/";
    // }
    window.location.href = '/';
  };

  const loginHandler = (e) => {
    e.preventDefault();
    const username = emailRef.current.value;
    // eslint-disable-next-line no-shadow
    const password = passRef.current.value;
    const data = {
      username,
      password,
    };
    if (!username.length) {
      setAlert('warning', 'Enter Your UserName');
      return;
    } if (!password.length) {
      setAlert('warning', 'Enter Your Password');
      return;
    }
    setLoading(true);

    async function postLoginData() {
      const response = await fetch(endpoints.sureLearning.userLogin, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const fetchData = await response.json();
      return fetchData;
    }

    postLoginData().then((dataInfo) => {
      if (dataInfo !== 'invalid_credentials' && dataInfo !== 'please_register' && dataInfo !== 'user_is_inactive') {
        setAlert('success', 'You are successfully logged in');
        setLoading(false);
        loginData(dataInfo);
        return;
      } if (dataInfo === 'please_register') {
        setLoading(false);
        setAlert('error', "The erp and password that you've entered doesn't match our records, sign up for an account");
      } else if (dataInfo === 'user_is_inactive') {
        setLoading(false);
        setAlert('error', 'User is Inactive, cannot Login');
      } else {
        setLoading(false);
        setAlert('error', 'Incorrect password, please try again');
      }
      // console.log(dataInfo);
    });
  };
  // if(localStorage.getItem("roleType") !== null) {
  //   window.location.href = "/adminside";
  // }
  const handleClose = () => {
    props.handleClose();
  };
  const fetchSearch = (e) => {
    if (e.keyCode === 13) {
      loginHandler(e);
    }
  };
  // const handleChange = otp => this.setState({ otp });
  // const handleClickShowPassword = (e) => {
  //     setOtp(e.target.value);
  //   };
  async function submitOtp() {
    // console.log("data check"+email+otp)
    const response = await fetch(endpoints.sureLearning.verifyotp, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify({ email: email, otp: otp }), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const fetchData = await response.json();
    // status=response.status
    return fetchData;
  }
  let status
  async function sendEmailForOtp() {
    const response = await fetch(endpoints.sureLearning.sendOtp, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify({ email: email }), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const fetchData = await response.json();
    status = response.status
    return fetchData;
  }

  const resendOtp = () => {
    // const localStorage.getItem('email', JSON.stringify(profileData.email));

    sendEmailForOtp()
      .then((data) => {

        if (status === 200) {
          setAlert('success', data.response)
          //  console.log("succ")
        } else {
          setAlert('warning', data.response)
        }
      })
      .catch(() => {
        setAlert('warning', "Something went wrong")
      })
  };

  const SubmitOtp = () => {
    // console.log("otp hai"+otp);
    // console.log(prop.handleClose)  
    // {prop.handleClose}
    submitOtp()
      .then((data) => {
        // console.log("data status"+status)
        if (data.response === "success") {
          setAlert('success', data.response)
          handleClose()
        } else {
          setAlert('warning', data.response)
        }
      })
      .catch(() => {
        setAlert('warning', "Something went wrong")
      })
  };


  const clear = () => {
    setOtp("");
  }
  return (
    <div
      style={{ margin: '0 auto', textAlign: 'center' }}
      className={classes.root}
    >
      {/* <VpnKeyIcon style={{ color: 'white' }} /> */}
      <Typography
        variant="h4"
        style={{
          textAlign: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}
        className="formHeadAlign"
        component="h2"
      >
        Email Verification
      </Typography>
      <br />
      <hr style={{ borderBottom: '4px solid white' }} />
      <br />
      <br />
      <br />
      <Grid xs={12}>
        <OtpInput
          value={otp}
          onChange={(e) => setOtp(e)}
          // onChange={this.handleChange}
          numInputs={4}
          separator={<span></span>}
          shouldAutoFocus
          isInputNum
          inputStyle={{
            height: "3em",
            width: "2em",
            border: 'none',
            borderBottom: '2px solid',
            borderBottomColor: 'whiteSmoke',
            marginRight: '0.5em',
            borderRadius: '3px',
            fontWeight: 'bold'
          }}
        />
        <Button
          variant="primary"
          onClick={resendOtp}
          style={{
            background: 'white',
            color: 'black',
            marginLeft: '5%',
            height: 'auto'
            // fontWeight: 'bold',
          }}
        >Resend</Button>
      </Grid>
      <br />
      <br />
      <Grid xs={6}>
        <Button
          type="submit"
          id=""
          variant="contained"
          value="Submit"
          color="primary"
          onKeyDown={fetchSearch}
          // fullWidth
          onClick={SubmitOtp}
          style={{
            background: 'white',
            color: 'black',
            fontWeight: 'bold',
          }}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          onClick={clear}
          style={{
            background: 'white',
            color: 'black',
            fontWeight: 'bold',
            marginLeft: '30%'
          }}
        >
          Clear
        </Button>
      </Grid>
      {loader}
    </div>
  );
}

export default OtpVerification;

