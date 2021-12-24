import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  withStyles,
  useTheme,
  Box,
  Input,
  Typography,
} from '@material-ui/core';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../Layout';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { Autocomplete, Pagination } from '@material-ui/lab';
import { connect, useSelector } from 'react-redux';
import { Divider, TextField } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import axiosInstance from '../../config/axios';
import endpoints from 'config/endpoints';
import FileSaver from 'file-saver';
import IMGPIC from 'assets/images/img1.png';
import Orchids from 'assets/images/orchids.png';
import { CSVLink } from 'react-csv';
import TablePagination from '@material-ui/core/TablePagination';
import { useHistory } from 'react-router';

import './referstudent.scss';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: theme.commonTableRoot,
  paperStyled: {
    minHeight: '80vh',
    height: '100%',
    padding: '50px',
    marginTop: '15px',
  },
  guidelinesText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
  },
  errorText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fe6b6b',
    marginBottom: '30px',
    display: 'inline-block',
  },
  table: {
    minWidth: 650,
  },
  downloadExcel: {
    float: 'right',
    fontSize: '16px',
    // textDecoration: 'none',
    // backgroundColor: '#fe6b6b',
    // color: '#ffffff',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  cardsContainer: {
    width: '95%',
    margin: '0 auto',
  },
  tablePaginationCaption: {
    fontWeight: '600 !important',
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  guidelineval: {
    color: theme.palette.primary.main,
    fontWeight: '600',
  },
  guideline: {
    color: theme.palette.secondary.main,
    fontSize: '16px',
    padding: '10px',
  },
}));

const StyledButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
    padding: '8px 15px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}))(Button);

const StyledButtonUnblock = withStyles({
  root: {
    backgroundColor: '#228B22',
    color: '#FFFFFF',
    padding: '2px 8px',
    fontSize: '10px',
    '&:hover': {
      backgroundColor: '#228B22 !important',
    },
  },
})(Button);

const StyledButtonBlock = withStyles({
  root: {
    backgroundColor: '#FF2E2E',
    color: '#FFFFFF',
    padding: '2px 8px',
    fontSize: '10px',
    '&:hover': {
      backgroundColor: '#FF2E2E !important',
    },
  },
})(Button);

const StyledClearButton = withStyles((theme) => ({
  root: {
    backgroundColor: '#E2E2E2',
    color: '#8C8C8C',
    padding: '8px 15px',
    marginLeft: '30px',
    '&:hover': {
      backgroundColor: '#E2E2E2 !important',
    },
  },
}))(Button);

const StudentRefer = () => {
  const classes = useStyles({});
  const fileRef = useRef();
  const { setAlert } = useContext(AlertNotificationContext);

  const [moduleId, setModuleId] = useState('');
  // const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const history = useHistory();

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};

  const [checkFilter, setCheckFilter] = useState(false);
  const [student, setStudent] = useState('');
  const [parent, setParent] = useState('');
  const [phone, setPhone] = useState('');
  const [mail, setMail] = useState('');
  const [studentError, setStudentError] = useState('');
  const [parentError, setParentError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [cityError, setCityError] = useState('');

  const [mailError, setMailError] = useState('');
  const [valid, setValid] = useState(true);
  const regexEmail =    
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const nameRegex = /^[a-zA-Z ]+$/;

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Online Class' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Attend Online Class') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const handleStudentName = (e) => {
    setStudent(e.target.value);
    validateStudentName(e.target.value);
  };

  const validateCity = (value) => {
    if(!nameRegex.test(value) && value !== '') {
      setCityError('Invalid City Name ie. Only Alphabets');
      setValid(false);
      return false;
    } else {
      setCityError('');
      setValid(true);
      return true;
    }
  }

  const validateStudentName = (value) => {
    if(!nameRegex.test(value) && value !== '') {
      setStudentError('Invalid Student Name ie. Only Alphabets');
      setValid(false);
      return false;
    } else {
      setStudentError('');
      setValid(true);
      return true;
    }
  }

  const validateParentName = ( value) => {
    if(!nameRegex.test(value) && value !== '') {
      setParentError('Invalid Parent Name ie. Only Alphabets');
      setValid(false);
      return false;
    } else {
      setParentError('');
      setValid(true);
      return true;
    }
  }

  const handleParentName = (e) => {
    setParent(e.target.value);
    validateParentName(e.target.value)
  };
  const handleCity = (e) => {
    setSelectedBranch(e.target.value);
    validateCity(e.target.value);
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
    phonevalidate(e.target.value);
  };
  const handleMail = (e) => {
    setMail(e.target.value);
    emailValidate(e.target.value);
  };

  const emailValidate = (value) => {
    if (!regexEmail.test(value) && value !== '') {
      setMailError('Email is Invalid');
      setValid(false);
      return false;
    } else {
      setMailError('');
      setValid(true);
      return true;
    }
  };

  const phonevalidate = (value) => {
    let numberRegex = /^[1-9]([0-9]{9}$)/;
    if(!numberRegex.test(value) && value !== ''){
      setValid(false);
      setPhoneError('phone number not valid');
      return false;
    } else {
      setPhoneError('');
      setValid(true);
      return true;
    }
  };

  // useEffect(() => {
  //   if (moduleId && selectedAcademicYear) {
  //     axiosInstance
  //       .get(
  //         `erp_user/branch/?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`
  //       )
  //       .then((res) => {
  //         // setAcademicYear(res?.data?.data);
  //         setBranchList(res?.data?.data?.results);
  //         console.log(res.data.data, 'academic');
  //         // const defaultValue = res?.data?.data?.[0];
  //         // handleAcademicYear(defaultValue);
  //       })
  //       .catch((error) => {
  //         setAlert('error', 'Something Wrong!');
  //       });
  //   }
  // }, [moduleId, selectedAcademicYear]);

  const handleClearAll = () => {
    fileRef.current.value = null;
    // setSelectedAcadmeicYear();
    setSelectedBranch();
  };

  const handleClearAllList = () => {};

  const branchCheck = () => {
    if (selectedBranch.length === 0) {
      setAlert('warning', 'Please select branch');
      console.log(selectedBranch.length);
    } else {
      // setAlert('warning', 'mil gya');
    }
  };

  const handleRedirect = (res) => {
    setAlert('success', 'Successfully Added');
    history.push({
      pathname: '/successrefer',
      state: {
      data: res.data.data
      }
    })
  }

  const handleSubmit = () => {
    branchCheck();  

    const data = {
      parent_name: parent,
      student_name: student,
      city: selectedBranch,
      email_id: mail,
      phone_number: phone,
      referral_code: userDetails?.erp
    };
    if (student && parent && valid) {
      axiosInstance
        .post(`${endpoints.referral.studentRefer}`, data, {
          headers: {
            Authorization: `Bearer ${userDetails?.token}`,
          },
        })
        .then((results) => {
          // setAlert('success', 'Successfully Added');
          // history.push('/dashboard');
          handleRedirect(results)
        })
        .catch((error) => {
          setAlert('error', 'Already Registered !');
        });
    } else {
      setAlert('error', 'All Fields are Mandatory');
    }
  };

  return (
    <Layout className='student-refer-whole-container'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Student Refer'
          childComponentName='Orchids Ambassador Program'
          isAcademicYearVisible={true}
        />
        <Paper>
          <div className='student-refer-container'>
            <div className='image-class'>
              <div className='leftimage'>
                <div className='main-img'>
                <img src={IMGPIC} className='image-left' />
                </div>
                <div className='orchidslogo'>
                  <img src={Orchids} className='logo-orchids' />
                </div>
              </div>
           
              <div className='form-div'>
                <div className='header-refer-container'>
                  <p className='referHeader'>Refer Now</p>
                  <p className='small-header' >Take advantage of the ORCHIDS AMBASSADOR PROGRAME</p>
                </div>
                <div className='form-area'>
              

                  <TextField
                    id='outlined-basic'
                    label='City'
                    variant='outlined'
                    size='small'
                    className='input-boxes border'
                    onChange={(e) => handleCity(e)}
                    helperText={cityError}
                    error={cityError.length !== 0}
                    required={true}
                  />

                  <TextField
                    id='outlined-basic'
                    label='Student Name'
                    variant='outlined'
                    size='small'
                    className='input-boxes'
                    onChange={(e) => handleStudentName(e)}
                    helperText={studentError}
                    error={studentError.length !== 0}
                    required={true}
                  />
                  <TextField
                    id='outlined-basic'
                    label='Parents Name'
                    variant='outlined'
                    size='small'
                    helperText={parentError}
                    error={parentError.length !== 0}
                    className='input-boxes'
                    onChange={(e) => handleParentName(e)}
                    required={true}
                  />
                  <TextField
                    id='outlined-basic'
                    label='Phone Number'
                    variant='outlined'
                    className='input-boxes'
                    helperText={phoneError}
                    error={phoneError.length !== 0}
                    size='small'
                    onChange={(e) => handlePhone(e)}
                    type='number'
                    required={true}
                  />
                  <TextField
                    id='outlined-basic'
                    label='E-mail'
                    variant='outlined'
                    size='small'
                    helperText={mailError}
                    error={mailError.length !== 0}
                    className='input-boxes'
                    onChange={(e) => handleMail(e)}
                    required={true}
                  />

                  <div className='submit-btn-area'>
                    <StyledButton onClick={handleSubmit}>Submit</StyledButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </Layout>
  );
};

export default StudentRefer;
