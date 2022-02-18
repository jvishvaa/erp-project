import React, { useContext, useEffect, useState, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import { CreateclassContext } from './create-class-context/create-class-state';
import FilterStudents from './filter-students';
import {
  getPopup,
  getFormatedTime,
  initialFormStructure,
  isBetweenNonSchedulingTime,
} from './utils';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import './create-class.scss';
import axiosInstance from '../../../config/axios';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { fetchBranchesForCreateUser } from '../../../redux/actions';
import Loader from '../../../components/loader/loader';
import ReminderDialog from './reminderDialog';
import APIREQUEST from '../../../config/apiRequest';

const CreateClassForm = (props) => {
  const tutorEmailRef = useRef(null);
  const [onlineClass, setOnlineClass] = useState(initialFormStructure);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [formKey, setFormKey] = useState(new Date());
  const [sectionSelectorKey, setSectionSelectorKey] = useState(new Date());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [moduleId, setModuleId] = useState();
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [tutorNotAvailableMsg, setTutorNotAvailableMessage] = useState(null);
  const [selectedClassType, setSelectedClassType] = useState('');
  const [branches, setBranches] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [classWork, setToggleClasswork] = useState(true);

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
    classTypeId,
    setClassTypeId,
    setLoading,
    loading,
  } = useContext(CreateclassContext);

  const [toggle, setToggle] = useState(false);
  // const [toggleZoom, setToggleZoom] = useState(false);

  const { setAlert } = useContext(AlertNotificationContext);
  const { user_id: userId, is_superuser: isSuperUser } =
    JSON.parse(localStorage.getItem('userDetails')) || {};

  const fetchBranches = (acadId) => {
    fetchBranchesForCreateUser(acadId, moduleId).then((data) => {
      const transformedData = data?.map((obj) => ({
        id: obj.id,
        branch_name: obj.branch_name,
      }));
      transformedData.unshift({
        branch_name: 'Select All',
        id: 'all',
      });
      setBranches(transformedData);
    });
  };

  const [daysList, setDays] = useState([
    { id: 0, day: 'Sunday', send: 'S' },
    { id: 1, day: 'Monday', send: 'M' },
    { id: 2, day: 'Tuesday', send: 'T' },
    { id: 3, day: 'Wednesday', send: 'W' },
    { id: 4, day: 'Thursday', send: 'TH' },
    { id: 5, day: 'Friday', send: 'F' },
    { id: 6, day: 'Saturday', send: 'SA' },
  ]);

  const [classTypes, setClassTypes] = useState([
    { id: 0, type: 'Compulsory Class' },
    /* { id: 1, type: 'Optional Class' },
    { id: 2, type: 'Special Class' },
    { id: 3, type: 'Parent Class' }, */
  ]);

  useEffect(() => {
    if (NavData && NavData?.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Online Class' &&
          item.child_module &&
          item.child_module?.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Create Class') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (selectedYear && moduleId) {
      fetchBranches(selectedYear?.id);
    }
  }, [selectedYear, moduleId]);

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
      setSelectedGrades([]);
      setSelectedSections([]);
      setSelectedSubject([]);
      setSelectedClassType('');
      // setSelectedYear('');
      setSelectedBranches([]);
      setSelectedCourse('');
      setTutorNotAvailableMessage(null);
      setToggle(false);
      // setToggleZoom(false);
      setSelectedDays([]);
      setOnlineClass((prevState) => ({
        ...prevState,
        ...initialFormStructure,
        selectedTime: new Date(),
        creatingOnlineClass: false,
        coHosts: [],
      }));
      dispatch(resetContext());
      dispatch(clearGrades());
      dispatch(clearSections());
      dispatch(clearSubjects());
      dispatch(clearCourses());
      setAlert('success', 'Successfully created the class');
      dispatch(listGradesCreateClass(onlineClass?.branchIds, moduleId, selectedYear.id));
    }
  }, [isCreated]);

  const handleClassType = (event, value) => {
    setSelectedClassType('');
    dispatch(setClassTypeId(null));
    handleClear();
    if (value) {
      setSelectedClassType(value);
      dispatch(setClassTypeId(value.id));
    }
  };

  const handleBranches = (event, value) => {
    setSelectedBranches([]);
    setSelectedGrades([]);
    setSelectedSections([]);
    setSelectedSubject([]);
    dispatch(clearSections());
    dispatch(clearSubjects());
    dispatch(clearCourses());
    if (value?.length > 0) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...branches].filter(({ id }) => id !== 'all')
          : value;
      const ids = value.map((obj) => obj.id);
      setSelectedBranches(value);
      dispatch(listGradesCreateClass(ids, moduleId, selectedYear.id));
      setOnlineClass((prevState) => ({
        ...prevState,
        branchIds: ids,
        acadId: selectedYear?.id,
      }));
    } else {
      setOnlineClass((prevState) => ({
        ...prevState,
        branchIds: [],
        gradeIds: [],
        sectionIds: [],
        subject: [],
      }));
      dispatch(clearGrades());
    }
  };

  const handleGrade = (event, value) => {
    dispatch(clearFilteredStudents());
    setSelectedGrades(value);
    if (value?.length > 0) {
      const ids = value.map((el) => el.grade_id);
      setOnlineClass((prevState) => ({ ...prevState, gradeIds: ids }));
      dispatch(clearTutorEmailValidation());
      if (selectedClassType?.id > 0) dispatch(listCoursesCreateClass(ids));
    } else {
      setOnlineClass((prevState) => ({
        ...prevState,
        gradeIds: [],
        sectionIds: [],
        subject: [],
      }));
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
    setSelectedSections(value);
    setSelectedSubject([]);
    if (value?.length) {
      const ids = value.map((el) => el.id);
      const sectionIds = value.map((el) => el.section_id);
      setOnlineClass((prevState) => ({ ...prevState, sectionIds: ids }));
    } else {
      setOnlineClass((prevState) => ({ ...prevState, sectionIds: [], subject: [] }));
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
    setSelectedSubject(value);
    if (value?.length) {
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
    const { gradeIds, sectionIds, subject, branchIds } = onlineClass;
    let listStudentUrl = `branch_ids=${branchIds.join(',')}`;
    if (selectedClassType?.id === 0) {
      if (gradeIds?.length && sectionIds?.length && subject?.length) {
        listStudentUrl = `section_mapping_ids=${sectionIds.join(
          ','
        )}&subject_ids=${subject.join(',')}`;

        dispatch(listStudents(listStudentUrl));
      } else {
        clearStudentsList();
      }
    } else if (selectedClassType?.id > 0) {
      if (gradeIds?.length > 0 && sectionIds?.length > 0) {
        listStudentUrl = `section_mapping_ids=${sectionIds.join(',')}`;
        dispatch(listStudents(listStudentUrl));
      } else if (gradeIds?.length > 0 && branchIds?.length > 0) {
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
    if (
      selectedClassType?.id === 0 &&
      (!gradeIds?.length || !sectionIds?.length || !subject?.length)
    ) {
      setAlert('error', 'Please provide values for grades, sections and subjects');
      return;
    } else if (selectedClassType?.id > 0 && (!gradeIds?.length || !courseId)) {
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
    setSelectedSections([]);
    setSelectedSubject([]);
    dispatch(clearFilteredStudents());
    if (onlineClass.coHosts?.length > 0) {
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
          gradeIds,
          onlineClass?.branchIds,
          onlineClass?.acadId
        )
      );
    } else {
      setTutorNotAvailableMessage(null);
    }
  };

  const resolveSelectedDays = (val) => {
    if (toggle && [...selectedDays].length) {
      return [...selectedDays].map((obj) => obj.send);
    }
    return [daysList[new Date(val).getDay()]?.send] || [];
  };

  const handleDateChange = (event, value) => {
    const isFutureTime = onlineClass.selectedTime > new Date();
    if (!isFutureTime) {
      setOnlineClass((prevState) => ({ ...prevState, selectedTime: new Date() }));
    }
    dispatch(clearTutorEmailValidation());
    setOnlineClass((prevState) => ({
      ...prevState,
      selectedDate: moment(value).format('YYYY-MM-DD'),
      days: resolveSelectedDays(value),
    }));
  };

  const validateClassTime = (time) => {
    let isValidTime = false;
    const CLASS_HOURS = time.getHours();
    const CLASS_MINUTES = time.getMinutes();
    if (CLASS_HOURS >= 6 && CLASS_HOURS <= 22) {
      isValidTime = true;
      if (CLASS_HOURS === 22 && CLASS_MINUTES > 30) isValidTime = false;
    }
    return isValidTime;
  };

  const handleTimeChange = (event) => {
    const { selectedDate } = onlineClass;
    const time = new Date(event);
    if (validateClassTime(time)) {
      dispatch(clearTutorEmailValidation());
      setOnlineClass((prevState) => ({ ...prevState, selectedTime: time }));
    } else {
      setAlert('error', 'Class must be between 06:00AM - 10:30PM');
    }
  };

  const [selectedDays, setSelectedDays] = useState([]);
  const [daysLength, setDaysLength] = useState(0);
  const handleDays = (event, value) => {
    setSelectedDays(value);
    if (value?.length > 0) {
      setDaysLength((prev) => prev + 1);
      const sendData = value.map((obj) => obj.send);
      setOnlineClass((prevState) => ({ ...prevState, days: sendData }));
    } else {
      setDaysLength((prev) => prev - 1);
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
    dispatch(listGradesCreateClass(onlineClass?.branchIds, moduleId, selectedYear.id));
  };
  const handleCreateClass = () => {
    const {
      title,
      branchIds,
      subject,
      duration,
      is_zoom,
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

    const startTime = `${
      selectedDate.toString().includes(' ')
        ? selectedDate.toISOString().split('T')[0]
        : moment(selectedDate).format('YYYY-MM-DD')
    } ${getFormatedTime(selectedTime)}`;
    const coHostEmails = coHosts.map((coHost) => coHost?.email);
    const tutorEmails = [tutorEmail.email, ...coHostEmails];
    let request = {};
    request['user_id'] = userId;
    request['title'] = title;
    request['duration'] = duration;

    var unique = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    request['grade'] = gradeIds.filter(unique);
    request['branch'] = branchIds;

    if (selectedClassType?.id === 0) {
      request['subject_id'] = subject.join(',');
    } else if (selectedClassType?.id > 0) {
      request['course'] = courseId;
    }
    request['tutor_id'] = tutorEmail.tutor_id;
    request['auth_user_id'] = tutorEmail.user__id;
    request['tutor_erp'] = tutorEmail.name;
    request['tutor_emails'] = tutorEmails.join(',');
    request['role'] = 'Student';
    request['start_time'] = startTime;
    if (weeks > 0) request['no_of_week'] = Number(weeks);
    request['is_recurring'] = toggle ? 1 : 0;
    // request['is_zoom'] = toggleZoom ? '0' : '1';
    request['class_type'] = selectedClassType?.id;
    request['section_mapping_ids'] = sectionIds.join(',');
    request['is_classwork'] = classWork ? true : false;

    if (duration > 240) {
      setAlert('warning', 'Duration MAX Limit 240mins');
      setLoading(false);
      return;
    }

    if (selectedClassType?.id === 0) {
      request['week_days'] = days;
    } else {
      if (!Array.isArray(days)) request['week_days'] = [days];
      else request['week_days'] = days.map((ob) => ob);
    }

    if (selectedClassType?.id === 0) {
      if (filteredStudents?.length > 0) request['student_ids'] = filteredStudents;
      if (joinLimit > 0) {
        request['join_limit'] = joinLimit;
        dispatch(createNewOnlineClass(request));
      } else {
        setLoading(false);
        setAlert('warning', 'Join limit should be atleast 1.');
      }
    } else if (selectedClassType?.id > 0) {
      request['price'] = 0;
      request['final_price'] = 0;
      if (joinLimit > 0 && filteredStudents?.length > 0) {
        request['student_ids'] = filteredStudents;
        request['join_limit'] = joinLimit;
        dispatch(createSpecialOnlineClass(request));
      } else {
        setLoading(false);
        if (joinLimit <= 0) setAlert('warning', 'Batch size should be atleast 1.');
        if (filteredStudents?.length <= 0)
          setAlert('warning', 'No. of students should be atleast 1.');
      }
    }
  };

  useEffect(() => {
    if (!creatingOnlineClass) {
      setLoading(false);
    }
  }, [creatingOnlineClass]);

  const validateForm = (e) => {
    setLoading(true);
    callGrades();
    e.preventDefault();
    if (!validateClassTime(onlineClass?.selectedTime)) {
      setAlert('error', 'Class must be between 06:00AM - 10:30PM');
      return;
    }
    if (getPopup()) {
      setOpenModal(true);
    } else {
      handleCreateClass();
    }
  };

  const handleClear = () => {
    setFormKey(new Date());
    setSelectedGrades([]);
    setSelectedSections([]);
    setSelectedSubject([]);
    // setSelectedYear('');
    // setBranches([]);
    setSelectedClassType('');
    setSelectedBranches([]);
    setSelectedCourse('');
    setTutorNotAvailableMessage(null);
    setToggle(false);
    // setToggleZoom(false);
    setSelectedDays([]);
    setOnlineClass((prevState) => ({
      ...prevState,
      ...initialFormStructure,
      selectedTime: new Date(),
      creatingOnlineClass: false,
      coHosts: [],
    }));
    dispatch(resetContext());
    dispatch(clearFilteredStudents());
    dispatch(clearGrades());
    dispatch(clearSections());
    dispatch(clearSubjects());
    dispatch(clearCourses());
  };

  const fetchTutorEmails = () => {
    const data = {
      branchIds: onlineClass.branchIds.join(','),
      gradeIds: onlineClass.gradeIds.join(','),
      acadYears: onlineClass.acadId,
    };
    listTutorEmails(data);
  };

  const chkLaunchDateMsApi = (selectedDate) => {
    if (JSON.parse(localStorage.getItem('isMsAPI'))) {
      let launchDate = localStorage.getItem('launchDate');
      if (moment(selectedDate, 'YYYY-MM-DD') > moment(launchDate, 'YYYY-MM-DD')) {
        return true;
      }
      return false;
    }
    return false;
  };

  const checkTutorAvailability = async () => {
    const { selectedDate, selectedTime, duration, is_zoom } = onlineClass;

    const startTime = `${
      selectedDate.toString().includes(' ')
        ? selectedDate.toISOString().split('T')[0]
        : moment(selectedDate).format('YYYY-MM-DD')
    } ${getFormatedTime(selectedTime)}`;
    try {
      let url = toggle
        ? `?tutor_email=${
            onlineClass.tutorEmail.email
          }&start_time=${startTime}&duration=${duration}&no_of_week=${
            onlineClass.weeks
          }&is_recurring=1&week_days=${[...selectedDays]
            .map((obj) => obj.send)
            .join(',')}`
        : `?tutor_email=${onlineClass.tutorEmail.email}&start_time=${startTime}&duration=${duration}&is_zoom=${onlineClass.is_zoom}`;
      const { data } = chkLaunchDateMsApi(selectedDate)
        ? await APIREQUEST('get', `/oncls/v1/tutor-availability/${url}`)
        : await axiosInstance.get('/erp_user/check-tutor-time/' + url);
      if (data.status_code === 200) {
        if (data.status === 'success') {
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
        selectedDate: onlineClass?.selectedDate,
        weeks: '',
        days: [daysList[new Date(onlineClass?.selectedDate).getDay()]?.send] || [],
      }));
    }
  }, [toggle]);

  const checkTutorFlag = toggle
    ? onlineClass.duration &&
      onlineClass.subject &&
      onlineClass.gradeIds?.length &&
      onlineClass.selectedDate &&
      onlineClass.selectedTime &&
      onlineClass.tutorEmail &&
      onlineClass.weeks &&
      daysLength
    : onlineClass.duration &&
      onlineClass.subject &&
      onlineClass.gradeIds?.length &&
      onlineClass.selectedDate &&
      onlineClass.selectedTime &&
      onlineClass.tutorEmail;

  useEffect(() => {
    if (checkTutorFlag) {
      // fetchTutorEmails();
      checkTutorAvailability();
    }
  }, [
    onlineClass.duration,
    onlineClass.subject,
    onlineClass.gradeIds?.length,
    onlineClass.selectedDate,
    onlineClass.selectedTime,
    onlineClass.tutorEmail,
    onlineClass.weeks,
    daysLength,
  ]);

  useEffect(() => {
    if (onlineClass.branchIds?.length && selectedGrades?.length && onlineClass.acadId) {
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
    onlineClass.title.trim() === '' ||
    !onlineClass.duration ||
    !onlineClass.gradeIds?.length ||
    !onlineClass.sectionIds?.length ||
    !onlineClass.subject?.length ||
    !onlineClass.selectedDate ||
    !onlineClass.selectedTime ||
    !onlineClass.tutorEmail ||
    creatingOnlineClass ||
    tutorNotAvailableMsg !== '';

  useEffect(() => {
    setOnlineClass((prevState) => ({ ...prevState, selectedTime: new Date() }));
  }, []);
  return (
    <div className='create__class' key={formKey}>
      {loading && <Loader />}
      <CommonBreadcrumbs
        componentName='Online Class'
        childComponentName='Create Class'
        isAcademicYearVisible={true}
      />
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
                limitTags={2}
                onChange={handleClassType}
                id='create__class-type'
                options={classTypes}
                getOptionLabel={(option) => option?.type || ''}
                filterSelectedOptions
                className='dropdownIcon'
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
                className='dropdownIcon'
                name='title'
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Autocomplete
                size='small'
                limitTags={2}
                multiple
                onChange={handleBranches}
                id='create__class-grade'
                className='dropdownIcon'
                options={branches || []}
                getOptionLabel={(option) => option?.branch_name || ''}
                filterSelectedOptions
                value={selectedBranches || []}
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
            </Grid>
            <Grid item xs={12} sm={2}>
              <Autocomplete
                size='small'
                limitTags={2}
                multiple
                onChange={(e, value) => {
                  handleGrade(e, value);
                }}
                id='create__class-grade'
                className='dropdownIcon'
                options={grades}
                getOptionLabel={(option) => option?.grade__grade_name || ''}
                filterSelectedOptions
                value={selectedGrades || []}
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
                  limitTags={2}
                  id='create__class-subject'
                  className='dropdownIcon'
                  options={courses || []}
                  getOptionLabel={(option) => option?.course_name || ''}
                  filterSelectedOptions
                  value={selectedCourse || ''}
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
                  limitTags={2}
                  key={sectionSelectorKey}
                  size='small'
                  onChange={(e, value) => {
                    handleSection(e, value);
                  }}
                  id='create__class-section'
                  className='dropdownIcon'
                  options={sections || []}
                  getOptionLabel={(option) => {
                    return `${option.section__section_name}`;
                  }}
                  filterSelectedOptions
                  value={selectedSections || []}
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
            {onlineClass.tutorEmail && onlineClass.sectionIds?.length > 0 ? (
              <>
                {selectedClassType?.id === 0 && (
                  <Grid item xs={12} sm={2}>
                    <Autocomplete
                      multiple
                      limitTags={2}
                      size='small'
                      id='create__class-subject'
                      options={subjects || []}
                      className='dropdownIcon'
                      getOptionLabel={(option) => option?.subject__subject_name || ''}
                      filterSelectedOptions
                      value={selectedSubject || []}
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
                    className='create__class-textfield dropdownIcon'
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
                    className='create__class-textfield dropdownIcon'
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
                  format='MM/DD/YYYY'
                  margin='none'
                  InputProps={{ readOnly: true }}
                  id='date-picker'
                  label='Start date'
                  value={onlineClass?.selectedDate}
                  minDate={new Date()}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <KeyboardTimePicker
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
                  margin='none'
                  id='time-picker'
                  label='Start time'
                  InputProps={{ readOnly: true }}
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
            <Grid item md={2} xs={12} sm={3}>
              <FormControlLabel
                className='switchLabel'
                control={
                  <Switch
                    checked={classWork == true ? 1 : 0}
                    onChange={() => setToggleClasswork((classWork) => !classWork)}
                    name='is_classwork'
                    color='primary'
                  />
                }
                label={<Typography color='secondary'>ClassWork</Typography>}
              />
            </Grid>
            {toggle ? (
              <>
                <Grid item xs={12} sm={2}>
                  <Autocomplete
                    multiple
                    size='small'
                    limitTags={2}
                    id='create__class-subject'
                    options={daysList || []}
                    getOptionLabel={(option) => option.day || ''}
                    filterSelectedOptions
                    value={selectedDays || []}
                    onChange={handleDays}
                    className='dropdownIcon'
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
                    className='create__class-textfield dropdownIcon'
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
                label={
                  <Typography color='secondary'>
                    {toggle ? 'Recurring' : 'Normal'}
                  </Typography>
                }
              />
            </Grid>
            {/* <Grid item md={1} xs={12} sm={2}>
              <FormControlLabel
                className='switchLabel'
                control={
                  <Switch
                    checked={toggleZoom == true ? 1 : 0}
                    onChange={() => setToggleZoom((toggleZoom) => !toggleZoom)}
                    name='is_zoom'
                    color='primary'
                  />
                }
                label={
                  <Typography color='secondary'>
                    {toggleZoom ? 'edXstream' : 'Zoom'}
                  </Typography>
                }
              />
            </Grid> */}
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
                limitTags={2}
                id='create__class-tutor-email'
                options={tutorEmailList}
                getOptionLabel={(option) => option?.name || ''}
                filterSelectedOptions
                value={onlineClass.tutorEmail}
                onChange={handleTutorEmail}
                className='dropdownIcon'
                disabled={tutorEmailsLoading}
                ref={tutorEmailRef}
                renderInput={(params) => (
                  <TextField
                    size='small'
                    className='create__class-textfield'
                    {...params}
                    variant='outlined'
                    label='Tutor Name'
                    placeholder='Tutor Name'
                    required
                  />
                )}
              />

              <span className='alert__email'>{tutorNotAvailableMsg}</span>
            </Grid>
            <Grid item xs={1} sm={4}>
              {tutorNotAvailableMsg === '' ? (
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
                className='buttonClass'
                onClick={toggleDrawer}
                disabled={!onlineClass.tutorEmail}
                style={{ borderRadius: '10px' }}
              >
                Filter students
              </Button>
            </Grid>
          </Grid>
          <Grid container className='swipe-container'>
            <SwipeableDrawer
              className='my__swipable'
              id='private_swipe'
              anchor='right'
              open={isDrawerOpen}
              onClose={toggleDrawer}
              onOpen={toggleDrawer}
            >
              <FilterStudents onClose={toggleDrawer} />
            </SwipeableDrawer>
          </Grid>
          {onlineClass.tutorEmail && (
            <>
              {' '}
              <hr className='horizontal-line' />
              <Grid container className='create-class-container' spacing={2}>
                <Grid item xs={12}>
                  <h2 className='co_host-title' style={{ textAlign: 'initial' }}>
                    Co-Host
                  </h2>
                </Grid>

                <Grid item xs={11} sm={5}>
                  <Autocomplete
                    size='small'
                    multiple
                    limitTags={2}
                    id='create__class-tutor-email'
                    options={tutorEmailList.filter(
                      (email) => email.email !== onlineClass.tutorEmail?.email
                    )}
                    getOptionLabel={(option) => option?.name || ''}
                    filterSelectedOptions
                    value={onlineClass?.coHosts}
                    onChange={handleCoHost}
                    className='dropdownIcon'
                    disabled={tutorEmailsLoading}
                    renderInput={(params) => (
                      <TextField
                        size='small'
                        className='create__class-textfield'
                        {...params}
                        variant='outlined'
                        label='Tutor Name'
                        placeholder='Tutor Name'
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </>
          )}

          <hr className='horizontal-line-last' />
          <Grid container className='create-class-container' spacing={2}>
            <Grid item xs={12} sm={2}>
              <Button
                variant='contained'
                size='medium'
                style={{ borderRadius: '10px', width: '100%', color: '#8c8c8c' }}
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
                style={{ borderRadius: '10px', width: '100%' }}
              >
                {creatingOnlineClass ? 'Please wait.Creating new class' : 'Create class'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      {openModal && (
        <ReminderDialog
          createClass={() => handleCreateClass()}
          onlineClass={onlineClass}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
    </div>
  );
};

export default withRouter(CreateClassForm);
