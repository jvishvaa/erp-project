import React, { useContext, useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';

import {
  Grid,
  TextField,
  Button,
  SwipeableDrawer,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import moment from 'moment';

import { CreateclassContext } from './create-class-context/create-class-state';
import FilterStudents from './filter-students';
import {
  emailRegExp,
  getFormatedTime,
  initialFormStructure,
  isBetweenNonSchedulingTime,
} from './utils';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import './create-class.scss';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { fetchBranchesForCreateUser } from '../../../redux/actions';

const CreateClassForm = (props) => {
  const tutorEmailRef = useRef(null);
  const [onlineClass, setOnlineClass] = useState(initialFormStructure);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [formKey, setFormKey] = useState(new Date());
  const [sectionSelectorKey, setSectionSelectorKey] = useState(new Date());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // const [subjects, setSubjects] = useState([]);
  const [moduleId, setModuleId] = useState();
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [tutorNotAvailableMsg, setTutorNotAvailableMessage] = useState('');
  const [selectedClassType, setSelectedClassType] = useState('');
  const [branches, setBranches] = useState([]);
  const {
    listGradesCreateClass,
    listCoursesCreateClass,
    listSectionsCreateClass,
    listStudents,
    dispatch,
    verifyTutorEmail,
    clearTutorEmailValidation,
    isTutorEmailValid,
    isValidatingTutorEmail,
    isEdit,
    editData,
    grades = [],
    sections = [],
    subjects = [],
    courses = [],
    clearFilteredStudents,
    filteredStudents,
    createNewOnlineClass,
    createSpecialOnlineClass,
    creatingOnlineClass,
    isCreated,
    resetContext,
    listTutorEmails,
    tutorEmails: tutorEmailList,
    tutorEmailsLoading,
    listSectionAndSubjects,
    clearTutorEmailsList,
    clearStudentsList,
    clearGrades,
    clearSubjects,
    clearSections,
    clearCourses,
    classTypeId=-1,
    setClassTypeId,
  } = useContext(CreateclassContext);

  const [toggle, setToggle] = useState(false);

  const { setAlert } = useContext(AlertNotificationContext);
  const {
    role_details: { branch = [], erp_user_id: erpUser },
    user_id: userId,
    is_superuser: isSuperUser,
  } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const fetchBranches = () => {
    fetchBranchesForCreateUser().then((data) => {
      const transformedData = data?.map((obj) => ({
        id: obj.id,
        branch_name: obj.branch_name,
      }));
      setBranches(transformedData);
    });
  };

  const [daysList, setDays] = useState([
    { id: 1, day: 'Monday', send: 'M' },
    { id: 2, day: 'Tuesday', send: 'T' },
    { id: 3, day: 'Wednesday', send: 'W' },
    { id: 4, day: 'Thursday', send: 'TH' },
    { id: 5, day: 'Friday', send: 'F' },
    { id: 6, day: 'Saturday', send: 'SA' },
    { id: 7, day: 'Sunday', send: 'S' },
  ]);

  const [classTypes, setClassTypes] = useState([
    { id: 0, type: 'Compulsory Class' },
    { id: 1, type: 'Optional Class' },
    { id: 2, type: 'Special Class' },
    { id: 3, type: 'Parent Class' },
  ]);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Online Class' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Create Class') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
    fetchBranches();
  }, []);

  useEffect(() => {
    const filteredSelectedSections = sections.filter(
      (data) =>
        selectedSections.findIndex((sec) => sec.section_id == data.section_id) > -1
    );
    setSelectedSections(filteredSelectedSections);
  }, [sections]);

  useEffect(() => {
    if (isCreated) {
      setFormKey(new Date());
      setAlert('success', 'Successfully created the class');
      setOnlineClass((prevState) => ({
        ...prevState,
        ...initialFormStructure,
        selectedTime: new Date(),
        creatingOnlineClass: false,
        coHosts: [],
      }));
      dispatch(resetContext());
      setSelectedGrades([]);
      dispatch(listGradesCreateClass(moduleId));
    }
  }, [isCreated, moduleId]);

  const handleClassType = (event, value) => {
    setSelectedClassType('');
    dispatch(setClassTypeId(null));
    if (value) {
      setSelectedClassType(value);
      dispatch(setClassTypeId(value.id));
    }
  };

  const [selectedBranches, setSelectedBranches] = useState([]);
  const handleBranches = (event, value) => {
    setSelectedBranches([]);
    if (value?.length > 0) {
      const ids = value.map((obj) => obj.id);
      setSelectedBranches(value);
      dispatch(listGradesCreateClass(ids, moduleId));
      setOnlineClass((prevState) => ({ ...prevState, branchIds: ids }));
    } else {
      setSelectedGrades([]);
      setSelectedSections([]);
      setSelectedSubject([]);
      dispatch(clearGrades());
      dispatch(clearSections());
      dispatch(clearSubjects());
      dispatch(clearCourses());
    }
  };

  const handleGrade = (event, value) => {
    dispatch(clearFilteredStudents());
    setSelectedGrades(value);
    if (value.length) {
      const ids = value.map((el) => el.grade_id);
      setOnlineClass((prevState) => ({ ...prevState, gradeIds: ids }));
      dispatch(clearTutorEmailValidation());
      if (selectedClassType?.id > 0) dispatch(listCoursesCreateClass(ids));
    } else {
      setOnlineClass((prevState) => ({ ...prevState, gradeIds: [] }));
      dispatch(clearTutorEmailValidation());
    }
    setSectionSelectorKey(new Date());
    dispatch(clearTutorEmailValidation());
    setOnlineClass((prevState) => ({
      ...prevState,
      tutorEmail: '',
      sectionIds: [],
      coHosts: [],
    }));
    setSelectedSections([]);
    setSelectedSubject([]);
  };

  const handleSection = (event, value) => {
    dispatch(clearFilteredStudents());
    setSelectedSections(value);
    if (value.length) {
      const ids = value.map((el) => el.id);
      const sectionIds = value.map((el) => el.section_id);
      setOnlineClass((prevState) => ({ ...prevState, sectionIds: ids }));
    } else {
      setOnlineClass((prevState) => ({ ...prevState, sectionIds: [] }));
    }
    dispatch(clearTutorEmailValidation());
    setOnlineClass((prevState) => ({
      ...prevState,
      subject: [],
      course: [],
      coHosts: [],
    }));
  };

  const handleSubject = (event, value) => {
    dispatch(clearFilteredStudents());
    setSelectedSubject(value);
    if (value.length) {
      const subjectIds = value.map((el) => el.subject__id);
      setOnlineClass((prevState) => ({ ...prevState, subject: subjectIds }));
    } else {
      setOnlineClass((prevState) => ({ ...prevState, subject: [] }));
    }
    dispatch(clearTutorEmailValidation());
    setOnlineClass((prevState) => ({
      ...prevState,
      coHosts: [],
    }));
  };

  const handleCourse = (event, value) => {
    setSelectedCourse('');
    setOnlineClass((prevState) => ({ ...prevState, courseId: '' }));
    if (value) {
      setSelectedCourse(value);
      setOnlineClass((prevState) => ({ ...prevState, courseId: value.id }));
    }
  };

  useEffect(() => {
    let listStudentUrl = `branch_ids=${branch.join(',')}`;
    const { gradeIds, sectionIds, subject, branchIds } = onlineClass;

    if (selectedClassType?.id === 0) {
      if (gradeIds.length && sectionIds.length && subject.length) {
        listStudentUrl = `section_mapping_ids=${sectionIds.join(
          ','
        )}&subject_ids=${subject.join(',')}`;

        dispatch(listStudents(listStudentUrl));
      } else {
        clearStudentsList();
      }
    } else if (selectedClassType?.id > 0) {
      if (gradeIds.length > 0 && sectionIds.length > 0) {
        listStudentUrl = `section_mapping_ids=${sectionIds.join(',')}`;
        dispatch(listStudents(listStudentUrl));
      } else if (gradeIds.length > 0 && branchIds.length > 0) {
        listStudentUrl = `branch_ids=${branchIds.join(',')}&grade_ids=${gradeIds.join(
          ','
        )}`;
        dispatch(listStudents(listStudentUrl));
      } else {
        clearStudentsList();
      }
    }
  }, [
    onlineClass.gradeIds,
    onlineClass.sectionIds,
    onlineClass.branchIds,
    onlineClass.subject,
    selectedClassType?.id,
  ]);

  const toggleDrawer = () => {
    const { gradeIds, sectionIds, courseId, subject } = onlineClass;
    console.log({ onlineClass });
    if (
      selectedClassType?.id === 0 &&
      (!gradeIds.length || !sectionIds.length || !subject.length)
    ) {
      setAlert('error', 'Please provide values for grades, sections and subjects');
      return;
    } else if (selectedClassType?.id > 0 && (!gradeIds.length || !courseId)) {
      setAlert('error', 'Please provide value for course');
      return;
    } else {
      setIsDrawerOpen((prevState) => !prevState);
    }
  };

  const handleCoHost = (event, value) => {
    setOnlineClass((prevState) => ({ ...prevState, coHosts: value }));
  };

  const handleTutorEmail = (event, value) => {
    const { gradeIds } = onlineClass;
    if (onlineClass.coHosts.length > 0) {
      const index = onlineClass.coHosts.findIndex((host) => host === value);
      if (index) {
        const coHosts = onlineClass.coHosts.slice();
        coHosts.splice(index, 1);
        setOnlineClass((prevState) => ({ ...prevState, coHosts }));
      }
    }
    setOnlineClass((prevState) => ({ ...prevState, tutorEmail: value }));
    if (value) {
      dispatch(
        listSectionAndSubjects(
          value.roles,
          moduleId,
          value.tutor_id,
          isSuperUser ? 1 : 0,
          gradeIds
        )
      );
    }
  };

  const handleBlur = (e) => {
    const isValidEmail = e.target.value.match(emailRegExp);
    if (!isValidEmail || onlineClass.tutorEmail === '') {
      setAlert('error', 'Invalid email address');
    } else {
      const { tutorEmail, selectedDate, selectedTime, duration } = onlineClass;
      const data = {
        branchId: branch.join(','),
        gradeId: onlineClass.gradeIds.join(','),
        sectionIds: onlineClass.sectionIds.join(','),
        subjectId: onlineClass.subject,
      };
      verifyTutorEmail(tutorEmail, selectedDate, selectedTime, duration, data);
    }
  };

  const handleDateChange = (event, value) => {
    const isFutureTime = onlineClass.selectedTime > new Date();
    if (!isFutureTime) {
      setOnlineClass((prevState) => ({ ...prevState, selectedTime: new Date() }));
    }
    dispatch(clearTutorEmailValidation());
    setOnlineClass((prevState) => ({
      ...prevState,
      selectedDate: value,
      days:
        !toggle && new Date(value).getDay() === 0
          ? ['S']
          : daysList[new Date(value).getDay() - 1]['send'],
    }));
  };

  const handleTimeChange = (event) => {
    const { selectedDate } = onlineClass;
    const time = new Date(event);
    dispatch(clearTutorEmailValidation());
    setOnlineClass((prevState) => ({ ...prevState, selectedTime: time }));
  };

  const [selectedDays, setSelectedDays] = useState([]);
  const handleDays = (event, value) => {
    setSelectedDays(value);
    if (value.length > 0) {
      const sendData = value.map((obj) => obj.send);
      setOnlineClass((prevState) => ({ ...prevState, days: sendData }));
    } else {
      setOnlineClass((prevState) => ({ ...prevState, days: [] }));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'duration') {
      dispatch(clearTutorEmailValidation());
      setOnlineClass((prevState) => ({ ...prevState, [name]: value }));
      return;
    }

    if (name === 'joinLimit' && Number(value) > 300) {
      return;
    }
    setOnlineClass((prevState) => ({ ...prevState, [name]: value }));
  };

  const removeCohost = (index) => {
    const stateCopy = onlineClass;
    const filteredItems = stateCopy.coHosts.filter((host, ind) => index !== ind);
    setOnlineClass((prevState) => ({ ...prevState, coHosts: filteredItems }));
  };

  const handleAddCohosts = () => {
    setOnlineClass((prevState) => ({
      ...prevState,
      coHosts: [...prevState.coHosts, { email: '' }],
    }));
  };

  const handleCohostEmail = (event, index) => {
    const { value } = event.target;
    const stateCopy = onlineClass;
    const hosts = stateCopy.coHosts;
    hosts[index].email = value;
    setOnlineClass((prevState) => ({ ...prevState, coHosts: hosts }));
  };

  const callGrades = () => {
    dispatch(listGradesCreateClass(moduleId));
  };
  const validateForm = (e) => {
    callGrades();
    e.preventDefault();
    const {
      title,
      subject,
      duration,
      joinLimit,
      tutorEmail,
      gradeIds,
      sectionIds,
      selectedDate,
      selectedTime,
      coHosts,
      days,
      weeks,
      courseId,
    } = onlineClass;

    // for (let i = 0; i < coHosts.length; i++) {
    //   if (!coHosts[i].isValid === true) {
    //     setAlert('error', 'Cohost email is not valid');
    //     return;
    //   }
    // }

    // if (isBetweenNonSchedulingTime(selectedTime)) {
    //   setAlert(
    //     'error',
    //     'Classes cannot be scheduled between 9PM and 6AM. Please check the Start Time.'
    //   );
    //   return;
    // }
    // if (!isTutorEmailValid) {
    //   setAlert('error', 'Tutor email is not valid');
    //   return;
    // }
    const startTime = `${
      selectedDate.toString().includes(' ')
        ? selectedDate.toISOString().split('T')[0]
        : selectedDate
    } ${getFormatedTime(selectedTime)}`;
    const coHostEmails = coHosts.map((coHost) => coHost.email);
    const tutorEmails = [tutorEmail.email, ...coHostEmails];

    let request = {};
    request['user_id'] = userId;
    request['title'] = title;
    request['duration'] = duration;
    if (selectedClassType?.id === 0) {
      request['subject_id'] = subject.join(',');
    } else if (selectedClassType?.id > 0) {
      request['course'] = courseId;
    }
    request['tutor_id']=tutorEmail.tutor_id;
    request['tutor_emails'] = tutorEmails.join(',');
    request['role'] = 'Student';
    request['start_time'] = startTime;
    if (weeks > 0) request['no_of_week'] = Number(weeks);
    request['is_recurring'] = toggle ? 1 : 0;
    request['class_type'] = selectedClassType?.id;
    request['section_mapping_ids'] = sectionIds.join(',');

    if (selectedClassType?.id === 0) {
      const arr = [];
      arr.push(days);
      request['week_days'] = arr;
    } else if (days.length) request['week_days'] = days;

    if (selectedClassType?.id === 0) {
      if (filteredStudents.length > 0) request['student_ids'] = filteredStudents;
      if (joinLimit > 0) {
        request['join_limit'] = joinLimit;
        dispatch(createNewOnlineClass(request));
      } else {
        setAlert('warning', 'Join limit should be atleast 1.');
      }
    } else if (selectedClassType?.id > 0) {
      if (joinLimit > 0 && filteredStudents.length > 0) {
        request['student_ids'] = filteredStudents;
        request['join_limit'] = joinLimit;
        dispatch(createSpecialOnlineClass(request));
      } else {
        if (joinLimit <= 0) setAlert('warning', 'Batch size should be atleast 1.');
        if (filteredStudents.length <= 0)
          setAlert('warning', 'No. of students should be atleast 1.');
      }
    }

    //formdata below
    // const formdata = new FormData();
    // formdata.append('user_id', userId);
    // formdata.append('title', title);
    // formdata.append('duration', duration);
    // formdata.append('subject_id', subject.join(','));
    // formdata.append('tutor_emails', tutorEmails.join(','));
    // formdata.append('role', 'Student');
    // formdata.append('start_time', startTime);
    // if (weeks > 0) formdata.append('no_of_week', weeks);
    // formdata.append('is_recurring', toggle?1:0);
    // formdata.append('class_type', selectedClassType.id);

    // conditional appends
    // if (days.length) formdata.append('week_days', days);

    // if (sectionIds.length) formdata.append('section_mapping_ids', sectionIds);
    // else if (gradeIds.length) {
    //   formdata.append('grade_ids', gradeIds);
    //   formdata.append('branch_ids', branch.join(','));
    // } else formdata.append('branch_ids', branch.join(','));

    // if (filteredStudents.length)
    //   formdata.append('student_ids', filteredStudents.join(','));

    // if (joinLimit > 0) {
    //   formdata.append('join_limit', joinLimit);
    //   dispatch(createNewOnlineClass(formdata));
    // } else {
    //   setAlert('warning', 'Join limit should be atleast 1.')
    // }
  };

  const handleCoHostBlur = async (index) => {
    if (onlineClass.coHosts[index].email) {
      try {
        const acadinfo = {
          branchId: branch.join(','),
          gradeId: onlineClass.gradeIds.join(','),
          sectionIds: onlineClass.sectionIds.join(','),
          subjectId: onlineClass.subject,
        };
        const info = {
          email: [onlineClass.coHosts[index].email],
          erp_user_id: erpUser,
        };
        if (acadinfo.branchId) info.branch_id = acadinfo.branchId;
        if (acadinfo.gradeId) info.grade_id = acadinfo.gradeId;
        if (acadinfo.sectionIds) info.section_id = acadinfo.sectionIds;
        if (acadinfo.subjectId) info.subject_id = acadinfo.subjectId.toString();
        const { data } = await axiosInstance.post(
          endpoints.onlineClass.coHostValidation,
          info
        );
        const stateCopy = onlineClass;
        const hosts = stateCopy.coHosts;
        hosts[index].isValid = data.data[0].status;
        setOnlineClass((prevState) => ({ ...prevState, coHosts: hosts }));
      } catch (error) {
        setAlert('error', 'Something went wrong');
      }
    }
  };

  const handleClear = () => {
    setFormKey(new Date());
    setSelectedGrades([]);
    setSelectedSections([]);
    setSelectedSubject([]);
    setSelectedClassType('');
    setSelectedBranches([]);
    setToggle(false);
    setSelectedDays([]);
    setOnlineClass((prevState) => ({
      ...prevState,
      ...initialFormStructure,
      coHosts: [],
    }));
    dispatch(resetContext());
    dispatch(listGradesCreateClass());
  };

  const fetchTutorEmails = () => {
    const data = {
      branchIds:
        selectedClassType.id === 0 ? branch.join(',') : onlineClass.branchIds.join(','),
      gradeIds: onlineClass.gradeIds.join(','),
    };
    listTutorEmails(data);
  };

  const checkTutorAvailability = async () => {
    const { selectedDate, selectedTime, duration } = onlineClass;

    const startTime = `${
      selectedDate.toString().includes(' ')
        ? selectedDate.toISOString().split('T')[0]
        : selectedDate
    } ${getFormatedTime(selectedTime)}`;

    try {
      const { data } = await axiosInstance.get(
        `/erp_user/check-tutor-time/?tutor_email=${onlineClass.tutorEmail.email}&start_time=${startTime}&duration=${duration}`
      );
      if (data.status_code === '200') {
        if (data.message === 'Tutor is available') {
          setTutorNotAvailableMessage('');
        } else {
          setTutorNotAvailableMessage('Selected tutor is not available. Select another');
        }
      }
    } catch (error) {
      setTutorNotAvailableMessage('Selected tutor is not available. Select another');
    }
  };

  useEffect(() => {
    if (!toggle) {
      setSelectedDays([]);
      setOnlineClass((prevState) => ({
        ...prevState,
        selectedDate: new Date(),
        weeks: '',
        days:
          !toggle && new Date().getDay() === 0
            ? ['S']
            : daysList[new Date().getDay() - 1]['send'],
      }));
    }
  }, [toggle]);

  useEffect(() => {
    if (
      onlineClass.duration &&
      onlineClass.subject &&
      onlineClass.gradeIds.length &&
      onlineClass.selectedDate &&
      onlineClass.selectedTime &&
      onlineClass.tutorEmail
    ) {
      // fetchTutorEmails();
      checkTutorAvailability();
    }
  }, [
    onlineClass.duration,
    onlineClass.subject,
    onlineClass.gradeIds.length,
    onlineClass.selectedDate,
    onlineClass.selectedTime,
    onlineClass.tutorEmail,
  ]);

  useEffect(() => {
    if (branch.length && selectedGrades.length) {
      fetchTutorEmails();
      tutorEmailRef.current.scrollIntoView();
      tutorEmailRef.current.focus();
    } else {
      clearTutorEmailsList();
    }
  }, [selectedGrades]);

  useEffect(() => {
    if (!onlineClass.tutorEmail) {
      setSelectedSections([]);
      setSelectedSubject([]);
    }
  }, [onlineClass.tutorEmail]);

  const createBtnDisabled =
    !onlineClass.duration ||
    !onlineClass.subject ||
    !onlineClass.gradeIds.length ||
    !onlineClass.selectedDate ||
    !onlineClass.selectedTime ||
    !onlineClass.tutorEmail ||
    creatingOnlineClass ||
    tutorNotAvailableMsg ||
    !selectedClassType;

  useEffect(() => {
    setOnlineClass((prevState) => ({ ...prevState, selectedTime: new Date() }));
  }, []);

  return (
    <div className='create__class' key={formKey}>
      <div className='breadcrumb-container-create'>
        <CommonBreadcrumbs
          componentName='Online Class'
          childComponentName='Create Class'
        />
      </div>
      <div className='create-class-form-container'>
        <form
          autoComplete='off'
          onSubmit={(e) => validateForm(e)}
          key={formKey}
          className='create-class-form'
        >
          <Grid
            container
            className='create-class-container'
            style={{ paddingBottom: 0 }}
            spacing={3}
          >
            <Grid item xs={12} sm={2}>
              <Autocomplete
                size='small'
                onChange={handleClassType}
                id='create__class-type'
                options={classTypes}
                getOptionLabel={(option) => option?.type}
                filterSelectedOptions
                value={selectedClassType}
                required
                renderInput={(params) => (
                  <TextField
                    className='create__class-textfield'
                    {...params}
                    variant='outlined'
                    label='Class Type'
                    placeholder='Class Type'
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                className='create__class-textfield'
                id='class-title'
                label='Title'
                variant='outlined'
                size='small'
                name='title'
                onChange={handleChange}
                required
              />
            </Grid>
            {classTypeId>-1 &&
            <Grid item xs={12} sm={2}>
              <Autocomplete
                size='small'
                multiple
                onChange={handleBranches}
                id='create__class-grade'
                options={branches}
                getOptionLabel={(option) => option?.branch_name}
                filterSelectedOptions
                value={selectedBranches}
                renderInput={(params) => (
                  <TextField
                    className='create__class-textfield'
                    {...params}
                    variant='outlined'
                    label='Branches'
                    placeholder='Branches'
                  />
                )}
              />
            </Grid>}
            <Grid item xs={12} sm={2}>
              <Autocomplete
                size='small'
                multiple
                onChange={(e, value) => {
                  handleGrade(e, value);
                }}
                id='create__class-grade'
                options={grades}
                getOptionLabel={(option) => option?.grade__grade_name}
                filterSelectedOptions
                value={selectedGrades}
                renderInput={(params) => (
                  <TextField
                    className='create__class-textfield'
                    {...params}
                    variant='outlined'
                    label='Grades'
                    placeholder='Grades'
                  />
                )}
              />
            </Grid>
            {selectedClassType?.id > 0 && (
              <Grid item xs={12} sm={2}>
                <Autocomplete
                  size='small'
                  id='create__class-subject'
                  options={courses}
                  getOptionLabel={(option) => option?.course_name}
                  filterSelectedOptions
                  value={selectedCourse}
                  onChange={handleCourse}
                  renderInput={(params) => (
                    <TextField
                      size='small'
                      className='create__class-textfield'
                      {...params}
                      variant='outlined'
                      label='Courses'
                      placeholder='Courses'
                    />
                  )}
                />
              </Grid>
            )}
            {onlineClass.tutorEmail ? (
              <Grid item xs={12} sm={2}>
                <Autocomplete
                  multiple
                  key={sectionSelectorKey}
                  size='small'
                  onChange={(e, value) => {
                    handleSection(e, value);
                  }}
                  id='create__class-section'
                  options={sections}
                  getOptionLabel={(option) => {
                    return `${option.section__section_name}`;
                  }}
                  filterSelectedOptions
                  value={selectedSections}
                  renderInput={(params) => (
                    <TextField
                      className='create__class-textfield'
                      {...params}
                      variant='outlined'
                      label='Sections'
                      placeholder='Sections'
                    />
                  )}
                />
              </Grid>
            ) : (
              ''
            )}
            {onlineClass.tutorEmail ? (
              <>
                {selectedClassType?.id === 0 && (
                  <Grid item xs={12} sm={2}>
                    <Autocomplete
                      multiple
                      size='small'
                      id='create__class-subject'
                      options={subjects?.filter(
                        (sub) =>
                          selectedSections.findIndex(
                            (sec) => sec.section_id === sub.section__id
                          ) > -1
                      )}
                      getOptionLabel={(option) => option.subject__subject_name}
                      filterSelectedOptions
                      value={selectedSubject}
                      onChange={handleSubject}
                      renderInput={(params) => (
                        <TextField
                          size='small'
                          className='create__class-textfield'
                          {...params}
                          variant='outlined'
                          label={'Subjects'}
                          placeholder={'Subjects'}
                        />
                      )}
                    />
                  </Grid>
                )}
              </>
            ) : (
              ''
            )}
            {onlineClass.tutorEmail && (
              <>
                <Grid item xs={12} sm={2}>
                  <TextField
                    size='small'
                    className='create__class-textfield'
                    id='class-duration'
                    label='Duration (mins)'
                    variant='outlined'
                    type='number'
                    name='duration'
                    onChange={handleChange}
                    required
                    InputProps={{ inputProps: { min: 0, maxLength: 3 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    size='small'
                    className='create__class-textfield'
                    id='class-join-limit'
                    label={selectedClassType?.id > 0 ? 'Batch Size' : 'Join limit'}
                    variant='outlined'
                    type='number'
                    name='joinLimit'
                    value={onlineClass.joinLimit}
                    onChange={handleChange}
                    placeholder='Maximum 300'
                    required
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
              </>
            )}
          </Grid>
          <Grid container spacing={3} className='create-class-container'>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <Grid item xs={12} sm={2}>
                <KeyboardDatePicker
                  size='small'
                  // disableToolbar
                  variant='dialog'
                  format='YYYY-MM-DD'
                  margin='none'
                  id='date-picker'
                  label='Start date'
                  value={onlineClass.selectedDate}
                  minDate={new Date()}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <KeyboardTimePicker
                  size='small'
                  margin='none'
                  id='time-picker'
                  label='Start time'
                  format='hh:mm A'
                  value={onlineClass.selectedTime}
                  onChange={handleTimeChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid container className='create-class-container' spacing={3}>
            {toggle ? (
              <>
                <Grid item xs={12} sm={2}>
                  <Autocomplete
                    multiple
                    size='small'
                    id='create__class-subject'
                    options={daysList}
                    getOptionLabel={(option) => option.day}
                    filterSelectedOptions
                    value={selectedDays}
                    onChange={handleDays}
                    renderInput={(params) => (
                      <TextField
                        size='small'
                        className='create__class-textfield'
                        {...params}
                        variant='outlined'
                        label='Days'
                        placeholder='Days'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    size='small'
                    className='create__class-textfield'
                    id='class-no_of_weeks'
                    label='No. of weeks'
                    variant='outlined'
                    type='number'
                    name='weeks'
                    value={onlineClass.weeks}
                    onChange={handleChange}
                    required
                    InputProps={{ inputProps: { min: 0, max: 12, maxLength: 2 } }}
                  />
                </Grid>
              </>
            ) : null}
            <Grid item xs={12} sm={2}>
              <FormControlLabel
                className='switchLabel'
                control={
                  <Switch
                    checked={toggle}
                    onChange={() => setToggle((toggle) => !toggle)}
                    name='optional'
                    color='primary'
                  />
                }
                label={toggle ? 'Recurring' : 'Normal'}
              />
            </Grid>
          </Grid>
          <hr className='horizontal-line' />
          <Grid
            container
            className='create-class-container'
            style={{ paddingBottom: 5 }}
            spacing={2}
          >
            <Grid item xs={11} sm={7} md={4}>
              <Autocomplete
                size='small'
                id='create__class-tutor-email'
                options={tutorEmailList}
                getOptionLabel={(option) => option.email}
                filterSelectedOptions
                value={onlineClass.tutorEmail}
                onChange={handleTutorEmail}
                disabled={tutorEmailsLoading}
                ref={tutorEmailRef}
                renderInput={(params) => (
                  <TextField
                    size='small'
                    className='create__class-textfield'
                    {...params}
                    variant='outlined'
                    label='Tutor Email'
                    placeholder='Tutor Email'
                    required
                  />
                )}
              />

              <span className='alert__email'>{tutorNotAvailableMsg}</span>
              {/* <TextField
                className='create__class-textfield'
                id='class-tutor-email'
                label='Tutor email'
                variant='outlined'
                size='small'
                onChange={handleTutorEmail}
                onBlur={handleBlur}
                disabled={
                  !onlineClass.duration ||
                  !onlineClass.subject ||
                  !onlineClass.gradeIds.length
                }
                value={onlineClass.tutorEmail}
                required
              />
              {!onlineClass.duration ||
              !onlineClass.subject ||
              !onlineClass.gradeIds.length ? (
                <span style={{ color: 'red' }}>
                  *This input field will be enabled once grade, subject and duration are
                  selected
                </span>
              ) : (
                ''
              )}
              {onlineClass.tutorEmail && !onlineClass.tutorEmail.match(emailRegExp) ? (
                <span className='alert__email'>Please enter a valid email</span>
              ) : (
                ''
              )} */}
            </Grid>
            <Grid item xs={1} sm={4}>
              {isTutorEmailValid ? (
                <CheckCircleIcon style={{ fill: 'green', marginTop: 8 }} />
              ) : (
                ''
              )}
              {tutorEmailsLoading ? <CircularProgress color='secondary' /> : ''}
            </Grid>
          </Grid>
          <Grid container className='create-class-container' spacing={2}>
            <Grid item>
              <Button
                variant='contained'
                color='primary'
                onClick={toggleDrawer}
                disabled={!onlineClass.tutorEmail}
              >
                Filter students
              </Button>
            </Grid>
          </Grid>
          <Grid container>
            <SwipeableDrawer
              className='my__swipable'
              anchor='right'
              open={isDrawerOpen}
              onClose={toggleDrawer}
              onOpen={toggleDrawer}
            >
              <FilterStudents />
            </SwipeableDrawer>
          </Grid>
          {onlineClass.tutorEmail && (
            <>
              {' '}
              <hr className='horizontal-line' />
              {/* {onlineClass.tutorEmail && ( */}
              <Grid container className='create-class-container' spacing={2}>
                <Grid item xs={12}>
                  <h2 className='co_host-title'>Co-Host</h2>
                </Grid>

                <Grid item xs={11} sm={5}>
                  <Autocomplete
                    size='small'
                    multiple
                    id='create__class-tutor-email'
                    options={tutorEmailList.filter(
                      (email) => email.email !== onlineClass.tutorEmail?.email
                    )}
                    getOptionLabel={(option) => option.email}
                    filterSelectedOptions
                    value={onlineClass.coHosts}
                    onChange={handleCoHost}
                    disabled={tutorEmailsLoading}
                    renderInput={(params) => (
                      <TextField
                        size='small'
                        className='create__class-textfield'
                        {...params}
                        variant='outlined'
                        label='Tutor Email'
                        placeholder='Tutor Email'
                      />
                    )}
                  />
                </Grid>

                {/* {onlineClass.coHosts.map((el, index) => (
              <>
                <Grid item xs={11} sm={5} key={el}>
                  <TextField
                    size='small'
                    id='class-cohost-email'
                    label='Cohost email address'
                    variant='outlined'
                    value={el.email}
                    inputProps={{ maxLength: 40 }}
                    onChange={(event) => {
                      handleCohostEmail(event, index);
                    }}
                    onBlur={() => {
                      handleCoHostBlur(index);
                    }}
                  />
                </Grid>
                <Grid item xs={1} key={el}>
                  {onlineClass.coHosts[index].isValid &&
                  onlineClass.coHosts[index].isValid !== false ? (
                    <CheckCircleIcon
                      style={{ fill: 'green', marginTop: 8 }}
                      onClick={() => {
                        removeCohost(index);
                      }}
                    />
                  ) : onlineClass.coHosts[index].isValid === false ? (
                    <CancelIcon
                      style={{ fill: 'red', marginTop: 8 }}
                      onClick={() => {
                        removeCohost(index);
                      }}
                    />
                  ) : (
                    ''
                  )}
                  <RemoveCircleIcon
                    style={{ marginTop: 8 }}
                    onClick={() => {
                      removeCohost(index);
                    }}
                  />
                </Grid>
              </>
            ))} */}
              </Grid>
            </>
          )}
          {/* )} */}
          {/* <Grid container>
            <Button
              onClick={handleAddCohosts}
              className='btn-addmore'
              variant='contained'
              color='primary'
              size='small'
              startIcon={<AddCircleIcon style={{ fill: '#fff' }} />}
            >
              Add cohost
            </Button>
          </Grid> */}
          <hr className='horizontal-line-last' />
          <Grid container className='create-class-container' spacing={2}>
            <Grid item xs={12} sm={2}>
              <Button
                variant='contained'
                size='medium'
                style={{ width: '100%', color: '#8c8c8c' }}
                onClick={handleClear}
              >
                Clear all
              </Button>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                disabled={createBtnDisabled}
                variant='contained'
                color='primary'
                size='medium'
                type='submit'
                style={{ width: '100%' }}
              >
                {creatingOnlineClass ? 'Please wait.Creating new class' : 'Create class'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
};

export default withRouter(CreateClassForm);
