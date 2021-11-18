import React, { useContext, useEffect, useState } from 'react';
import {
  CircularProgress,
  Button,
  DialogTitle,
  Grid,
  TextField,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { MuiPickersUtilsProvider, DatePicker, TimePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { Autocomplete } from '@material-ui/lab';
import WSAPI from './WSconfig/WSapi';
import WSENDPOINT from './WSconfig/WSendpoint';

export default function CreateWorkshop(props) {
  const { selectedYear, moduleId, setDialogOpen, setLoading } = props;
  const { setAlert } = useContext(AlertNotificationContext);
  const [title, setTitle] = useState();
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [selGradeId, setSelGradeId] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState();
  const [selectedDate, handleDateChange] = useState(new Date());
  const [selectedTime, handleTimeChange] = useState(new Date());
  const [tutorEmailList, setTutorEmailList] = useState([]);
  const [selectedTutorEmail, setSelectedTutorEmail] = useState();
  const [tutorEmailsLoading, setTutorEmailsLoading] = useState();
  const [tutorNotAvailableMsg, setTutorNotAvailableMsg] = useState();
  const [duration, setDuration] = useState();

  const fetchBranches = () => {
    WSAPI(
      'get',
      `${WSENDPOINT.WORKSHOP.branch}?session_year=${selectedYear?.id}&module_id=${moduleId}`
    ).then((res) => {
      if (res.data.status_code === 200) {
        const transformedData = res.data.data.results?.map((obj) => ({
          id: obj.branch.id,
          branch_name: obj.branch.branch_name,
        }));
        transformedData.unshift({
          branch_name: 'Select All',
          id: 'all',
        });
        setBranchList(transformedData);
      }
    });
  };

  const fetchGrades = () => {
    WSAPI('get', `${WSENDPOINT.WORKSHOP.grades}?module_id=${moduleId}`).then((res) => {
      if (res.data.status_code === 200) {
        res.data.result.results.unshift({
          grade_name: 'Select All',
          id: 'all',
        });
        setGradeList(res.data.result.results);
      }
    });
  };

  const fetchCourses = () => {
    WSAPI(
      'get',
      `${WSENDPOINT.WORKSHOP.courses}?grade=${selGradeId[0]}&page=1&page_size=10`
    ).then((res) => {
      if (res.data.status_code === 200) {
        setCourseList(res.data.result);
      }
    });
  };

  const fetchTutorList = () => {
    setTutorEmailsLoading(true);
    const branchIds = selectedBranch.map((obj) => obj.id);
    const gradeIds = selectedGrade.map((obj) => obj.id);
    WSAPI(
      'get',
      `${WSENDPOINT.WORKSHOP.tutorList}?branch_id=${branchIds}&grade_id=${gradeIds}`
    )
      .then((res) => {
        setTutorEmailsLoading(false);
        if (res.data.status_code === 200) {
          setTutorEmailList(res.data.data);
        }
      })
      .catch(() => {
        setTutorEmailsLoading(false);
      });
  };

  const fetchTutorAvailability = () => {
    setTutorEmailsLoading(true);
    const sdt = `${moment(selectedDate).format('YYYY-MM-DD')} ${moment(
      selectedTime
    ).format('HH:mm:00')}`;
    WSAPI(
      'get',
      `${WSENDPOINT.WORKSHOP.tutoravailability}?start_time=${sdt}&tutor=${selectedTutorEmail.id}&duration=${duration}`
    )
      .then((res) => {
        setTutorEmailsLoading(false);
        if (res.data.status_code === 200) {
          if (res.data.status === 'success') {
            setTutorNotAvailableMsg('');
          } else {
            setTutorNotAvailableMsg('Selected tutor is not available. Select another');
          }
        }
      })
      .catch(() => {
        setTutorEmailsLoading(false);
      });
  };

  const handleBranch = (e, value) => {
    setSelectedGrade([]);
    setSelectedCourse();
    if (value) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...branchList].filter(({ id }) => id !== 'all')
          : value;
      setSelectedBranch(value);
    }
  };

  const handleGrade = (e, value) => {
    if (value) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...gradeList].filter(({ id }) => id !== 'all')
          : value;
      setSelectedGrade(value);
      const ids = value.map((obj) => obj.id);
      setSelGradeId(ids);
    }
  };

  const handleCourse = (e, value) => {
    if (value) {
      setSelectedCourse(value);
    }
  };

  const handleTutorEmail = (e, value) => {
    if (value) {
      setSelectedTutorEmail(value);
    }
  };

  const createWorkshop = () => {
    if (!title) {
      setAlert('error', 'Please Add Title');
      return false;
    } else if (selectedBranch.length <= 0) {
      setAlert('error', 'Please Select Branch');
      return false;
    } else if (selectedGrade.length <= 0) {
      setAlert('error', 'Please Select Grade');
      return false;
    } else if (!selectedCourse.id) {
      setAlert('error', 'Please Select Course');
      return false;
    } else if (!duration) {
      setAlert('error', 'Please Add Duration');
      return false;
    } else if (!selectedTutorEmail?.id) {
      setAlert('error', 'Please Select Teacher');
      return false;
    }

    var payload = {
      branch: selectedBranch.map((obj) => obj.id),
      grade: selectedGrade.map((obj) => obj.id),
      course: selectedCourse.id,
      course_name: selectedCourse.course_name,
      topic: title,
      start_time: `${moment(selectedDate).format('YYYY-MM-DD')} ${moment(
        selectedTime
      ).format('HH:mm:00')}`,
      duration: duration,
      tutor_id: selectedTutorEmail.id,
      auth_user_id: selectedTutorEmail.user,
      tutor_emails: selectedTutorEmail.user__email,
      academic_year_id: selectedYear.id,
      academic_year: selectedYear.session_year,
    };

    setLoading(true);
    WSAPI('post', `${WSENDPOINT.WORKSHOP.createworkshop}`, payload)
      .then((res) => {
        setLoading(false);
        if (res.data.status_code === 200) {
          setAlert('success', 'Work Shop Created');
          closeDialog();
        } else {
          setAlert('error', res?.data?.message);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    if (selectedGrade?.length) {
      fetchTutorList();
    }
  }, [selectedGrade]);

  useEffect(() => {
    setTutorNotAvailableMsg();
    if (selectedTutorEmail) {
      fetchTutorAvailability();
    }
  }, [selectedTutorEmail, selectedDate, selectedTime, duration]);

  useEffect(() => {
    fetchBranches();
    fetchGrades();
  }, []);

  useEffect(() => {
    if (selGradeId.length) {
      fetchCourses();
    }
  }, [selGradeId]);

  const calendarBtnHideFix = () => {
    setTimeout(() => {
      document
        .querySelectorAll('.MuiPickersModal-dialogRoot .MuiDialogActions-root button')
        .forEach((elem) => {
          elem.classList.remove('MuiButton-textPrimary');
          elem.classList.add('MuiButton-containedPrimary');
        });
    }, 1000);
  };

  return (
    <>
      <DialogTitle className='dialog-title'>Create Meeting</DialogTitle>
      <div className='meeting-form'>
        <TextField
          style={{ width: '100%' }}
          size='small'
          label='Title'
          variant='outlined'
          type='text'
          value={title}
          name='title'
          onChange={(eve) => {
            setTitle(eve.target.value);
          }}
        />
        <Autocomplete
          multiple
          fullWidth
          size='small'
          className='filter-student meeting-form-input'
          options={branchList || []}
          getOptionLabel={(option) => option?.branch_name || ''}
          filterSelectedOptions
          value={selectedBranch || []}
          onChange={(event, value) => {
            handleBranch(event, value);
          }}
          renderInput={(params) => (
            <TextField {...params} required fullWidth variant='outlined' label='Branch' />
          )}
          renderOption={(option, { selected }) => (
            <React.Fragment>{option?.branch_name}</React.Fragment>
          )}
        />
        <Autocomplete
          multiple
          fullWidth
          size='small'
          className='filter-student meeting-form-input'
          options={gradeList || []}
          getOptionLabel={(option) => option?.grade_name || ''}
          filterSelectedOptions
          value={selectedGrade || []}
          onChange={(event, value) => {
            handleGrade(event, value);
          }}
          renderInput={(params) => (
            <TextField {...params} required fullWidth variant='outlined' label='Grade' />
          )}
          renderOption={(option, { selected }) => (
            <React.Fragment>{option?.grade_name}</React.Fragment>
          )}
        />
        <Autocomplete
          fullWidth
          size='small'
          className='filter-student meeting-form-input'
          options={courseList || []}
          getOptionLabel={(option) => option?.course_name || ''}
          filterSelectedOptions
          value={selectedCourse || {}}
          onChange={(event, value) => {
            handleCourse(event, value);
          }}
          renderInput={(params) => (
            <TextField {...params} required fullWidth variant='outlined' label='Course' />
          )}
          renderOption={(option, { selected }) => (
            <React.Fragment>{option?.course_name}</React.Fragment>
          )}
        />
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid container spacing={2}>
            <Grid item xs={4} sm={4} md={4}>
              <DatePicker
                onOpen={() => {
                  calendarBtnHideFix();
                }}
                label='Workshop Date'
                autoOk
                value={selectedDate}
                onChange={handleDateChange}
                format='MM/DD/YYYY'
              />
            </Grid>
            <Grid item xs={4} sm={4} md={4}>
              <TimePicker
                onOpen={() => {
                  calendarBtnHideFix();
                }}
                autoOk
                format='hh:mm A'
                label='Workshop Time'
                value={selectedTime}
                onChange={handleTimeChange}
              />
            </Grid>
            <Grid item xs={4} sm={4} md={4}>
              <TextField
                style={{ width: '100%', marginTop: '3px' }}
                size='small'
                label='Duration (mins)'
                variant='outlined'
                type='number'
                value={duration}
                name='duration'
                onChange={(eve) => {
                  setDuration(eve.target.value);
                }}
                required
              />
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
        <Grid container spacing={2}>
          <Grid item xs={11} sm={11} md={11}>
            <Autocomplete
              size='small'
              limitTags={2}
              options={tutorEmailList}
              getOptionLabel={(option) => `${option?.name} (${option?.erp_id})` || ''}
              filterSelectedOptions
              value={selectedTutorEmail}
              onChange={handleTutorEmail}
              disabled={tutorEmailsLoading}
              renderInput={(params) => (
                <TextField
                  size='small'
                  {...params}
                  variant='outlined'
                  label='Tutor Name'
                  placeholder='Tutor Name'
                  required
                />
              )}
            />
            <span
              style={{
                display: 'inline-block',
                color: 'red',
                padding: '5px',
                textTransform: 'capitalize',
              }}
            >
              {tutorNotAvailableMsg}
            </span>
          </Grid>
          <Grid item xs={1} sm={1}>
            {tutorNotAvailableMsg === '' ? (
              <CheckCircleIcon style={{ fill: 'green', marginTop: 8 }} />
            ) : (
              ''
            )}
            {tutorEmailsLoading ? <CircularProgress color='secondary' /> : ''}
          </Grid>
        </Grid>
        <div className='meeting-form-actions' style={{ marginTop: '1rem' }}>
          <Button
            className='meeting-form-actions-butons'
            onClick={() => {
              createWorkshop();
            }}
          >
            Confirm
          </Button>
          <Button className='meeting-form-actions-butons' onClick={() => closeDialog()}>
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
}
