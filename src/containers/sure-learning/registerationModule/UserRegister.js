import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Container from '@material-ui/core/Container';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import urls from '../url';

// import Snackbar from "@material-ui/core/Snackbar";
// import SnackbarContent from "@material-ui/core/SnackbarContent";
// import CloseIcon from "@material-ui/icons/Close";
import { useAlert } from '../hoc/alert/alert';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      display: 'flex',
      flexWrap: 'wrap',
      margin: ' 0 auto',
      width: '100%',
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
  // input: {
  //   color: "white",
  //   "&::placeholder": {
  //     textOverflow: "ellipsis !important",
  //     color: "blue"
  //   }
  // }
}));

const errorStyles = makeStyles({
  error: {
    '& label.Mui-focused': {
      color: 'red',
    },
    '& .MuiInputLabel-root': {
      color: 'red',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: 'red',
    },
  },
});

function UserRegister() {
  const classes = useStyles();
  const errorClass = errorStyles();
  const alert = useAlert();

  // const [open, setOpen] = useState(false);

  // states for register form
  const [userName, setUserName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [dropValue, setDropValue] = useState('');
  const [password, setPassword] = useState('');
  const [roleValues, setroleValues] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('');

  // color change for validation
  const [usernamecolor, setusernameColor] = useState(true);
  const [mobilecolor, setmobileColor] = useState(true);
  const [emailcolor, setemailColor] = useState(true);
  const [rolecolor, setroleColor] = useState(true);
  const [passwordcolor, setpasswordColor] = useState(true);
  const [roleName, setroleName] = useState('');
  const [dropValues, setDropValues] = useState('');

  // const [namecolor, setnameColor] = useState(true);

  // const PORT_NUM = "http://localhost:8000";

  // const [value, setValue] = useState("female");

  const handleRoleChange = (e) => {
    setroleName(e.target.value);
    setRole(e.target.name);
  };

  useEffect(() => {
    async function getDropData() {
      const data = {
        role: roleName,
      };
      const response = await fetch(urls.getWantBecome, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
          'Content-Type': 'application/json',
          // Authorization: "Bearer ${auth.personal_info.token}"
        },
      });
      const getData = await response.json();
      return getData;
    }

    getDropData().then((data) => {
      setDropValues(data);
      // console.log(dropValues);
    });
  }, [roleName]);
  // if (roleName) {

  // console.log(dropValues)
  // }

  // dynamic reason add

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // const handleClose = e => {
  //   setOpen(false);
  // };

  // const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    setDropValue(event.target.value);
  };

  // POST To Submit Register Form Data
  async function postRegData() {
    const data = {
      username: userName,
      password,
      email,
      role: parseInt(role, 10),
      want_to_become: dropValue,
      phone_number: mobile,
    };
    const response = await fetch(urls.nonOrchidsregistration, {
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

  const checkBlank = () => {
    if (userName.length === 0) {
      setusernameColor(false);
      return true;
    }
    if (mobile.length === 0) {
      setmobileColor(false);
      return true;
    }
    if (password.length === 0) {
      setpasswordColor(false);
      return true;
    }
    if (email.length === 0) {
      setemailColor(false);
      return true;
    }
    if (roleValues.length === 0) {
      setroleColor(false);
      return true;
    }
    setusernameColor(true);
    setpasswordColor(true);
    setroleColor(true);
    setmobileColor(true);
    return false;
  };

  const registerHandle = (e) => {
    e.preventDefault();

    if (checkBlank()) {
      alert.warning('Enter All Fields');
    } else {
      postRegData().then((data) => {
        if (data.response === 'user created successfully') {
          alert.success('Successfully Registered');
        } else {
          alert.error('Already Registered');
        }
      });
      // setName("");
      setPassword('');
      setShowPassword(false);
      setMobile('');
      // setroleValues("");
      setroleName('');
      setEmail('');
      setUserName('');
      setDropValues('');
      // props.modalClose();
    }
  };

  // GET to add Type of Roles

  useEffect(() => {
    async function getRoleData() {
      const response = await fetch(urls.registrationRoles, {
        method: 'GET', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const getData = await response.json();
      return getData;
    }

    getRoleData().then((data) => {
      // console.log(data);
      setroleValues(data);
    });
  }, []);

  // Get what the user wants to become
  // useEffect(() => {

  // }, []);

  return (
    <>
      {/* <Paper className={classes.paper}> */}
      <div
        style={{
          background: 'linear-gradient(to right,#bc4e9c ,#f80759)',
          height: '100vh',
        }}
      >
        <Container
          maxWidth="sm"
          style={{ textAlign: 'center', paddingTop: '12vh' }}
        >
          <LockOpenIcon style={{ color: 'white' }} />
          <Typography
            variant="h4"
            style={{
              textAlign: 'center',
              // background: "linear-gradient(to right,#bc4e9c ,#f80759)",
              color: 'white',
              fontWeight: 'bold',
              // padding: "5px 0px"
            }}
            className="formHeadAlign"
            color="primary"
            component="h2"
          >
            Registration 
          </Typography>
          <div className={classes.root}>
            <Grid container spacing={3}>
              {/* <Grid item xs={12}>
              <TextField
                fullWidth
                id='registerName'
                label='Your Name'
                // variant='outlined'
                className={namecolor ? classes.normal : errorClass.error}
                autoFocus
                inputRef={regNameRef}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Grid> */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="userName"
                  label="User Name"
                  helperText="You Can use your Email or Mobile number as User Name"
                  className={usernamecolor ? classes.normal : errorClass.error}
                  // inputRef={regNameRef}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Grid>
              <br />

              <Grid item xs={12}>
                <TextField
                  type="number"
                  id="registerMobile"
                  label="Mobile Number"
                  className={mobilecolor ? classes.normal : errorClass.error}
                  fullWidth
                  value={mobile}
                  // inputRef={regMobileRef}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="email"
                  id="registerEmail"
                  label="Email Id"
                  className={emailcolor ? classes.normal : errorClass.error}
                  fullWidth
                  value={email}
                  // inputRef={regMobileRef}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <br />
              <Grid item xs={12}>
                <div style={{ textAlign: 'left', color: 'white' }}>
                  <FormLabel
                    component="legend"
                    style={{ color: 'white', fontWeight: 'bold' }}
                  >
                    I am a
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-label="role"
                    name="role1"
                    className={rolecolor ? classes.normal : errorClass.error}
                    value={roleName}
                    onChange={handleRoleChange}
                  >
                    {roleValues
                      && roleValues.map((roleData) => (
                        <FormControlLabel
                          value={roleData.name}
                          control={<Radio />}
                          label={roleData.name}
                          name={roleData.id.toString()}
                          key={roleData.id}
                        />
                      ))}
                  </RadioGroup>
                </div>
                {dropValues !== '' ? (
                  <Grid item xs={12}>
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      // className={classes.normal}
                    >
                      <InputLabel
                        id="demo-controlled-open-select-label"
                        style={{ color: 'white' }}
                      >
                        What You Want to Become ?
                        {' '}
                      </InputLabel>
                      <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        value={dropValue}
                        onChange={handleChange}
                        style={{ color: 'white' }}
                      >
                        {dropValues
                          && dropValues.map((dropItem) => (
                            <MenuItem value={dropItem.id} key={dropItem.id}>
                              {dropItem.course_category_name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                ) : (
                  ''
                )}
              </Grid>
              <br />
              <Grid item xs={12}>
                <TextField
                  type={showPassword ? 'text' : 'password'}
                  id="registerPassword"
                  label="Enter Password"
                  className={passwordcolor ? classes.normal : errorClass.error}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  // inputRef={regPasswordRef}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <br />
              <br />
              <Button
                type="submit"
                id=""
                variant="contained"
                value="Submit"
                color="primary"
                fullWidth
                onClick={registerHandle}
                style={{
                  background: 'white',
                  color: 'black',
                }}
              >
                Submit
              </Button>
              <br />
            </Grid>
          </div>
          {/* <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
      >
        <SnackbarContent
          style={{
            backgroundColor: snackBar ? "Red" : "Green"
          }}
          action={[
            <IconButton
              key='close'
              aria-label='close'
              color='inherit'
              className={classes.close}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          ]}
          message={
            snackBar ? (
              <span id='message-id' className='message'>
                Please Enter All The Fields
              </span>
            ) : (
              <span id='message-id1' className='message'>
                User Registerd Successfully
              </span>
            )
          }
        />
      </Snackbar> */}
        </Container>
      </div>
    </>
  );
}

export default UserRegister;
