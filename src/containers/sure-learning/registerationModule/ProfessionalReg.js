/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
/* eslint-disable camelcase */
import React, {
  // Fragment,
  useState,
  useEffect,
  // useRef,
  useContext
} from 'react';
import "./style.css";
import {
  Dialog,
  DialogContent,
  DialogActions,
  makeStyles,
  Radio,
  FormHelperText,
  Checkbox,
  ListItemText,
  Input,
} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Container from '@material-ui/core/Container';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import VerifiedIcon from '@material-ui/icons/VerifiedUser';
import endpoints from 'config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import OtpVerification from './otpVerification/OtpVerification';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import Backdrop from '@material-ui/core/Backdrop';
import { useHistory } from 'react-router';
import CreateclassProvider from '../../../containers/online-class/create-class/create-class-context/create-class-state';
import {
  Grid,
  TextField,
  Button,
  SwipeableDrawer,
  CircularProgress,
  Switch,
  FormControlLabel,
  Typography,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import moment from 'moment';
import './register.scss';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: '0px auto',
    boxShadow: 'none',
  },
  filterDataHeader: {
    color: theme.palette.secondary.main,
    fontSize: "16px",
    width: "95%",
    display: "flex",
    margin: "0 auto",
    textTransform: "capitalize",
    padding: "30px 0 15px 5px",
  },
  // divfilterData:{
  //   '& :not':{
  //     '&::after':{
  //       content: " ",
  //       height: "6px",
  //       width: "6px",
  //       backgroundColor:theme.palette.secondary.main,
  //       borderRadius: "50%",
  //       display: "inline-block",
  //       margin: "0 10px",
  //       verticalAlign: "baseline",
  //     }

  //   }
  // }
}));


const registerData = {
  first_name: '',
  last_name: '',
  username: '',
  phone_number: '',
  joining_date: '',
  total_experience: '',
  email: '',
  password: '',
  confirmPassword: '',
  roles_category: '',
  branch: [],
  course_type: [],
  course_sub_type: [],
  gender: '',
  school: '',
};


const registerError = {
  firstnameError: '',
  lastnameError: '',
  usernameError: '',
  phoneNumberError: '',
  emailError: '',
  passwordError: '',
  want_to_becomeError: '',
  roleError: '',
  confirmPasswordError: '',
  schoolError: '',
  // registerError: ""
};
const otherEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const orchidsEmail = /^([a-zA-Z0-9_\.\-])+\@(([Oo][Rr][Cc][Hh][Ii][Dd][Ss])+\.)+([Ee][Dd][Uu]+\.)+([Ii][Nn])+$/;
const otherFilterErp = /[^2][0-9]{10}/;
const orchidsFilterErp = /(20)[0-9][0-9][0-9]{7}/;


function UserRegister() {
  const auth = JSON.parse(localStorage.getItem('userDetails'))
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails'));
  const classes = useStyles();
  const [profileData, setProfileData] = useState(registerData);
  const history = useHistory();

  const [subjectList, setSubjects] = useState('');
  const [branchList, setBranch] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dataLoading, setdataLoading] = useState(false);
  const [errorData, setError] = useState(registerError);
  const [gradeList, setGradeList] = useState('');
  const [roleList, setRolesList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [roleType, setRoleType] = useState(false);
  const [selectOrganisation, setSelectOrganisation] = useState(true);
  const [defaultOrganisation, setDefaultOrganisation] = useState({
    id: 1,
    name: "ORCHIDS",
    value: true
  })
  const [schoolList, setSchoolList] = useState([]);
  const [filterEmail, setFilterEmail] = useState(otherEmail);
  const [loader, setLoader] = useState(false);

  const [open, setOpen] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [filterErp, setFilterErp] = useState(otherFilterErp);
  const [roleId, setRoleId] = useState('');
  // filter validations
  // const FilterEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  // var filterEmail = FilterEmail;
  // const orchidsEmail= /^([a-zA-Z0-9_\.\-])+\@(([Oo][Rr][Cc][Hh][Ii][Dd][Ss])+\.)+([Ee][Dd][Uu]+\.)+([Ii][Nn])+$/;


  // const filterErp = /(19|20)[0-9][0-9][0-9]{7}/;

  const [formKey, setFormKey] = useState(new Date());


  const {
    first_name,
    last_name,
    username,
    // email,
    phone_number,
    password,
    roles_category,
    confirmPassword,
    school,
  } = profileData;
  const {
    // firstnameError,
    // lastnameError,
    // usernameError,
    // phoneNumberError,
    // emailError,
    // passwordError,
    // want_to_becomeError,
    // roleError,
    confirmPasswordError,
  } = errorData;
  // let loader = null;
  // if (dataLoading) {
  //   loader = <Loader open />;
  // }

  useEffect(() => {
    if (auth) {
      setProfileData({
        first_name: auth?.role_details?.name?.split('  ')[0],
        last_name: auth?.role_details?.name?.split(' ')[2],
        username: auth?.erp.split('_')[0],
        phone_number: '',
        joining_date: moment(new Date()).format('YYYY-MM-DD'),
        total_experience: '',
        email: auth?.email,
        password: '',
        confirmPassword: '',
        roles_category: '',
        branch: [],
        course_type: [],
        course_sub_type: [],
        gender: '',
        school: '',
      })
    }

  }, [])

  function handleClear() {

    setProfileData({
      first_name: auth?.role_details?.name?.split('  ')[0],
      last_name: auth?.role_details?.name?.split(' ')[2],
      username: auth?.erp.split('_')[0],
      phone_number: '',
      joining_date: moment(new Date()).format('YYYY-MM-DD'),
      total_experience: '',
      email: auth?.email,
      password: '',
      confirmPassword: '',
      roles_category: '',
      branch: [],
      course_type: [],
      course_sub_type: [],
      gender: '',
      school: '',
    })
  }

  async function getbranches() {
    setdataLoading(true);
    const response = await fetch(
      `${endpoints.sureLearning.getBranchNames}?is_orchids=True`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const getData = await response.json();
    setdataLoading(false);
    return getData;
  }
  const selectOrgani = (e) => {
    setSelectOrganisation(e);
    if (e === true) {
      setFilterEmail(orchidsEmail);
      setFilterErp(orchidsFilterErp);
      getRolesList(`${endpoints.sureLearning.getRoleRegistration}?search=orchids&user_type=USER`).then((data) => {
        setRolesList(data);
      });
      // filterErp = /(19|20)[0-9][0-9][0-9]{7}/;
    } else {
      setFilterEmail(otherEmail);
      setFilterErp(otherFilterErp);
      getRolesList(`${endpoints.sureLearning.getRoleRegistration}?search=other&user_type=USER`).then((data) => {
        setRolesList(data);
      });
      //  filterErp = /[^2][0-9]/;
    }
    getbranches().then((data) => {
      setBranch(data);
    });
  };
  useEffect(() => {
    // setSelectOrganisation(e);
    if (selectOrganisation === true) {
      setFilterEmail(orchidsEmail);
      setFilterErp(orchidsFilterErp);
      getRolesList(`${endpoints.sureLearning.getRoleRegistration}?search=orchids&user_type=USER`).then((data) => {
        setRolesList(data);
      });
      // filterErp = /(19|20)[0-9][0-9][0-9]{7}/;
    }
    getbranches().then((data) => {
      setBranch(data);
    });
  }, [])

  async function getSchoolBranch(id) {
    // console.log('school',id)
    const gradeResult = fetch(
      `${endpoints.sureLearning.getBranchNames}?school_id=${id}`,
      {
        method: 'GET',
        cache: 'reload',
        headers: {
          'Content-Type': 'Application/json',
        },
      },
    );

    const response = await gradeResult;
    const gradeData = await response.json();
    return gradeData;
  }

  const registerUserData = (name, data) => {
    setProfileData({
      ...profileData,
      [name]: data,
    });
    if (name === 'school') {
      getSchoolBranch(data).then((datas) => {
        setBranch(datas);
      });
      //  getSchoolBranch(data).then((data) => setAllValues({ ...values, inductionGrade: data }));
    }
    //  console.log("role type"+profileData.gradeData);
  };


  const { setAlert } = useContext(AlertNotificationContext);


  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // POST To Submit Register Form Data
  async function postRegData() {
    // console.log("post "+profileData)
    const response = await fetch(endpoints.sureLearning.nonOrchidsregistration, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(profileData), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const fetchData = await response.json();
    return fetchData;
  }

  function checkRegisterValid() {
    let firstnameError = '';
    let lastnameError = '';
    let usernameError = '';
    let phoneNumberError = '';
    // let schoolError= '';
    // let emailError = '';
    // let passwordError = '';
    // let want_to_becomeError = '';
    // let roleError = '';
    // let confirmPasswordError = '';
    if (!first_name) {
      firstnameError = 'First Name Field is Blank';
    }
    if (!last_name) {
      lastnameError = 'Last name field is blank';
    }
    if (!username) {
      usernameError = 'User Name field is blank';
    }
    if (!phone_number) {
      phoneNumberError = 'Phone Number Field is Blank';
    }

    // if(mailOrchids===false){
    //   if (!schoolError) {
    //     schoolError = 'School Name Field is Blank';
    //   }
    // }
    if (!roles_category) {
      // roleError = 'Please enter your role';
    }
    if (!confirmPassword) {
      // confirmPasswordError = 'Please Enter this Field';
    }

    if (firstnameError || lastnameError || usernameError || phoneNumberError) {
      setError({
        firstnameError,
        lastnameError,
        usernameError,
        phoneNumberError,
      });
      return true;
    }

    return false;
  }

  function functioSuccess() {
    setAlert('success', 'Successfully Registered');
    history.push('/dashboard');
    setdataLoading(false);
  }
  function fail() {
    setAlert('error', 'Already Registered');
    setdataLoading(false);
  }

  function registerHandle() {
    if (!profileData.first_name) {
      setAlert('warning', 'Enter First Name');
      return 1;
    }
    if (!profileData.last_name) {
      setAlert('warning', 'Enter Last Name');
      return 1;
    }
    if (!profileData.username) {
      setAlert('warning', 'Enter Your Erp 11 Digit Number');
      return 1;
    }
    if (!profileData.phone_number) {
      setAlert('warning', 'Enter Your Valid 10 Digit Phone Number');
      return 1;
    }
    if (profileData.phone_number.length < 10) {
      setAlert('warning', 'Enter Your Valid 10 Digit Phone Number');
      return 1;
    }
    if (!profileData.email) {
      setAlert('warning', 'Enter Your Valid Email Address');
      return 1;
    }
    if (!profileData.gender) {
      setAlert('warning', 'Select Your Gender');
      return 1;
    }
    if (!profileData.joining_date) {
      setAlert('warning', 'Enter Your Joining Date');
      return 1;
    }
    if (profileData.username.length !== 11) {
      setAlert('warning', 'Enter Your Valid Erp 11 Digit Number');
      return 1;
    }
    if (verifyEmail === false) {
      setAlert('warning', 'Please verify Email first');
      return 1;
    }
    if (checkRegisterValid()) {
      return 1;
    }
    if (filterEmail.test(profileData.email) === false) {
      setAlert('error', 'Please Enter Email Id of Orchids');
      return 1;
    }
    if (filterErp.test(profileData.username) === false) {
      setAlert('error', 'Please Enter Valid Erp Code');
      return 1;
    }

    if (password !== confirmPassword) {
      setAlert('error', 'Please Enter Same Passwords');
    } else {
      // console.log("sab thik h regHan ")
      setdataLoading(true);
      delete profileData.confirmPassword;
      postRegData().then((data) => (data === 'user created successfully' ? functioSuccess() : fail()));
      setProfileData(registerData);
      setSelectedGrade([]);
      setSelectedSubject([]);
      setSelectedBranch([]);
      setSchoolList([]);
      setRoleType(false);
      setVerifyEmail(false);
    }
    // else {
    //   setdataLoading(true);
    //   delete profileData.confirmPassword;
    //   postRegData().then((data) =>
    //     data === "user created successfully" ? functioSuccess() : fail()
    //   );
    //   setProfileData(registerData);
    //   setSelectedGrade([]);
    //   setSelectedSubject([]);
    //   setSelectedBranch([]);
    // }
    return 1;
  };

  // GET to add Type of Roles
  async function getSubjects(gradeids) {
    setdataLoading(true);
    const response = await fetch(`${endpoints.sureLearning.subjectSelector_Webinar}?grade_id=${gradeids.toString()}`, {
      // const response = await fetch(endpoints.sureLearning.getAllSubjectsList, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const getData = await response.json();
    setdataLoading(false);
    return getData;
  }
  async function getRolesList(URL) {
    setdataLoading(true);
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const getData = await response.json();
    setdataLoading(false);
    return getData;
  }

  useEffect(() => {
    async function getGrades() {
      setdataLoading(true);
      const response = await fetch(endpoints.sureLearning.categoryTypeApiList, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const getData = await response.json();
      setdataLoading(false);
      return getData;
    }
    getGrades().then((data) => {
      setGradeList(data);
    });


    getRolesList(`${endpoints.sureLearning.getRoleRegistration}?search=other&user_type=USER`).then((data) => {
      setRolesList(data);
    });

  }, []);


  useEffect(() => {
    if (selectOrganisation === false) {
      async function getSchoolList() {
        let isOrchids = selectOrganisation ? 'orchids' : 'other'
        setdataLoading(true);
        const response = await fetch(endpoints.sureLearning.getSchoolListApi + `?search=${isOrchids}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const getData = await response.json();
        setdataLoading(false);
        return getData;
      }

      getSchoolList().then((data) => {
        setSchoolList(data);
      });
    }
  }, [selectOrganisation])

  // Get what the user wants to become

  function JoiningDateFunc(event, value) {
    registerUserData('joining_date', value);
  }

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  // function handleGradeData(e) {
  //   const array = [];
  //   for (let i = 0; i < e.target.value.length; i += 1) {
  //     array.push(
  //       gradeList
  //       && gradeList.filter((item) => item.type_name === e.target.value[i])[0].id,
  //     );
  //   }
  //   setSelectedGrade(e.target.value);
  //   if (array.length !== 0) {
  //     getSubjects(array).then((data) => {
  //       setSubjects(data);
  //     });
  //     registerUserData('course_type', array);
  //   }
  // }

  function handleGradeData(event, value) {
    if (value?.length) {
      const courseTypeIds = value.map((el) => el.id);
      registerUserData('course_type', courseTypeIds);
    } else {
      registerUserData('course_type', []);
    }
    setSelectedGrade(value);
    if (value.length !== 0) {
      const courseTypeIds = value.map((el) => el.id);
      getSubjects(courseTypeIds).then((data) => {
        setSubjects(data);
      });
    }
  }

  // function handleSubject(e) {
  //   const array = [];
  //   for (let j = 0; j < e.target.value.length; j += 1) {
  //     array.push(
  //       subjectList
  //       && subjectList.filter(
  //         (item) => item.subject_fk.sub_type_name === e.target.value[j],
  //       )[0].subject_fk.id,
  //     );
  //   }
  //   setSelectedSubject(e.target.value);
  //   registerUserData('course_sub_type', array);
  // }

  function handleSubject(event, value) {
    if (value?.length) {
      const courseSubTypeIds = value.map((el) => el.subject_fk.id);
      registerUserData('course_sub_type', courseSubTypeIds);
    } else {
      registerUserData('course_sub_type', []);
    }
    setSelectedSubject(value);
  }


  function handleBranch(event, value) {
    if (value?.length) {
      const branchIds = value.map((el) => el.id);
      registerUserData('branch', branchIds);
    } else {
      registerUserData('branch', []);
    }
    setSelectedBranch(value);
  }

  let status;
  async function sendEmailForOtp() {
    const response = await fetch(endpoints.sureLearning.sendOtp, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify({ email: profileData.email }), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const fetchData = await response.json();
    status = response.status;
    return fetchData;
  }

  const handleClickOpen = () => {
    localStorage.setItem('email', JSON.stringify(profileData.email));

    sendEmailForOtp()
      .then((data) => {
        if (status === 200) {
          setAlert('success', data.response);
          //  console.log("succ")
          setOpen(true);
        } else {
          setAlert('warning', data.response);
        }
      })
      .catch(() => {
        setAlert('warning', 'Something went wrong');
      });
  };
  const handleVerifyEmail = () => {
    // console.log("veri"+verifyEmail);
    setVerifyEmail(true);
  };
  const handleByProp = () => {
    handleClose();
    handleVerifyEmail();
  };
  const handleClose = () => {
    setOpen(false);
  };

  const organizationNames = [
    {
      id: 1,
      name: "ORCHIDS",
      value: true
    },
    {
      id: 2,
      name: "Others",
      value: false
    }
  ]

  function handleRole(event, value) {
    setRoleId(value);
    registerUserData('roles_category', value?.role_id);
    // setRoleType(actionMeta.props.name); 
    setSelectedGrade([]);
    setSelectedSubject([]);
  }

  return (
    <Layout>
      <div className='create__class' key={formKey}>
        <CreateclassProvider>
          <CommonBreadcrumbs
            componentName='Sure Learning'
            childComponentName='Sure Learning Register Form'
            isAcademicYearVisible={true}
          />
          {(loader || dataLoading) === true && (
            <Backdrop
              className={classes.backdrop}
              open
            >
              <CircularProgress />
            </Backdrop>
          )}
          {!udaanDetails || udaanDetails === "please_register" ? (
            <div className='create-class-form-container'>
              <form
                autoComplete='off'
                // onSubmit={(e) => validateForm(e)}
                key={formKey}
                className='create-class-form'
              >
                <Grid
                  container
                  className='create-class-container'
                  style={{ paddingBottom: 0 }}
                  spacing={3}
                >
                  <Grid item xs={12} sm={4}>
                    <Autocomplete
                      size='small'
                      // limitTags={2}
                      value={defaultOrganisation}
                      // onChange={(e) => selectOrgani(e.target.value)}
                      id='create__class-type'
                      options={organizationNames}
                      getOptionLabel={(option) => option?.name || ''}
                      filterSelectedOptions
                      className='dropdownIcon'
                      disabled
                      required
                      renderInput={(params) => (
                        <TextField
                          className='create__class-textfield'
                          {...params}
                          variant='outlined'
                          label='Select Organisation'
                          placeholder='Select Organisation'
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      className='create__class-textfield dropdownIcon'
                      id='class-title'
                      label='First Name'
                      variant='outlined'
                      size='small'
                      name='title'
                      value={profileData.first_name}
                      onChange={(e) => registerUserData('first_name', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      className='create__class-textfield dropdownIcon'
                      id='class-title'
                      label='Last Name'
                      variant='outlined'
                      size='small'
                      name='title'
                      value={profileData.last_name}
                      onChange={(e) => registerUserData('last_name', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      className='create__class-textfield dropdownIcon'
                      id='class-title'
                      label='Erp Number'
                      variant='outlined'
                      size='small'
                      name='title'
                      onChange={(e) => e.target.value.length < 12
                        && registerUserData('username', e.target.value)}
                      value={profileData.username}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      className='create__class-textfield dropdownIcon'
                      id='class-title'
                      label='Mobile Number'
                      variant='outlined'
                      size='small'
                      name='title'
                      // eslint-disable-next-line max-len
                      value={profileData.phone_number}
                      // onInput={(e) => {
                      //   e.target.value = Math.max(0, parseInt(e.target.value, 10))
                      //     .toString()
                      //     .slice(0, 10);
                      // }}
                      onChange={(e) => (e.target.value.length < 11 && e.target.value > -1
                        ? registerUserData('phone_number', e.target.value)
                        : '')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      className='create__class-textfield dropdownIcon'
                      id='class-title'
                      label='Email Id'
                      variant='outlined'
                      size='small'
                      name='title'
                      value={profileData.email}
                      onChange={(e) => registerUserData('email', e.target.value)}
                      required
                    />
                    <Button
                      variant="contained"
                      color='primary'
                      size='medium'
                      style={{ borderRadius: '10px', width: '100%', paddingRight: '0.5%', marginTop: '2.5%' }}
                      onClick={handleClickOpen}
                      disabled={verifyEmail === true}
                    >
                      Verify Email
                      {verifyEmail ? (
                        <VerifiedIcon />
                      )
                        : (
                          <VerifiedIcon
                            style={{ color: '#265d7e' }}
                          />
                        )}
                      {/* </VerifiedIcon> */}
                    </Button>
                    {/* <VerifiedIcon/> */}


                    {profileData.email && !filterEmail.test(profileData.email) ? (
                      <FormHelperText
                        id="component-error-text"
                        style={{ color: '#265d7e', fontSize: '15px' }}
                      >
                        Invalid Email Address(Please Enter Orchids Email)
                      </FormHelperText>
                    ) : null}
                    {profileData.email && filterEmail.test(profileData.email) ? (
                      <FormHelperText
                        id="component-error-text"
                        style={{ color: '#265d7e', fontSize: '15px' }}
                      >
                        Valid Email Address
                      </FormHelperText>
                    ) : null}
                    <div style={{ color: 'yellow' }}>{errorData.emailError}</div>
                    <Grid item xs={12} sm={4}>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="form-dialog-title"
                        fullWidth
                        className={classes.modalBgc}
                        PaperProps={{
                          style: {
                            background: 'rgb(74 144 226)',
                          },
                        }}
                      >
                        {/* <DialogTitle id="form-dialog-title">Subscribe</DialogTitle> */}
                        <DialogContent>
                          <OtpVerification handleClose={handleByProp} />
                        </DialogContent>

                        <DialogActions />
                      </Dialog>
                    </Grid>
                  </Grid>


                  <Grid item xs={12} sm={4}>
                    <Typography style={{ color: '#265d7e', float: 'left' }}>
                      Select Gender
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={4}>
                        <Radio
                          checked={profileData.gender === 'Male'}
                          onChange={(e) => registerUserData('gender', e.target.value)}
                          value="Male"
                          color="primary"
                          name="gender"
                          inputProps={{ 'aria-label': 'B' }}
                        />
                        {' '}
                        <b style={{ color: '#265d7e' }}>Male</b>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Radio
                          checked={profileData.gender === 'Female'}
                          onChange={(e) => registerUserData('gender', e.target.value)}
                          value="Female"
                          color="primary"
                          name="gender"
                          inputProps={{ 'aria-label': 'B' }}
                        />
                        <b style={{ color: '#265d7e' }}>Female</b>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* <Grid container spacing={3} className='create-class-container'> */}
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <Grid item xs={12} sm={4}>
                      <KeyboardDatePicker
                        onOpen={() => {
                          setTimeout(() => {
                            document
                              .querySelectorAll(
                                '.MuiPickersModal-dialogRoot .MuiDialogActions-root button'
                              )
                              .forEach((elem) => {
                                elem.classList.remove('MuiButton-textPrimary');
                                elem.classList.add('MuiButton-containedPrimary');
                              });
                          }, 1000);
                        }}
                        size='small'
                        // disableToolbar
                        variant='dialog'
                        format='YYYY-MM-DD'
                        margin='none'
                        InputProps={{ readOnly: true }}
                        id='date-picker'
                        label='Date of joining'
                        value={profileData.joining_date}
                        onChange={JoiningDateFunc}
                        minDate={new Date()}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {/* </Grid> */}
                  <Grid item xs={12} sm={4}>
                    <TextField
                      className='create__class-textfield dropdownIcon'
                      id='class-title'
                      label='Total Experience'
                      variant='outlined'
                      size='small'
                      name='title'
                      value={profileData.total_experience}
                      onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value, 10)).toString().slice(0, 3); }}
                      onChange={(e) => e.target.value.length < 5 && registerUserData('total_experience', e.target.value)}
                      required
                    />
                  </Grid>
                  {selectOrganisation ? (
                    <Grid item xs={12} sm={4}>
                      <Autocomplete
                        size='small'
                        limitTags={2}
                        id='create__class-subject'
                        className='dropdownIcon'
                        options={branchList || []}
                        getOptionLabel={(option) => option?.branch_name || ''}
                        filterSelectedOptions
                        value={selectedBranch}
                        onChange={handleBranch}
                        multiple
                        renderInput={(params) => (
                          <TextField
                            size='small'
                            className='create__class-textfield'
                            {...params}
                            variant='outlined'
                            label='Select branches'
                            placeholder='Select branches'
                          />
                        )}
                      />
                    </Grid>
                  )
                    :
                    (
                      <>
                        <Grid item xs={12} sm={4}>
                          <Autocomplete
                            size='small'
                            limitTags={2}
                            id='create__class-subject'
                            className='dropdownIcon'
                            options={schoolList || []}
                            getOptionLabel={(option) => option?.name || ''}
                            filterSelectedOptions
                            value={profileData.school}
                            // let c onchange
                            onChange={(e, actionMeta) => { registerUserData('school', e.target.value); setRoleType(actionMeta.props.name); setSelectedGrade([]); setSelectedSubject([]); }}
                            renderInput={(params) => (
                              <TextField
                                size='small'
                                className='create__class-textfield'
                                {...params}
                                variant='outlined'
                                label='Select School'
                                placeholder='Select School'
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Autocomplete
                            size='small'
                            limitTags={2}
                            multiple
                            id='create__class-grade'
                            className='dropdownIcon'
                            options={branchList || []}
                            getOptionLabel={(option) => option?.branch_name || ''}
                            filterSelectedOptions
                            value={selectedBranch}
                            onChange={handleBranch}
                            renderInput={(params) => (
                              <TextField
                                className='create__class-textfield'
                                {...params}
                                variant='outlined'
                                label='Select branches'
                                placeholder='Select branches'
                              />
                            )}
                          />
                        </Grid>
                      </>
                    )
                  }

                  <Grid item xs={12} sm={4}>
                    <Autocomplete
                      size='small'
                      // limitTags={2}
                      // multiple
                      value={roleId}
                      onChange={handleRole}
                      id='create__class-grade'
                      className='dropdownIcon'
                      options={roleList.response || []}
                      getOptionLabel={(option) => option?.role_name || ''}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          className='create__class-textfield'
                          {...params}
                          variant='outlined'
                          label='Select Role'
                          placeholder='Select Role'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Autocomplete
                      size='small'
                      limitTags={2}
                      multiple
                      value={selectedGrade}
                      onChange={handleGradeData}
                      name="course_type"
                      input={<Input />}
                      rendervalue={(selected) => selected.join(', ')}
                      className='dropdownIcon'
                      options={gradeList || []}
                      getOptionLabel={(option) => option?.type_name || ''}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          className='create__class-textfield'
                          {...params}
                          variant='outlined'
                          label='Select Grade'
                          placeholder='Select Grade'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Autocomplete
                      size='small'
                      limitTags={2}
                      multiple
                      value={selectedSubject}
                      onChange={handleSubject}
                      name="course_sub_type"
                      input={<Input />}
                      rendervalue={(selected) => selected.join(', ')}
                      className='dropdownIcon'
                      options={subjectList || []}
                      getOptionLabel={(option) => option?.subject_fk.sub_type_name || ''}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          className='create__class-textfield'
                          {...params}
                          variant='outlined'
                          label='Select Subject'
                          placeholder='Select Subject'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      type={showPassword ? 'text' : 'password'}
                      id="registerPassword"
                      label="Enter Password"
                      //   className={passwordcolor ? classes.normal : errorClass.error}
                      className={classes.normal}
                      value={profileData.password}
                      onChange={(e) => registerUserData('password', e.target.value)}
                      fullWidth
                      variant="outlined"
                      size='small'
                      name="password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => handleClickShowPassword()}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <div style={{ color: 'yellow' }}>{errorData.passwordError}</div>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      variant="outlined"
                      type={showPassword ? 'text' : 'password'}
                      id="registerPassword"
                      label="Confirm Password"
                      size='small'
                      //   className={passwordcolor ? classes.normal : errorClass.error}
                      className={classes.normal}
                      value={profileData.confirmPassword}
                      onChange={(e) => registerUserData('confirmPassword', e.target.value)}
                      fullWidth
                      name="confirmPassword"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => handleClickShowPassword()}
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
                </Grid>

                <hr className='horizontal-line-last' />
                <Grid container className='create-class-container' spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Button
                      variant='contained'
                      size='medium'
                      style={{ borderRadius: '10px', width: '100%', color: '#8c8c8c' }}
                      onClick={handleClear}
                    >
                      Clear all
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      // disabled={createBtnDisabled}
                      variant='contained'
                      color='primary'
                      size='medium'
                      // type='submit'
                      style={{ borderRadius: '10px', width: '100%' }}
                      onClick={() => registerHandle()}
                    >
                      Submit
                      {/* {registerHandle ? 'Please wait.Creating new class' : 'Submit'} */}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </div>
          ) : (
            <div className="css-typing sureLearningAccessContainer">
              <p className="sureLearingAccessText">
                You have already registered for sure learning
              </p>
            </div>

          )}

        </CreateclassProvider>
      </div>
    </Layout>
  );
}

export default withRouter(UserRegister);
