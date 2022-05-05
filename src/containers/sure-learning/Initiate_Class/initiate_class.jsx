import React, { useContext, useState, useEffect } from 'react';
import {
  Button,
  makeStyles,
  Paper,
  withStyles,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import axios from 'axios';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from 'config/endpoints';
import MaterialTable from 'material-table';
import Layout from '../../Layout';
import './initiate_class..scss';
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

const InitiateClass = ({ history }) => {
  const [allCourses, setAllCourses] = useState([]);
  const classes = useStyles({});
  const { setAlert } = useContext(AlertNotificationContext);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [duration, setDuration] = useState(null);
  const [className, setClassName] = useState('');
  const [teacherList, setTeacherList] = useState(null);
  const [classDate, setClassDate] = useState(null);
  const [classList, setClassList] = useState([]);
  const [branchedForOnlineClass, setBranchedForOnlineClass] = useState([]);
  const [courseTitle, setCoursTitle] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchList, setBranchList] = useState([]);
  const [enteredOTP, setEnteredOTP] = useState(null);
  const [selectedTeacherDetails, setSelectedTeacherDetails] = useState([]);
  const [selectedBranchesForOnlineClass, setSelectedBranchesForOnlineClass] = useState(
    []
  );
  const [otpVerified, setOtpVirified] = useState(false);
  const [isOfflineClass, setIsOfflineClass] = useState('offline');
  const [mobile, setMobile] = useState(null);
  const [moduleId, setModuleId] = useState(null);
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails?.personal_info?.token;
  const moduleData = udaanDetails?.role_permission?.modules;

  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        if (item.module_name === 'Initiate_Class') {
          setModuleId(item.module);
        }
      });
    }
  }, []);

  const handleRowSelect = (data) => {
    console.log(data, 'selectedRows for attendance');
    setSelectedTeacherDetails(data);
  };

  const columns = [
    { title: 'Name', field: 'first_name' },
    { title: 'ERP', field: 'erp' },
  ];

  useEffect(() => {
    if (moduleId !== null) {
      getAllCoursesInformation();
      getBranchList();
      getClassList();
      getBranchForOnlineClass();
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

  const TeacherAttendance = () => {
    let selectedTeachersId = [];
    console.log(selectedCourse, 'selected Course to display');
    selectedTeacherDetails.map((eachTeacherDetail) => {
      selectedTeachersId.push(eachTeacherDetail.user.id);
    });
    let data = {
      class_details: selectedCourse.id,
      class_name: courseTitle,
      course: selectedCourse.course_id,
      teachers: selectedTeachersId,
    };

    axios
      .post(`${endpoints.sureLearning.submitTeacherAttendance}`, data, {
        headers: {
          Authorization: `Bearer ${udaanToken}`,
          module: moduleId,
        },
      })
      .then((response) => {
        setAlert('success', 'Attendance uploaded successfully');
      })
      .catch((error) => [setAlert('error', 'Something went wrong try again')]);
  };

  const getTeacherList = () => {
    let TempArray = [];
    let branchIds = [];
    selectedBranchesForOnlineClass.map((eachBranch) => {
      branchIds.push(eachBranch.id);
    });
    axios
      .get(
        `${endpoints.sureLearning.getTeacherListFromBranch}/?branch_id=${branchIds}&class_id=${selectedCourse.id}`,
        {
          headers: {
            Authorization: `Bearer ${udaanToken}`,
            module: moduleId,
          },
        }
      )
      .then((response) => {
        response.data.map((eachData) => {
          TempArray.push({ ...eachData, first_name: eachData?.user.first_name });
        });
        console.log(TempArray);
        setTeacherList(TempArray);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (selectedBranchesForOnlineClass.length >= 1 && selectedCourse !== null) {
      getTeacherList();
    }
  }, [selectedBranchesForOnlineClass, selectedCourse]);

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
        setAlert('success', 'OTP Verified Succesfully');
        setOtpVirified(true);
      })
      .catch((error) => {
        setOtpVirified(false);
        setAlert('error', error?.response?.data?.response);
      });
  };

  const getBranchForOnlineClass = () => {
    axios
      .get(`${endpoints.sureLearning.retriveBranches}`, {
        headers: {
          Authorization: `Bearer ${udaanToken}`,
          module: moduleId,
        },
      })
      .then((response) => {
        setBranchedForOnlineClass(response.data);
      })
      .catch((error) => {
        setAlert('error', 'Something went worng try again');
      });
  };

  const getBranchList = async () => {
    axios
      .get(`${endpoints.sureLearning.getBranchList}`, {
        headers: {
          Authorization: `Bearer ${udaanToken}`,
          module: moduleId,
        },
      })
      .then((response) => {
        setBranchList(response.data);
      })
      .catch((error) => {
        setAlert('error', 'Something went worng try again');
      });
  };

  const getClassList = async () => {
    let tempInfo = [];
    axios
      .get(`${endpoints.sureLearning.getClassList}?type=1`, {
        headers: {
          Authorization: `Bearer ${udaanToken}`,
          module: moduleId,
        },
      })
      .then((response) => {
        response.data.map((eachResponse) => {
          tempInfo.push({
            course_progression: eachResponse.course.course_progression,
            course_name: eachResponse.course.course_name,
            id: eachResponse.id,
            course_id: eachResponse.course.id,
          });
        });
        setClassList(tempInfo);
      })
      .catch((error) => {
        setAlert('error', 'Something went worng try again');
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
            id: eachResult.id,
          });
        });
        setAllCourses(tempInfo);
      })
      .catch((error) => {
        setAlert('error', 'Something went worng try again');
      });
  };

  const handleCourse = (e, row) => {
    setSelectedCourse(row);
  };

  const handleBranch = (e, row) => {
    setSelectedBranch(row);
  };

  const handleBranchForOnlineClass = (e, row) => {
    setSelectedBranchesForOnlineClass(row);
  };

  const handleClass = (e, row) => {
    setSelectedClass(row);
  };

  function functionToCreateMeeting() {
    if (className.length < 1) {
      setAlert('error', 'enter class name');
      return;
    }
    if (classDate === null) {
      setAlert('error', 'enter Date and time');
      return;
    }
    if (duration === null) {
      setAlert('error', 'enter duration');
      return;
    }
    if (selectedBranchesForOnlineClass === null) {
      setAlert('error', 'select Branch');
      return;
    }
    if (selectedClass === null) {
      setAlert('error', 'Select Class');
      return;
    }
    let branchIds = [];

    selectedBranchesForOnlineClass.map((eachBranch) => {
      branchIds.push(eachBranch.id);
    });
    const data = {
      topic: className,
      start_time: `${classDate.replace('T', ' ')}:00`,
      duration,
      class_id: selectedClass?.id,
      class_type: 'online',
      branch: branchIds,
    };
    fetch(`${endpoints.sureLearning.scheduleOnlineClassApi}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: udaanToken,
        'Content-Type': 'application/json',
        module: moduleId,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setAlert('success', 'Online Class Successfully Created');
          return res.json();
        }
        return res;
      })
      .then((res) => {
        if (res.status_code === 201) {
          // handleClose();
          setAlert('success', 'Online Class Successfully Created');
        } else if (res.status_code !== 201) {
          setAlert('error', res.message);
        }
      });
  }

  const handleStart = (classId) => {
    sessionStorage.setItem('Initiate_Class_Id', classId);
    history.push('/sure_learning/VolumeDetails');
  };

  const handleChange = (event) => {
    setIsOfflineClass(event.target.value);
  };

  return (
    <Layout className='accessBlockerContainer'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='Initiate Class'
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
                Initiate
              </Typography>
            </div>
          </div>
          <div style={{ paddingLeft: '20%', paddingRight: '20%' }}>
            <RadioGroup
              aria-label='gender'
              name='gender1'
              value={isOfflineClass}
              onChange={handleChange}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                flexDirection: 'row',
                marginLeft: '20px',
              }}
            >
              <FormControlLabel value='offline' control={<Radio />} label='Offline' />
              <FormControlLabel value='online' control={<Radio />} label='Online' />
            </RadioGroup>
            {isOfflineClass === 'offline' ? (
              <TextField
                onChange={(e) => setCoursTitle(e.target.value)}
                margin='dense'
                value={courseTitle || ''}
                style={{ margin: '20px' }}
                fullWidth
                variant='outlined'
                label='Class Room Name'
              />
            ) : (
              <TextField
                onChange={(e) => setClassName(e.target.value)}
                margin='dense'
                value={className || ''}
                style={{ margin: '20px' }}
                fullWidth
                variant='outlined'
                label='Class Name'
              />
            )}

            {isOfflineClass === 'offline' ? (
              <Autocomplete
                // multiple
                style={{ width: '100%', margin: '20px' }}
                size='small'
                onChange={handleCourse}
                id='branch_id'
                className='dropdownIcon'
                value={selectedCourse || ''}
                options={classList || ''}
                getOptionLabel={(option) => option?.course_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Select Course'
                    placeholder='Select Course'
                  />
                )}
              />
            ) : (
              <TextField
                onChange={(e) => setClassDate(e.target.value)}
                margin='dense'
                type='datetime-local'
                value={classDate || ''}
                style={{ margin: '20px' }}
                fullWidth
                variant='outlined'
                label='Enter Date and Time (dd/mm/yyyy , hh:mm)'
              />
            )}

            {isOfflineClass === 'online' ? (
              <TextField
                onChange={(e) => setDuration(e.target.value)}
                margin='dense'
                type='Number'
                value={duration || ''}
                style={{ margin: '20px' }}
                fullWidth
                variant='outlined'
                label='Enter Duration in (minutes)'
              />
            ) : null}

            {isOfflineClass === 'offline' ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'center',
                }}
              >
                <TextField
                  // type='Number'
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
            ) : null}
            {isOfflineClass === 'offline' ? (
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
            ) : null}
            <Autocomplete
              multiple
              style={{ width: '100%', margin: '20px' }}
              size='small'
              onChange={handleBranchForOnlineClass}
              id='branch_id'
              className='dropdownIcon'
              value={selectedBranchesForOnlineClass || ''}
              options={branchedForOnlineClass || ''}
              getOptionLabel={(option) => option?.branch_name || ''}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Select Branch'
                  placeholder='Select Branch'
                />
              )}
            />

            {isOfflineClass === 'online' ? (
              <Autocomplete
                // multiple
                style={{ width: '100%', margin: '20px' }}
                size='small'
                onChange={handleClass}
                id='branch_id'
                className='dropdownIcon'
                value={selectedClass || ''}
                options={classList || ''}
                getOptionLabel={(option) => option?.course_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Select Class'
                    placeholder='Select Class'
                  />
                )}
              />
            ) : null}
            {isOfflineClass === 'offline' ? (
              <Button
                disabled={otpVerified ? false : true}
                onClick={() => handleStart(selectedCourse.id)}
                style={
                  otpVerified
                    ? { width: '100%', margin: '20px' }
                    : { width: '100%', margin: '20px', opacity: 0.2, color: '#FFF' }
                }
                fullWidth
                className={classes.updateButton}
                color='primary'
                variant='contained'
              >
                Start Course
              </Button>
            ) : (
              <Button
                disabled={otpVerified ? false : true}
                onClick={() => functionToCreateMeeting()}
                style={
                  otpVerified
                    ? { width: '100%', margin: '20px' }
                    : { width: '100%', margin: '20px', opacity: 0.2, color: '#FFF' }
                }
                fullWidth
                className={classes.updateButton}
                color='primary'
                variant='contained'
              >
                Class Schedule
              </Button>
            )}
          </div>
        </div>
        {teacherList && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '500px' }}>
                <MaterialTable
                  // other props
                  style={{ width: '100%' }}
                  onSelectionChange={(rows) => handleRowSelect(rows)}
                  columns={columns}
                  data={teacherList}
                  options={{
                    selection: true,
                    search: false,
                    showTitle: false,
                    paging: false,
                  }}
                  components={{
                    Toolbar: () => null,
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Button
                color='primary'
                style={
                  otpVerified
                    ? { margin: '20px' }
                    : { margin: '20px', opacity: 0.2, color: '#FFF' }
                }
                disabled={otpVerified ? false : true}
                onClick={() => TeacherAttendance()}
              >
                Attended
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default InitiateClass;
