import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import CommonBreadcrumbs from '../common-breadcrumbs/breadcrumbs';
import { Autocomplete } from '@material-ui/lab';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import Loader from '../loader/loader';
import './style.scss';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { DashboardContext } from '../../containers/dashboard/dashboard-context/index.js';
import { fetchBranchesForCreateUser } from '../../redux/actions';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  MenuItem,
} from '@material-ui/core';
import moment from 'moment';
import Testpagination from './tablePagination';

const column = [
  'Sl No.',
  'Meeting Name',
  'Meeting Date',
  'Meeting Time',
  'Student',
  'Teacher',
  'Attended',
  'Actions',
];

const ConnectionPodFn = (props) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const { is_superuser } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const { erp_user_id } =
    JSON.parse(localStorage.getItem('userDetails'))?.role_details || {};

  const {
    welcomeDetails: { userLevel = 1 },
  } = useContext(DashboardContext);

  const [loading, setLoading] = useState(false);
  const [meetingData, setMeetingData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [studentList, setStudentList] = useState(null);
  const [teacherList, setTeacherList] = useState(null);
  const [branchList, setBranchList] = useState(null);

  const [meetingName, setMeetingName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableSlot, setAvailableSlot] = useState(null);
  const [accordianOpen, setAccordianOpen] = useState(false);

  const [data, setData] = useState({
    dataPerPage: 10,
    totalData: null,
    totalPages: null,
    currentPage: 1,
  });

  const [filterInput, setFilterInput] = useState({
    branchFilter: '',
    gradeFilter: '',
    sectionFilter: '',
    meetingNameFilter: '',
    meetingDateFilter: '',
    studentNameFilter: '',
    teacherNameFilter: '',
    meetingTypeFilter: 'upcoming',
  });

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState();
  const selectedYear = useSelector((state) => state.commonFilterReducer?.selectedYear);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGradeID, setSelectedGradeID] = useState([]);
  const [sectionList, setSectionList] = useState([]);

  const [branchID, setBranchID] = useState(undefined);
  const [gradeID, setGradeID] = useState(undefined);
  const [teacherID, setTeacherID] = useState(undefined);
  const [sectionID, setSectionID] = useState(undefined);
  const [studentID, setStudentID] = useState(undefined);

  const [selectedBranch, setSelectedBranch] = useState({});
  const [selectedGrade, setSelectedGrade] = useState({});
  const [selectedTeacher, setSelectedTeacher] = useState({});
  const [selectedSection, setSelectedSection] = useState({});
  const [selectedStudent, setSelectedStudent] = useState({});

  const [filterBranchList, setFilterBranchList] = useState([]);
  const [selectedFilterBranch, setSelectedFilterBranch] = useState({});

  const [filterGradeList, setFilterGradeList] = useState([]);
  const [selectedFilterGrade, setSelectedFilterGrade] = useState({});

  const [filterSectionList, setFilterSectionList] = useState([]);
  const [selectedFilterSection, setSelectedFilterSection] = useState({});

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
    if (userLevel !== 4 && selectedYear && moduleId && dialogOpen) {
      fetchBranches(selectedYear?.id);
    }
  }, [selectedYear, moduleId, dialogOpen]);

  const fetchBranches = (acadId) => {
    fetchBranchesForCreateUser(acadId, moduleId).then((data) => {
      const transformedData = data?.map((obj) => ({
        id: obj.id,
        branch_name: obj.branch_name,
      }));
      setBranchList(transformedData);
    });
  };

  useEffect(() => {
    if (userLevel !== 4) {
      fetchFilterBranchList();
      fetchFilterGradeList();
      fetchFilterSectionList();
    }
    if (checkGetStudentCondition()) {
      getstudentList(searchText);
    }
    var date = new Date();
    setDate(moment(date).format('YYYY-MM-DD'));
  }, []);

  useEffect(() => {
    getAvailableSlot(date, studentID);
  }, [date, studentID]);

  const handleBranch = (e, value) => {
    if (value) {
      setBranchID(value.id);
      setSelectedBranch(value);
    }
    // else if (value === null) {
    // }
    setSelectedGrade({});
    setSelectedTeacher({});
    setSelectedSection({});
    setSelectedStudent({});
  };

  useEffect(() => {
    if (branchID !== undefined) {
      newFetchGradesListFn([branchID], moduleId, selectedYear.id);
    }
  }, [branchID]);

  const newFetchGradesListFn = async (branch, moduleId, acadId) => {
    try {
      const { data } = await axiosInstance.get(
        `${endpoints.academics.grades}?session_year=${acadId}&branch_id=${branch.join(
          ','
        )}&module_id=${moduleId}`
      );
      if (data.status === 'success') {
        setGradeList(data.data);
      } else throw new Error(data?.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGrade = (e, value) => {
    if (value) {
      const data = {
        branchIds: [branchID],
        gradeIds: [value.grade_id],
        acadYears: selectedYear.id,
      };
      setGradeID(value.grade_id);
      newFetchTeacherListFn(data);
      setSelectedGrade(value);
    }
    setSelectedTeacher({});
    setSelectedSection({});
    setSelectedStudent({});
  };

  const newFetchTeacherListFn = async (reqData) => {
    const { branchIds, gradeIds, acadYears } = reqData;
    try {
      const { data } = await axiosInstance.get(
        `/erp_user/teacher-list/?branch_id=${branchIds}&grade_id=${gradeIds}&session_year=${acadYears}`
      );
      if (data.status === 'success') {
        setTeacherList(data.data);
        setSelectedGradeID(gradeIds);
      } else throw new Error(data?.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTeacher = (e, value) => {
    if (value) {
      newFetchSessionListFn(
        value.roles,
        moduleId,
        value.tutor_id,
        is_superuser ? 1 : 0,
        selectedGradeID,
        [branchID],
        selectedYear.id
      );
      setTeacherID(value.tutor_id);
      setSelectedTeacher(value);
    }
    setSelectedSection({});
    setSelectedStudent({});
  };

  const newFetchSessionListFn = async (
    roleId,
    moduleId,
    erpId,
    isSuperUser,
    gradeIds,
    branchIds,
    acadId
  ) => {
    try {
      const { data } = await axiosInstance.get(
        `/erp_user/sub-sec-list/?role=${roleId}&module_id=${moduleId}&erp_id=${erpId}&is_super=${isSuperUser}&grade_id=${gradeIds.join(
          ','
        )}&branch_id=${branchIds.join(',')}&session_year=${acadId}`
      );
      if (data.status === 'success') {
        setSectionList(data.data.section);
      } else throw new Error(data?.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSection = (e, value) => {
    let url;
    if (value) {
      url = `section_mapping_ids=${value.id}`;
      setSectionID(value.id);
      newFetchStudentListFn(url);
      setSelectedSection(value);
    }
    setSelectedStudent({});
  };

  const newFetchStudentListFn = async (url) => {
    try {
      const { data } = await axiosInstance.get(
        `${endpoints.onlineClass.filterStudent}?${url}`
      );
      if (data.status === 'success') {
        setStudentList(data.data);
      } else throw new Error(data?.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStudent = (e, value) => {
    if (value) {
      setStudentID(value.id);
      setSelectedStudent(value);
    }
  };

  useEffect(() => {
    if (checkGetStudentCondition()) {
      getstudentList(searchText);
    }
  }, [selectedSection]);

  const checkGetStudentCondition = () => {
    let roleFlag = false;
    let brachFlag = false;
    let sectionFlag = false;
    let gradeFlag = false;

    if (userLevel !== 4) {
      roleFlag = true;
    }
    if (selectedSection?.branch_id !== undefined) {
      brachFlag = true;
    }
    if (selectedSection?.section_id !== undefined) {
      sectionFlag = true;
    }
    if (selectedSection?.grade_id !== undefined) {
      gradeFlag = true;
    }

    if (roleFlag && brachFlag && sectionFlag && gradeFlag) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    getMeetingData(data.currentPage);
  }, [data.currentPage, data.dataPerPage]);

  const fetchFilterBranchList = async () => {
    try {
      const { data } = await axiosInstance.get(
        `${endpoints.masterManagement.branchList}`
      );
      if (data.message === 'success') {
        setFilterBranchList(data.data);
      } else throw new Error(data?.message);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFilterGradeList = async () => {
    try {
      const { data } = await axiosInstance.get(`${endpoints.masterManagement.grades}`);
      if (data.status_code === 200) {
        setFilterGradeList(data.result.results);
      } else throw new Error(data?.message);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFilterSectionList = async () => {
    try {
      const { data } = await axiosInstance.get(
        `${endpoints.masterManagement.sectionsTable}`
      );
      if (data.status_code === 200) {
        setFilterSectionList(data.data.results);
      } else throw new Error(data?.message);
    } catch (error) {
      console.error(error);
    }
  };

  const setFilterValue = (event) => {
    if (event.target.name === 'meetingDateFilter') {
      setFilterInput({
        ...filterInput,
        [event.target.name]: moment(event.target.value).format('YYYY-MM-DD'),
      });
    } else
      setFilterInput({
        ...filterInput,
        [event.target.name]: event.target.value,
      });
    if (event.target.name === 'meetingNameFilter') {
      getMeetingData(
        1,
        filterInput.branchFilter,
        filterInput.gradeFilter,
        filterInput.sectionFilter,
        event.target.value,
        filterInput.meetingDateFilter,
        filterInput.studentNameFilter,
        filterInput.teacherNameFilter,
        filterInput.meetingTypeFilter
      );
    }
    if (event.target.name === 'meetingDateFilter') {
      getMeetingData(
        1,
        filterInput.branchFilter,
        filterInput.gradeFilter,
        filterInput.sectionFilter,
        filterInput.meetingNameFilter,
        event.target.value,
        filterInput.studentNameFilter,
        filterInput.teacherNameFilter,
        filterInput.meetingTypeFilter
      );
    }
    if (event.target.name === 'studentNameFilter') {
      getMeetingData(
        1,
        filterInput.branchFilter,
        filterInput.gradeFilter,
        filterInput.sectionFilter,
        filterInput.meetingNameFilter,
        filterInput.meetingDateFilter,
        event.target.value,
        filterInput.teacherNameFilter,
        filterInput.meetingTypeFilter
      );
    }
    if (event.target.name === 'teacherNameFilter') {
      getMeetingData(
        1,
        filterInput.branchFilter,
        filterInput.gradeFilter,
        filterInput.sectionFilter,
        filterInput.meetingNameFilter,
        filterInput.meetingDateFilter,
        filterInput.studentNameFilter,
        event.target.value,
        filterInput.meetingTypeFilter
      );
    }
    if (event.target.name === 'meetingTypeFilter') {
      if (event.target.value === 'all') {
        getMeetingData(
          1,
          filterInput.branchFilter,
          filterInput.gradeFilter,
          filterInput.sectionFilter,
          filterInput.meetingNameFilter,
          filterInput.meetingDateFilter,
          filterInput.studentNameFilter,
          filterInput.teacherNameFilter,
          ''
        );
      } else {
        getMeetingData(
          1,
          filterInput.branchFilter,
          filterInput.gradeFilter,
          filterInput.sectionFilter,
          filterInput.meetingNameFilter,
          filterInput.meetingDateFilter,
          filterInput.studentNameFilter,
          filterInput.teacherNameFilter,
          event.target.value
        );
      }
    }
  };

  const handleBranchFilter = (e, value) => {
    if (value) {
      setFilterInput({
        ...filterInput,
        branchFilter: value.id,
      });
      setSelectedFilterBranch(value);
      getMeetingData(
        1,
        value.id,
        filterInput.gradeFilter,
        filterInput.sectionFilter,
        filterInput.meetingNameFilter,
        filterInput.meetingDateFilter,
        filterInput.studentNameFilter,
        filterInput.teacherNameFilter,
        filterInput.meetingTypeFilter
      );
    } else if (value === null) {
      setFilterInput({
        ...filterInput,
        branchFilter: '',
      });
      setSelectedFilterBranch({});
      getMeetingData(
        1,
        '',
        filterInput.gradeFilter,
        filterInput.sectionFilter,
        filterInput.meetingNameFilter,
        filterInput.meetingDateFilter,
        filterInput.studentNameFilter,
        filterInput.teacherNameFilter,
        filterInput.meetingTypeFilter
      );
    }
  };

  const handleGradeFilter = (e, value) => {
    if (value) {
      setFilterInput({
        ...filterInput,
        gradeFilter: value.id,
      });
      setSelectedFilterGrade(value);
      getMeetingData(
        1,
        filterInput.branchFilter,
        value.id,
        filterInput.sectionFilter,
        filterInput.meetingNameFilter,
        filterInput.meetingDateFilter,
        filterInput.studentNameFilter,
        filterInput.teacherNameFilter,
        filterInput.meetingTypeFilter
      );
    } else if (value === null) {
      setFilterInput({
        ...filterInput,
        gradeFilter: '',
      });
      setSelectedFilterGrade({});
      getMeetingData(
        1,
        filterInput.branchFilter,
        '',
        filterInput.sectionFilter,
        filterInput.meetingNameFilter,
        filterInput.meetingDateFilter,
        filterInput.studentNameFilter,
        filterInput.teacherNameFilter,
        filterInput.meetingTypeFilter
      );
    }
  };

  const handleSectionFilter = (e, value) => {
    if (value) {
      setFilterInput({
        ...filterInput,
        sectionFilter: value.id,
      });
      setSelectedFilterSection(value);
      getMeetingData(
        1,
        filterInput.branchFilter,
        filterInput.gradeFilter,
        value.id,
        filterInput.meetingNameFilter,
        filterInput.meetingDateFilter,
        filterInput.studentNameFilter,
        filterInput.teacherNameFilter,
        filterInput.meetingTypeFilter
      );
    } else if (value === null) {
      setFilterInput({
        ...filterInput,
        sectionFilter: '',
      });
      setSelectedFilterSection({});
      getMeetingData(
        1,
        filterInput.branchFilter,
        filterInput.gradeFilter,
        '',
        filterInput.meetingNameFilter,
        filterInput.meetingDateFilter,
        filterInput.studentNameFilter,
        filterInput.teacherNameFilter,
        filterInput.meetingTypeFilter
      );
    }
  };

  const getMeetingData = async (
    page,
    branchFilter,
    gradeFilter,
    sectionFilter,
    meetingNameFilter,
    meetingDateFilter,
    studentNameFilter,
    teacherNameFilter,
    meetingTypeFilter
  ) => {
    let params;
    if (is_superuser) {
      params = `teacher_id=${erp_user_id}&page_size=${
        data.dataPerPage
      }&page=${page}&branch_id=${
        branchFilter !== undefined ? branchFilter : filterInput.branchFilter
      }&grade_id=${
        gradeFilter !== undefined ? gradeFilter : filterInput.gradeFilter
      }&section_id=${
        sectionFilter !== undefined ? sectionFilter : filterInput.sectionFilter
      }&meeting_name=${
        meetingNameFilter !== undefined
          ? meetingNameFilter
          : filterInput.meetingNameFilter
      }&meeting_date=${
        meetingDateFilter !== undefined
          ? meetingDateFilter
          : filterInput.meetingDateFilter
      }&student_name=${
        studentNameFilter !== undefined
          ? studentNameFilter
          : filterInput.studentNameFilter
      }&teacher_name=${
        teacherNameFilter !== undefined
          ? teacherNameFilter
          : filterInput.teacherNameFilter
      }&meeting_type=${
        meetingTypeFilter !== undefined
          ? meetingTypeFilter
          : filterInput.meetingTypeFilter
      }`;
    } else if (userLevel === 4) {
      params = `student_id=${erp_user_id}&page_size=${data.dataPerPage}&page=${
        page !== undefined ? page : data.currentPage
      }&meeting_name=${
        meetingNameFilter !== undefined
          ? meetingNameFilter
          : filterInput.meetingNameFilter
      }&meeting_date=${
        meetingDateFilter !== undefined
          ? meetingDateFilter
          : filterInput.meetingDateFilter
      }&teacher_name=${
        teacherNameFilter !== undefined
          ? teacherNameFilter
          : filterInput.teacherNameFilter
      }&meeting_type=${
        meetingTypeFilter !== undefined
          ? meetingTypeFilter
          : filterInput.meetingTypeFilter
      }`;
    } else {
      params = `teacher_id=${erp_user_id}&page_size=${data.dataPerPage}&page=${
        page !== undefined ? page : data.currentPage
      }&branch_id=${
        branchFilter !== undefined ? branchFilter : filterInput.branchFilter
      }&grade_id=${
        gradeFilter !== undefined ? gradeFilter : filterInput.gradeFilter
      }&section_id=${
        sectionFilter !== undefined ? sectionFilter : filterInput.sectionFilter
      }&meeting_name=${
        meetingNameFilter !== undefined
          ? meetingNameFilter
          : filterInput.meetingNameFilter
      }&meeting_date=${
        meetingDateFilter !== undefined
          ? meetingDateFilter
          : filterInput.meetingDateFilter
      }&student_name=${
        studentNameFilter !== undefined
          ? studentNameFilter
          : filterInput.studentNameFilter
      }&teacher_name=${
        teacherNameFilter !== undefined
          ? teacherNameFilter
          : filterInput.teacherNameFilter
      }&meeting_type=${
        meetingTypeFilter !== undefined
          ? meetingTypeFilter
          : filterInput.meetingTypeFilter
      }`;
    }
    let apiUrl;
    if (userLevel === 4) {
      apiUrl = `${endpoints.connectionPod.getStudentMeeting}?${params}`;
    } else {
      apiUrl = `${endpoints.connectionPod.getTeacherMeeting}?${params}`;
    }
    try {
      const result = await axiosInstance.get(`${apiUrl}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.data.status_code === 200) {
        setMeetingData(result.data.result);
        setData({
          ...data,
          totalData: result.data.count,
          totalPages: result.data.total_pages,
          currentPage: result.data.current_page,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      // console.log('We do cleanup here');
    }
  };

  const getstudentList = async (searchText) => {
    let page = '0';
    let resultCount = '0';
    let query = '';
    if (is_superuser) {
      if (teacherID !== undefined) {
        query = `&teacher_id=${teacherID}&branch_id=${selectedSection.branch_id}&section_id=${selectedSection.section_id}&grade_id=${selectedSection.grade_id}`;
      }
    } else {
      query = `&teacher_id=${erp_user_id}&branch_id=${selectedSection.branch_id}&section_id=${selectedSection.section_id}&grade_id=${selectedSection.grade_id}`;
    }
    try {
      const result = await axiosInstance.get(
        `${endpoints.connectionPod.getStudentList}?term=${searchText}${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result?.data?.status_code === 200) {
        setStudentList(result.data.result);
        resultCount = result.data.count;
        page = result.data.total_pages;
      } else {
        console.log({ result });
      }
      if (parseInt(page) > 1) {
        getFullStudentList(resultCount);
      }
    } catch (e) {
      console.error(e);
    } finally {
      // console.log('We do cleanup here');
    }
  };

  const getFullStudentList = async (pagesize) => {
    let query = '';
    if (is_superuser) {
      if (teacherID !== undefined) {
        query = `&teacher_id=${teacherID}`;
      }
    } else {
      query = `&teacher_id=${erp_user_id}`;
    }
    const result = await axiosInstance.get(
      `${endpoints.connectionPod.getStudentList}?term=${searchText}${query}&page_size=${pagesize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (result.data.status_code === 200) {
      setStudentList(result.data.result);
    } else {
      console.log({ result });
    }
  };

  const clearFilter = () => {
    setSelectedFilterBranch({});
    setSelectedFilterGrade({});
    setSelectedFilterSection({});
    setFilterInput({
      branchFilter: '',
      gradeFilter: '',
      sectionFilter: '',
      meetingNameFilter: '',
      meetingDateFilter: '',
      studentNameFilter: '',
      teacherNameFilter: '',
      meetingTypeFilter: '',
    });
    getMeetingData(1, '', '', '', '', '', '', '', '');
  };

  const getAvailableSlot = async (date, erpId) => {
    setStudentID(erpId);
    let query;
    if (erpId !== undefined && date.length > 0) {
      query = `${endpoints.connectionPod.availableSlot}?date=${date}&erp_id=${erpId}&teacher_id=${teacherID}`;
    }
    // else {
    //   query = `${endpoints.connectionPod.availableSlot}?date=${date}&erp_id=`;
    // }
    try {
      if (query !== undefined) {
        const result = await axiosInstance.get(`${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (result.data.status_code === 200) {
          setAvailableSlot(result.data.available_slots);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const confirm = async () => {
    let params = `erp_id=${studentID}&meeting_name=${meetingName}&time_slot=${time}&date=${date}`;
    if (is_superuser) {
      params = params + `&teacher_id=${teacherID}`;
    } else {
      params = params + `&teacher_id=${erp_user_id}`;
    }
    params =
      params + `&branch_id=${branchID}&grade_id=${gradeID}&section_id=${sectionID}`;
    if (
      studentID !== undefined &&
      meetingName.length > 0 &&
      time.length > 0 &&
      date.length > 0
    ) {
      const result = await axiosInstance.post(
        `${endpoints.connectionPod.createMeeting}?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.data.status_code === 200) {
        setAlert('success', result.data.message);
        getMeetingData(1);
        closeDialog();
      }
    }
  };

  const isJoinDisable = (meeting_date, meeting_time) => {
    // diff between current date and time and meeting_date,meeting_time 5 min then return false else return true
    var d = new Date();
    var startTime = moment(d);
    var endTime = moment(meeting_date.slice(0, 11) + meeting_time.slice(0, 5) + ':00');
    var duration = moment.duration(endTime.diff(startTime));
    let meetingStartTime = moment(
      meeting_date.slice(0, 11) + meeting_time.slice(0, 5) + ':00'
    );
    let meetingEndTime = moment(
      meeting_date.slice(0, 11) + meeting_time.slice(8) + ':00'
    );
    let meetingDuration = moment.duration(meetingEndTime.diff(meetingStartTime));
    // console.log(moment(meeting_time.slice(0, 5) + ':00').format(), 'datediff');
    if (
      parseInt(duration.asMinutes()) < 5 &&
      parseInt(duration.asMinutes()) > -parseInt(meetingDuration.asMinutes())
    ) {
      return false;
    } else return true;
  };

  const getMeetingText = (meeting_date, meeting_time) => {
    var d = new Date();
    var startTime = moment(d);
    var endTime = moment(meeting_date.slice(0, 11) + meeting_time.slice(0, 5) + ':00');
    var duration = moment.duration(endTime.diff(startTime));
    let meetingStartTime = moment(
      meeting_date.slice(0, 11) + meeting_time.slice(0, 5) + ':00'
    );
    let meetingEndTime = moment(
      meeting_date.slice(0, 11) + meeting_time.slice(8) + ':00'
    );
    let meetingDuration = moment.duration(meetingEndTime.diff(meetingStartTime));
    // console.log(moment(meeting_time.slice(0, 5) + ':00').format(), 'datediff');
    if (parseInt(duration.asMinutes()) < parseInt(meetingDuration.asMinutes()) * -1) {
      return 'Completed';
    }
    if (parseInt(duration.asMinutes()) < 5) {
      if (userLevel === 4) {
        return 'Join Meeting';
      }
      return 'Host Meeting';
    }
    if (parseInt(duration.asMinutes()) > 5) {
      return 'Upcoming';
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setMeetingName('');
    setDate('');
    setTime('');
    setBranchID(undefined);
    setGradeID(undefined);
    setTeacherID(undefined);
    setSectionID(undefined);
    setStudentID(undefined);
    setSelectedBranch({});
    setSelectedGrade({});
    setSelectedTeacher({});
    setSelectedSection({});
    setSelectedStudent({});
  };

  const markAttendanceFn = async (meetingId) => {
    try {
      const result = await axiosInstance.put(
        `${endpoints.connectionPod.markAttendence}?meeting_id=${meetingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.data.status_code === 200) {
        setAlert('success', result.data.message);
      }
    } catch (e) {
      console.error(e);
    } finally {
      // console.log('We do cleanup here');
    }
  };

  const joinMeeting = (data) => {
    if (is_superuser) {
      window.open(data.host, '_blank');
    } else if (userLevel === 4) {
      markAttendanceFn(data.id);
      window.open(data.participant, '_blank');
    } else {
      markAttendanceFn(data.id);
      window.open(data.host, '_blank');
    }
  };

  return (
    <>
      <div className='connection-pod-container'>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className='connection-pod-breadcrumb-wrapper'>
              <CommonBreadcrumbs
                componentName='Online Class'
                childComponentName='Connection pod'
                isAcademicYearVisible={true}
              />
            </div>
            <div className='filter-container'>
              <Grid container spacing={3} alignItems='center'>
                {userLevel !== 4 && (
                  <Grid item sm={1} xs={12}>
                    <Tooltip title='Create Meeting' placement='bottom' arrow>
                      <IconButton
                        className='create-meeting-button'
                        onClick={() => {
                          setDialogOpen(true);
                          // getAvailableSlot(date);
                        }}
                      >
                        <AddIcon style={{ color: '#ffffff' }} />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                )}
                <Grid item sm={userLevel !== 4 ? 11 : 12} xs={12}>
                  <Accordion expanded={accordianOpen}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls='panel1a-content'
                      id='panel1a-header'
                      onClick={() => setAccordianOpen(!accordianOpen)}
                    >
                      <Typography variant='h6' color='primary'>
                        Filter
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3} alignItems='center'>
                        {userLevel !== 4 && (
                          <>
                            <Grid item md={3} sm={4} xs={12}>
                              <Autocomplete
                                fullWidth
                                size='small'
                                className='filter-student meeting-form-input'
                                onChange={(e, value) => {
                                  handleBranchFilter(e, value);
                                }}
                                id='create__class-grade'
                                options={(filterBranchList && filterBranchList) || []}
                                getOptionLabel={(option) => option?.branch_name || ''}
                                filterSelectedOptions
                                value={selectedFilterBranch || {}}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    variant='outlined'
                                    label='Branch'
                                    placeholder='Branch'
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item md={3} sm={4} xs={12}>
                              <Autocomplete
                                fullWidth
                                size='small'
                                className='filter-student meeting-form-input'
                                onChange={(e, value) => {
                                  handleGradeFilter(e, value);
                                }}
                                id='create__class-grade'
                                options={(filterGradeList && filterGradeList) || []}
                                getOptionLabel={(option) => option?.grade_name || ''}
                                filterSelectedOptions
                                value={selectedFilterGrade || {}}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    variant='outlined'
                                    label='Grade'
                                    placeholder='Grade'
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item md={3} sm={4} xs={12}>
                              <Autocomplete
                                fullWidth
                                size='small'
                                className='filter-student meeting-form-input'
                                onChange={(e, value) => {
                                  handleSectionFilter(e, value);
                                }}
                                id='create__class-grade'
                                options={(filterSectionList && filterSectionList) || []}
                                getOptionLabel={(option) => option?.section_name || ''}
                                filterSelectedOptions
                                value={selectedFilterSection || {}}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    variant='outlined'
                                    label='Section'
                                    placeholder='Section'
                                  />
                                )}
                              />
                            </Grid>
                          </>
                        )}
                        <Grid item md={3} sm={4} xs={12}>
                          <TextField
                            fullWidth
                            className='meeting-name'
                            label='Meeting Name'
                            variant='outlined'
                            size='small'
                            autoComplete='off'
                            name='meetingNameFilter'
                            value={filterInput.meetingNameFilter}
                            onChange={(e) => {
                              setFilterValue(e);
                            }}
                          />
                        </Grid>
                        <Grid item md={3} sm={4} xs={12}>
                          <TextField
                            fullWidth
                            className='meeting-date'
                            label='Meeting Date'
                            variant='outlined'
                            size='small'
                            autoComplete='off'
                            name='meetingDateFilter'
                            type='date'
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={filterInput.meetingDateFilter}
                            onChange={(e) => {
                              setFilterValue(e);
                            }}
                          />
                        </Grid>
                        {/* {(is_superuser || userLevel === 4) && ( */}
                        <Grid item md={3} sm={4} xs={12}>
                          <TextField
                            fullWidth
                            className='teacher-name'
                            label='Teacher Name'
                            variant='outlined'
                            size='small'
                            autoComplete='off'
                            name='teacherNameFilter'
                            value={filterInput.teacherNameFilter}
                            onChange={(e) => {
                              setFilterValue(e);
                            }}
                          />
                        </Grid>
                        {/* )} */}
                        {userLevel !== 4 && (
                          <Grid item md={3} sm={4} xs={12}>
                            <TextField
                              fullWidth
                              className='student-name'
                              label='Student Name'
                              variant='outlined'
                              size='small'
                              autoComplete='off'
                              name='studentNameFilter'
                              value={filterInput.studentNameFilter}
                              onChange={(e) => {
                                setFilterValue(e);
                              }}
                            />
                          </Grid>
                        )}
                        <Grid item md={3} sm={4} xs={12}>
                          <FormControl fullWidth margin='dense' variant='outlined'>
                            <InputLabel>Meeting Type</InputLabel>
                            <Select
                              value={filterInput.meetingTypeFilter || ''}
                              label='Meeting Type'
                              name='meetingTypeFilter'
                              onChange={(e) => {
                                setFilterValue(e);
                              }}
                            >
                              <MenuItem value={'all'}>All</MenuItem>
                              <MenuItem value={'upcoming'}>Upcoming</MenuItem>
                              <MenuItem value={'past'}>Past</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item sm={3} xs={3}>
                          <Button className='filter-button' onClick={() => clearFilter()}>
                            Clear Filter
                          </Button>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            </div>
            <div className='table-container'>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {column &&
                        column.map((eachColumn, index) => {
                          return <TableCell key={index}>{eachColumn}</TableCell>;
                        })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {meetingData &&
                      meetingData.map((eachData, index) => {
                        return (
                          <TableRow key={eachData.id}>
                            <TableCell>
                              {data.currentPage == 1
                                ? index + data.currentPage
                                : (data.currentPage - 1) * data.dataPerPage + (index + 1)}
                            </TableCell>
                            <TableCell>{eachData.meeeting_name}</TableCell>
                            <TableCell>
                              {`${moment(eachData.meeting_date).format('DD-MM-YYYY')}`}
                            </TableCell>
                            <TableCell>{eachData.meeting_time}</TableCell>
                            <TableCell>{eachData.student.student_name}</TableCell>
                            <TableCell>{eachData.teacher.teacher_name}</TableCell>
                            {userLevel === 4 ? (
                              <TableCell>{eachData.is_attended ? 'Yes' : 'No'}</TableCell>
                            ) : (
                              <TableCell>
                                {eachData.is_attended_teacher ? 'Yes' : 'No'}
                              </TableCell>
                            )}
                            <TableCell>
                              <Button
                                disabled={isJoinDisable(
                                  eachData.meeting_date,
                                  eachData.meeting_time
                                )}
                                size='small'
                                className='host-meeting-button'
                                onClick={() => joinMeeting(eachData)}
                              >
                                {getMeetingText(
                                  eachData.meeting_date,
                                  eachData.meeting_time
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <Testpagination data={data} setData={setData} />
          </>
        )}
      </div>
      <Dialog open={dialogOpen} className='create-meetinng-dialog'>
        <DialogTitle className='dialog-title'>Create Meeting</DialogTitle>
        <div className='meeting-form'>
          <Autocomplete
            fullWidth
            size='small'
            className='filter-student meeting-form-input'
            options={(branchList && branchList) || []}
            getOptionLabel={(option) => option?.branch_name || ''}
            filterSelectedOptions
            value={selectedBranch || {}}
            onChange={(event, value) => {
              handleBranch(event, value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                fullWidth
                variant='outlined'
                label='Branch'
              />
            )}
            renderOption={(option, { selected }) => (
              <React.Fragment>{option?.branch_name}</React.Fragment>
            )}
          />
          <Autocomplete
            fullWidth
            size='small'
            className='filter-student meeting-form-input'
            onChange={(e, value) => {
              handleGrade(e, value);
            }}
            id='create__class-grade'
            options={gradeList}
            getOptionLabel={(option) => option?.grade__grade_name || ''}
            filterSelectedOptions
            value={selectedGrade || {}}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                fullWidth
                variant='outlined'
                label='Grades'
                placeholder='Grades'
              />
            )}
          />
          <Autocomplete
            fullWidth
            size='small'
            className='filter-teacher meeting-form-input'
            options={(teacherList && teacherList) || []}
            getOptionLabel={(option) => option?.name || ''}
            filterSelectedOptions
            value={selectedTeacher || {}}
            onChange={(event, value) => {
              handleTeacher(event, value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                fullWidth
                variant='outlined'
                label='Teacher'
              />
            )}
            renderOption={(option, { selected }) => (
              <React.Fragment>{option?.name}</React.Fragment>
            )}
          />
          <Autocomplete
            fullWidth
            size='small'
            className='filter-student meeting-form-input'
            options={(sectionList && sectionList) || []}
            getOptionLabel={(option) => option?.section__section_name || ''}
            filterSelectedOptions
            value={selectedSection || {}}
            onChange={(event, value) => {
              handleSection(event, value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                fullWidth
                variant='outlined'
                label='Section'
              />
            )}
            renderOption={(option, { selected }) => (
              <React.Fragment>{option?.section__section_name}</React.Fragment>
            )}
          />
          <Autocomplete
            fullWidth
            size='small'
            className='filter-student meeting-form-input'
            options={(studentList && studentList) || []}
            getOptionLabel={(option) => option?.user?.first_name || ''}
            filterSelectedOptions
            value={selectedStudent || {}}
            onChange={(event, value) => {
              handleStudent(event, value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                fullWidth
                variant='outlined'
                label='Student'
              />
            )}
            renderOption={(option, { selected }) => (
              <React.Fragment>{option?.user?.first_name}</React.Fragment>
            )}
          />
          <TextField
            required
            fullWidth
            className='filter-student meeting-form-input'
            label='Meeting Name'
            variant='outlined'
            size='small'
            autoComplete='off'
            name='searchText'
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
          />
          <TextField
            required
            fullWidth
            className='filter-student meeting-form-input'
            label='Meeting Date'
            variant='outlined'
            size='small'
            autoComplete='off'
            name='searchText'
            value={date}
            onChange={(e) => setDate(moment(e.target.value).format('YYYY-MM-DD'))}
            type='date'
            // min={new Date().toISOString().split('T')[0]}
            InputProps={{ inputProps: { min: new Date().toISOString().split('T')[0] } }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Autocomplete
            fullWidth
            size='small'
            className='filter-student meeting-form-input'
            options={(availableSlot && availableSlot) || []}
            getOptionLabel={(option) => option || ''}
            filterSelectedOptions
            value={time || ''}
            onChange={(event, value) => {
              setTime(value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                fullWidth
                variant='outlined'
                label='Meeting Time'
              />
            )}
          />
          <div className='meeting-form-actions'>
            <Button className='meeting-form-actions-butons' onClick={() => confirm()}>
              Confirm
            </Button>
            <Button className='meeting-form-actions-butons' onClick={() => closeDialog()}>
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ConnectionPodFn;
