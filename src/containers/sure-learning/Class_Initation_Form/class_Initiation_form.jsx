import React, { useContext, useState, useEffect } from 'react';
import {
  Button,
  makeStyles,
  Paper,
  withStyles,
  Typography,
  TextField,
} from '@material-ui/core';
import axios from 'axios';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from 'config/endpoints';
import Layout from '../../Layout';
import './class_Initiation_form.scss';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  FeedbackFormDialog: {
    marginLeft: '6px',
  },
  filters: {
    marginLeft: '15px',
  },
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

const guidelines = [
  {
    name: '',
    field: "Please don't remove or manipulate any header in the file format",
  },
  { name: 'Erp Code', field: ' is a mandatory field, Example: 2003970002_OLV' },
  { name: 'Is_lesson_plan', field: ' is a mandatory field' },
  { name: 'Is_online_class', field: ' is a mandatory field' },
  { name: 'Is_ebook', field: ' is a mandatory field' },
  { name: 'Is_ibook', field: ' is a mandatory field' },
  { field: ' If access is need please mention as “0”' },
  { field: ' If access has to remove mention as “1”' },
];

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
    marginLeft: '20px',
    '&:hover': {
      backgroundColor: '#E2E2E2 !important',
    },
  },
}))(Button);

const ClassInitiationForm = () => {
  const [allCourses, setAllCourses] = useState([]);
  const classes = useStyles({});
  const { setAlert } = useContext(AlertNotificationContext);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseTitle, setCoursTitle] = useState('');
  const [enteredOTP, setEnteredOTP] = useState(null);
  const [otpVerified, setOtpVirified] = useState(false);
  const [mobile, setMobile] = useState(null);
  const [moduleId, setModuleId] = useState(null);
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails?.personal_info?.token;
  const moduleData = udaanDetails?.role_permission?.modules;

  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        if (item.module_name === 'Class_Initiation_Form') {
          setModuleId(item.module);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (moduleId !== null) {
      getAllCoursesInformation();
    }
  }, [moduleId]);

  const sendOTP = () => {
    axios
      .get(`${endpoints.sureLearning.sendOTP}?email=${mobile}`, {
        headers: {
          Authorization: `Bearer ${udaanToken}`,
          module: moduleId,
        },
      })
      .then((response) => {
        setAlert('success', response.data.response);
      })
      .catch((error) => {
        setAlert('error', 'Something went wrong try again');
      });
  };

  const VerifyOTP = () => {
    axios
      .get(
        `${endpoints.sureLearning.verifyOTP}?mobile_number=${mobile}&otp=${enteredOTP}`,
        {
          headers: {
            Authorization: `Bearer ${udaanToken}`,
            module: moduleId,
          },
        }
      )
      .then((response) => {
        setAlert('success', 'OTP Verified succssfully');
        setOtpVirified(true);
      })
      .catch((error) => {
        setOtpVirified(false);
        setAlert('error', error?.response?.data?.response);
      });
  };

  const getAllCoursesInformation = async () => {
    let tempInfo = [];
    axios
      .get(`${endpoints.sureLearning.getInstructureCourses}?course_type=trainer_driven`, {
        headers: {
          Authorization: `Bearer ${udaanToken}`,
          module: moduleId,
        },
      })
      .then((response) => {
        response.data.results.map((eachResult) => {
          tempInfo.push({
            course_category: eachResult.course.course_category,
            course_duration: eachResult.course.course_duration,
            course_image: eachResult.course.course_image,
            course_name: eachResult.course.course_name,
            id: eachResult.course.id,
          });
        });
        setAllCourses(tempInfo);
      })
      .catch((error) => {
        setAlert('error', 'Something went worng try again');
      });
  };

  const handleCourse = (e, row) => {
    console.log('incoming rows to check details', row);
    setSelectedCourse(row);
  };

  const handleSubmit = () => {
    let data = {
      course: selectedCourse.id,
      class_title: courseTitle,
    };
    axios
      .post(`${endpoints.sureLearning.classInitiationFormSubmit}`, data, {
        headers: {
          Authorization: `Bearer ${udaanToken}`,
          module: moduleId,
        },
      })
      .then((response) => {
        setAlert('success', 'data submitted successfully');
      })
      .catch((error) => {
        setAlert('error', 'something went wrong try again');
      });
  };

  return (
    <Layout className='accessBlockerContainer'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='Class initiation form'
          isAcademicYearVisible={true}
        />

        <div className='listcontainer'>
          <div className='filterStudent' style={{ marginLeft: '20px' }}></div>

          <div className='listcontainer'>
            <div className='filterStudent' style={{ width: '100%' }}>
              <Typography
                color='primary'
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                Class Initiation Form
              </Typography>
            </div>
          </div>
          <div style={{ paddingLeft: '20%', paddingRight: '20%' }}>
            <TextField
              onChange={(e) => setCoursTitle(e.target.value)}
              margin='dense'
              style={{ margin: '20px' }}
              fullWidth
              variant='outlined'
              label='Class Title'
            />
            <Autocomplete
              // multiple
              style={{ width: '100%', margin: '20px' }}
              size='small'
              onChange={handleCourse}
              id='branch_id'
              className='dropdownIcon'
              value={selectedCourse || ''}
              options={allCourses || ''}
              getOptionLabel={(option) => option?.course_name || ''}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Volume'
                  placeholder='Volume'
                />
              )}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
              }}
            >
              <TextField
                onChange={(e) => setMobile(e.target.value)}
                style={{ margin: '20px' }}
                margin='dense'
                fullWidth
                variant='outlined'
                label='Enter Phone Number or Email'
              />
              <Button
                disabled={mobile !== null ? false : true}
                onClick={() => sendOTP()}
                style={
                  mobile !== null
                    ? { width: '30%', height: '45px' }
                    : { width: '30%', height: '45px', opacity: 0.2, color: '#FFF' }
                }
                className={classes.updateButton}
                color='primary'
                variant='contained'
              >
                Send OTP
              </Button>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
              }}
            >
              <TextField
                type='Number'
                onChange={(e) => {
                  setEnteredOTP(e.target.value);
                  console.log(e.target.value);
                }}
                style={{ margin: '20px' }}
                margin='dense'
                fullWidth
                variant='outlined'
                label='Enter OTP'
              />
              <Button
                disabled={mobile !== null && enteredOTP !== null ? false : true}
                onClick={() => VerifyOTP()}
                style={
                  mobile !== null && enteredOTP !== null
                    ? { width: '30%', height: '45px' }
                    : { width: '30%', height: '45px', opacity: 0.2, color: '#FFF' }
                }
                className={classes.updateButton}
                color='primary'
                variant='contained'
              >
                Verify OTP
              </Button>
            </div>
            <Button
              disabled={otpVerified ? false : true}
              onClick={() => handleSubmit()}
              style={
                otpVerified
                  ? { width: '100%', margin: '20px' }
                  : { width: '100%', margin: '20px', opacity: 0.2, color: '#FFF' }
              }
              fullWidth
            >
              Submit Class Iniatiation form
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClassInitiationForm;
