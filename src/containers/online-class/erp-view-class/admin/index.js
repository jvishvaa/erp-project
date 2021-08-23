/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Grid,
  TextField,
  Button,
  Divider,
  Typography,
  IconButton,
} from '@material-ui/core';
import CountdownTimer from './CountdownTimer';
import { withRouter } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import moment from 'moment';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import Loader from '../../../../components/loader/loader';
import axiosInstance from '../../../../config/axios';
import endpoints from '../../../../config/endpoints';
import filterImage from '../../../../assets/images/unfiltered.svg';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import CardView from './CardView';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import Layout from '../../../Layout';
import DateRangeIcon from '@material-ui/icons/DateRange';
import DetailCardView from './DetailCardView';
import TabPanel from './tab-panel/TabPanel';
import APIREQUEST from '../../../../config/apiRequest';

const ErpAdminViewClass = ({ history }) => {
  const [branchList, setBranchList] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const [studentDetails] = useState(
    JSON.parse(window.localStorage.getItem('userDetails'))
  );
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [academicYear, setAcademicYear] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [filterList, setFilterList] = useState([]);
  const [selectedViewMore, setSelectedViewMore] = useState('');
  const viewMoreRef = useRef(null);
  const limit = 12;
  const [tabValue, setTabValue] = useState(
    JSON.parse(localStorage.getItem('filterData'))?.tabValue || 0
  );

  const [dateRangeTechPer, setDateRangeTechPer] = useState([
    moment().subtract(6, 'days'),
    moment(),
  ]);
  const [classTypes, setClassTypes] = useState([
    { id: 0, type: 'Compulsory Class' },
    { id: 1, type: 'Optional Class' },
    { id: 2, type: 'Special Class' },
    { id: 3, type: 'Parent Class' },
  ]);
  const [selectedClassType, setSelectedClassType] = useState('');
  const [moduleId, setModuleId] = useState();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

  function getDaysAfter(date, amount) {
    return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
  }
  function getDaysBefore(date, amount) {
    return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
  }
  const handlePagination = (event, page) => {
    setSelectedViewMore('');
    localStorage.removeItem('viewMoreData');
    setPage(page);
    let data = JSON.parse(localStorage.getItem('filterData')) || '';
    localStorage.setItem('filterData', JSON.stringify({ ...data, page }));
  };
  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Online Class' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (
              item.child_name === 'View Class' &&
              window.location.pathname === '/erp-online-class'
            ) {
              setModuleId(item.child_id);
              localStorage.setItem('moduleId', item.child_id);
            }
            if (
              item.child_name === 'Teacher View Class' &&
              window.location.pathname === '/erp-online-class-teacher-view'
            ) {
              setModuleId(item.child_id);
              localStorage.setItem('moduleId', item.child_id);
            }
            if (
              item.child_name === 'Attend Online Class' &&
              window.location.pathname === '/erp-online-class-student-view'
            ) {
              setModuleId(item.child_id);
              localStorage.setItem('moduleId', item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  //useEffect to get data on back button click
  useEffect(() => {
    let modId = +JSON.parse(localStorage.getItem('moduleId'));
    if (moduleId) {
      if (modId !== moduleId) {
        handleClearFilter();
      }
      if (modId === moduleId) {
        const {
          classtype = {},
          academic = {},
          branch = [],
          grade = [],
          section = [],
          subject = [],
          course = {},
          date = [moment().subtract(6, 'days'), moment()],
          page: pageNumber = 1,
          tabValue: tabVal = 0,
        } = JSON.parse(localStorage.getItem('filterData')) || {};
        setPage(pageNumber);
        setTabValue(tabVal);
        if (classtype?.id >= 0) {
          setSelectedClassType(classtype);
        }
        if (window.location.pathname !== '/erp-online-class-student-view') {
          if (date?.length) {
            setDateRangeTechPer([moment(date?.[0]), moment(date?.[1])]);
          }
          if (academic?.id) {
            // setSelectedAcademicYear(academic);
            const acadId = academic?.id || '';
            callApi(
              `${endpoints.communication.branches}?session_year=${acadId}&module_id=${moduleId}`,
              'branchList'
            );
            if (branch?.length) {
              setSelectedBranch(branch);
              const branchIds = branch.map((el) => el?.branch?.id) || [];
              callApi(
                `${endpoints.academics.grades}?session_year=${acadId}&branch_id=${branchIds}&module_id=${moduleId}`,
                'gradeList'
              );
              if (grade?.length) {
                setSelectedGrade(grade);
                const gradeIds = grade.map((el) => el?.grade_id) || [];
                callApi(
                  `${endpoints.academics.sections}?session_year=${acadId}&branch_id=${branchIds}&grade_id=${gradeIds}&module_id=${moduleId}`,
                  'section'
                );
                if (classtype?.id > 0) {
                  callApi(
                    `${endpoints.teacherViewBatches.courseListApi}?grade=${gradeIds}`,
                    'course'
                  );
                }
                if (section?.length) {
                  setSelectedSection(section);
                  const sectionIds = section.map((el) => el?.section_id) || [];
                  callApi(
                    `${endpoints.academics.subjects}?branch=${branchIds}&session_year=${acadId}&grade=${gradeIds}&section=${sectionIds}&module_id=${moduleId}`,
                    'subject'
                  );
                  if (classtype?.id === 0) {
                    if (subject?.length) {
                      setSelectedSubject(subject);
                    }
                  } else if (classtype.id > 0) {
                    if (course?.id) {
                      setSelectedCourse(course);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }, [moduleId, window.location.pathname]);

  const handleApiRes = (result) => {
    setTotalCount(result?.data?.count);
    const response = result?.data?.data || [];
    setFilterList(response);
    setSelectedViewMore('');
    const viewData = JSON.parse(localStorage.getItem('viewMoreData')) || '';
    if (viewData?.id) {
      let newViewData = response.filter((item) => item.id == viewData.id);
      localStorage.setItem('viewMoreData', JSON.stringify(newViewData[0] || {}));
      setSelectedViewMore(newViewData[0] || {});
    }
    setLoading(false);
  };

  function msCallFilterApi(api) {
    var url = api.split('?');
    url.shift();
    var path = url.join('?');
    let endpoint1 = `/oncls/v1/retrieve-online-class/`;
    if (window.location.pathname === '/erp-online-class-student-view') {
      endpoint1 = '/oncls/v1/student-oncls/';
    }
    APIREQUEST('get', `${endpoint1}?${path}`)
      .then((result) => {
        handleApiRes(result);
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setLoading(false);
        setFilterList([]);
      });
  }

  function callApi(api, key) {
    setLoading(true);
    if (key === 'filter' && JSON.parse(localStorage.getItem('isMsAPI'))) {
      msCallFilterApi(api);
      return;
    }
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'academicYearList') {
            setAcademicYear(result?.data?.data || []);
            const viewMoreData = JSON.parse(localStorage.getItem('viewMoreData'));
            if (
              window.location.pathname !== '/erp-online-class-student-view' &&
              !viewMoreData?.academic
            )
              callApi(
                `${endpoints.communication.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`,
                'branchList'
              );
          }
          if (key === 'branchList') {
            setBranchList(result?.data?.data?.results || []);
          }
          if (key === 'gradeList') {
            const gradeData = result?.data?.data || [];
            gradeData.unshift({
              grade__grade_name: 'Select All',
              grade_id: 'all',
              id: 'all',
            });
            setGradeList(gradeData);
          }
          if (key === 'section') {
            const sectionData = result?.data?.data || [];
            sectionData.unshift({
              id: 'all',
              section__section_name: 'Select All',
            });
            setSectionList(sectionData);
          }
          if (key === 'course') {
            setCourseList(result?.data?.result || []);
          }
          if (key === 'subject') {
            const transformedData =
              result?.data?.data.map((sub, index) => {
                return {
                  id: index,
                  ...sub,
                };
              }) || [];
            setSubjectList(transformedData);
          }
          if (key === 'filter') {
            handleApiRes(result);
          }
          setLoading(false);
        } else {
          setAlert('error', result?.data?.message);
          setLoading(false);
          setFilterList([]);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setLoading(false);
        setFilterList([]);
      });
  }

  function handleClose(data) {
    setSelectedViewMore('');
    localStorage.removeItem('viewMoreData');
    const [startDateTechPer, endDateTechPer] = dateRangeTechPer;
    if (data === 'success') {
      setPage(1);
      if (window.location.pathname === '/erp-online-class-student-view') {
        callApi(
          `${endpoints.studentViewBatchesApi.getBatchesApi}?user_id=${
            studentDetails &&
            studentDetails.role_details &&
            studentDetails.role_details.erp_user_id
          }&page_number=${page}&page_size=${limit}&class_type=${
            selectedClassType?.id
          }&class_status=${tabValue + 1}&module_id=${moduleId}`,
          'filter'
        );
      }
      if (
        window.location.pathname === '/erp-online-class' ||
        window.location.pathname === '/erp-online-class-teacher-view'
      ) {
        if (selectedCourse?.id) {
          callApi(
            `${endpoints.aol.classes}?is_aol=0&session_year=${
              selectedAcademicYear?.id
            }&section_mapping_ids=${selectedSection.map((el) => el?.id)}&class_type=${
              selectedClassType?.id
            }&start_date=${startDateTechPer?.format(
              'YYYY-MM-DD'
            )}&end_date=${endDateTechPer?.format('YYYY-MM-DD')}&course_id=${
              selectedCourse?.id
            }&page_number=${page}&page_size=${limit}&class_status=${
              tabValue + 1
            }&module_id=${moduleId}`,
            'filter'
          );
        } else {
          callApi(
            `${endpoints.aol.classes}?is_aol=0&session_year=${
              selectedAcademicYear?.id
            }&section_mapping_ids=${selectedSection.map(
              (el) => el?.id
            )}&subject_id=${selectedSubject.map((el) => el?.subject__id)}&class_type=${
              selectedClassType?.id
            }&start_date=${startDateTechPer?.format(
              'YYYY-MM-DD'
            )}&end_date=${endDateTechPer?.format(
              'YYYY-MM-DD'
            )}&page_number=${page}&page_size=${limit}&class_status=${
              tabValue + 1
            }&module_id=${moduleId}`,
            'filter'
          );
        }
      }
    }
  }

  useEffect(() => {
    if (
      selectedAcademicYear &&
      moduleId &&
      window.location.pathname !== '/erp-online-class-student-view'
    ) {
      callApi(
        `${endpoints.communication.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`,
        'branchList'
      );
    }
  }, [selectedAcademicYear, moduleId]);

  useEffect(() => {
    if (page) {
      const [startDateTechPer, endDateTechPer] = dateRangeTechPer;
      if (
        window.location.pathname === '/erp-online-class' ||
        window.location.pathname === '/erp-online-class-teacher-view'
      ) {
        if (selectedCourse?.id) {
          callApi(
            `${endpoints.aol.classes}?is_aol=0&session_year=${
              selectedAcademicYear?.id
            }&section_mapping_ids=${selectedSection.map((el) => el?.id)}&class_type=${
              selectedClassType?.id
            }&start_date=${startDateTechPer.format(
              'YYYY-MM-DD'
            )}&end_date=${endDateTechPer.format('YYYY-MM-DD')}&course_id=${
              selectedCourse?.id
            }&page_number=${page}&page_size=${limit}&class_status=${
              tabValue + 1
            }&module_id=${moduleId}`,
            'filter'
          );
        } else if (selectedSubject?.length > 0) {
          callApi(
            `${endpoints.aol.classes}?is_aol=0&session_year=${
              selectedAcademicYear?.id
            }&section_mapping_ids=${selectedSection.map(
              (el) => el?.id
            )}&subject_id=${selectedSubject.map((el) => el?.subject__id)}&class_type=${
              selectedClassType?.id
            }&start_date=${startDateTechPer.format(
              'YYYY-MM-DD'
            )}&end_date=${endDateTechPer.format(
              'YYYY-MM-DD'
            )}&page_number=${page}&page_size=${limit}&class_status=${
              tabValue + 1
            }&module_id=${moduleId}`,
            'filter'
          );
        }
      } else if (
        window.location.pathname === '/erp-online-class-student-view' &&
        selectedClassType?.id >= 0 &&
        moduleId
      ) {
        callApi(
          `${endpoints.studentViewBatchesApi.getBatchesApi}?user_id=${
            studentDetails &&
            studentDetails.role_details &&
            studentDetails.role_details.erp_user_id
          }&page_number=${page}&page_size=${limit}&class_type=${
            selectedClassType?.id
          }&class_status=${tabValue + 1}&module_id=${moduleId}`,
          'filter'
        );
      }
    }
  }, [page, selectedClassType, tabValue]);

  function handleClearFilter() {
    localStorage.removeItem('filterData');
    localStorage.removeItem('viewMoreData');
    setDateRangeTechPer([moment().subtract(6, 'days'), moment()]);
    setSelectedGrade([]);
    setCourseList([]);
    setSelectedCourse('');
    setFilterList([]);
    setSelectedViewMore('');
    setSectionList([]);
    setSelectedSection([]);
    setSubjectList([]);
    setSelectedSubject([]);
    setSelectedBranch([]);
    setSelectedClassType('');
    setPage(1);
    setTabValue(0);
  }

  function handleFilter() {
    const [startDateTechPer, endDateTechPer] = dateRangeTechPer;
    setPage(() => 1);
    setTabValue(0);
    setSelectedViewMore(() => '');
    localStorage.removeItem('viewMoreData');
    localStorage.removeItem('filterData');
    if (window.location.pathname === '/erp-online-class-student-view') {
      callApi(
        `${endpoints.studentViewBatchesApi.getBatchesApi}?user_id=${
          studentDetails &&
          studentDetails.role_details &&
          studentDetails.role_details.erp_user_id
        }&page_number=${1}&page_size=${limit}&class_type=${
          selectedClassType?.id
        }&class_status=${1}&module_id=${moduleId}`,
        'filter'
      );
    } else {
      if (!selectedClassType) {
        setAlert('warning', 'Select Classtype');
        return;
      }
      if (!selectedAcademicYear) {
        setAlert('warning', 'Select Academic Year');
        return;
      }
      if (!endDateTechPer) {
        setAlert('warning', 'Select End Date');
        return;
      }
      if (!selectedBranch?.length > 0) {
        setAlert('warning', 'Select Branch');
        return;
      }
      if (!selectedGrade?.length > 0) {
        setAlert('warning', 'Select Grade');
        return;
      }
      if (!selectedSection?.length > 0) {
        setAlert('warning', 'Select Section');
        return;
      }
      if (selectedClassType?.id !== 0) {
        if (!selectedCourse) {
          setAlert('warning', 'Select Course');
          return;
        }
      } else {
        if (!selectedSubject?.length > 0) {
          setAlert('warning', 'Select Subject');
          return;
        }
      }
      setLoading(true);
      localStorage.setItem(
        'filterData',
        JSON.stringify({
          classtype: selectedClassType,
          academic: selectedAcademicYear,
          branch: selectedBranch,
          grade: selectedGrade,
          section: selectedSection,
          subject: selectedSubject,
          course: selectedCourse,
          date: dateRangeTechPer,
          page,
          tabValue,
        })
      );

      if (selectedCourse?.id) {
        callApi(
          `${endpoints.aol.classes}?is_aol=0&session_year=${
            selectedAcademicYear?.id
          }&section_mapping_ids=${selectedSection.map((el) => el?.id)}&class_type=${
            selectedClassType?.id
          }&start_date=${moment(startDateTechPer).format('YYYY-MM-DD')}&end_date=${moment(
            endDateTechPer
          ).format('YYYY-MM-DD')}&course_id=${
            selectedCourse?.id
          }&page_number=${1}&page_size=${limit}&class_status=${1}&module_id=${moduleId}`,
          'filter'
        );
      } else {
        callApi(
          `${endpoints.aol.classes}?is_aol=0&session_year=${
            selectedAcademicYear?.id
          }&section_mapping_ids=${selectedSection.map(
            (el) => el?.id
          )}&subject_id=${selectedSubject.map((el) => el?.subject__id)}&class_type=${
            selectedClassType?.id
          }&start_date=${moment(startDateTechPer).format('YYYY-MM-DD')}&end_date=${moment(
            endDateTechPer
          ).format(
            'YYYY-MM-DD'
          )}&class_status=${1}&module_id=${moduleId}&page_number=${1}&page_size=${limit}`,
          'filter'
        );
      }
    }
  }
  const handleDownload = async () => {
    const [startDateTechPer, endDateTechPer] = dateRangeTechPer;
    try {
      const { data } = JSON.parse(localStorage.getItem('isMsAPI'))
        ? await APIREQUEST(
            'get',
            `/oncls/v1/oncls-report/?start_date=${moment(startDateTechPer).format(
              'YYYY-MM-DD'
            )}&end_date=${moment(endDateTechPer).format('YYYY-MM-DD')}`,
            null,
            'arraybuffer'
          )
        : await axiosInstance.get(
            `${endpoints.onlineClass.downloadOnlineClass_EXCEL}?start_date=${moment(
              startDateTechPer
            ).format('YYYY-MM-DD')}&end_date=${moment(endDateTechPer).format(
              'YYYY-MM-DD'
            )}`,
            {
              responseType: 'arraybuffer',
            }
          );
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `erp_classes_from${moment(startDateTechPer).format(
        'YYYY-MM-DD'
      )}_to_${moment(endDateTechPer).format('YYYY-MM-DD')}`;
      link.click();
      link.remove();
    } catch {
      setAlert('error', 'Failed To Download, Try After Some Time');
    }
  };

  const handleClassType = (event = {}, value = '') => {
    if (window.location.pathname === '/erp-online-class-student-view') {
      localStorage.setItem(
        'filterData',
        JSON.stringify({
          classtype: value,
        })
      );
    }
    setSelectedClassType(value);
    setSelectedBranch([]);
    setSelectedGrade([]);
    setSelectedSection([]);
    setSelectedSubject([]);
    setSelectedCourse('');
    setGradeList([]);
    setCourseList([]);
    setSectionList([]);
    setSubjectList([]);
    setSelectedViewMore('');
    setFilterList([]);
    setPage(1);
    setTotalCount(0);
    setTabValue(0);
    localStorage.removeItem('viewMoreData');
  };

  const handleBranch = (event = {}, value = []) => {
    setSelectedBranch([]);
    setGradeList([]);
    if (value?.length) {
      const ids = value.map((el) => el);
      const selectedId = value.map((el) => el?.branch?.id);
      setSelectedBranch(ids);
      callApi(
        `${endpoints.academics.grades}?session_year=${
          selectedAcademicYear?.id
        }&branch_id=${selectedId.toString()}&module_id=${moduleId}`,
        'gradeList'
      );
    }
    setTotalCount(0);
    setSelectedGrade([]);
    setCourseList([]);
    setSelectedCourse('');
    setSectionList([]);
    setSelectedSection([]);
    setSubjectList([]);
    setSelectedSubject([]);
    setFilterList([]);
    setPage(1);
    setTabValue(0);
  };

  const handleGrade = (event = {}, value = []) => {
    setSelectedGrade([]);
    if (value?.length) {
      value =
        value.filter(({ grade_id }) => grade_id === 'all').length === 1
          ? [...gradeList].filter(({ grade_id }) => grade_id !== 'all')
          : value;
      const ids = value.map((el) => el) || [];
      const selectedId = value.map((el) => el?.grade_id) || [];
      const branchId = selectedBranch.map((el) => el?.branch?.id) || [];
      setSelectedGrade(ids);
      callApi(
        `${endpoints.academics.sections}?session_year=${selectedAcademicYear?.id}&branch_id=${branchId}&grade_id=${selectedId}&module_id=${moduleId}`,
        'section'
      );
      if (selectedClassType?.id > 0) {
        callApi(
          `${endpoints.teacherViewBatches.courseListApi}?grade=${selectedId}`,
          'course'
        );
      }
    }
    setCourseList([]);
    setSelectedCourse('');
    setSectionList([]);
    setSelectedSection([]);
    setSubjectList([]);
    setSelectedSubject([]);
    setFilterList([]);
    setPage(1);
    setTabValue(0);
  };

  const handleSection = (event = {}, value = []) => {
    setSelectedSection([]);
    if (value?.length) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...sectionList].filter(({ id }) => id !== 'all')
          : value;
      const ids = value.map((el) => el);
      const secId = value.map((el) => el?.section_id);
      setSelectedSection(ids);
      callApi(
        `${endpoints.academics.subjects}?branch=${selectedBranch.map(
          (el) => el?.branch?.id
        )}&session_year=${selectedAcademicYear?.id}&grade=${selectedGrade.map(
          (el) => el?.grade_id
        )}&section=${secId}&module_id=${moduleId}`,
        'subject'
      );
    }
    setSelectedCourse('');
    setSubjectList([]);
    setSelectedSubject([]);
    setFilterList([]);
    setPage(1);
    setTabValue(0);
  };

  const handleSubject = (event = {}, value = []) => {
    setSelectedSubject([]);
    if (value?.length) {
      const ids = value.map((el) => el) || [];
      setSelectedSubject(ids);
    }
    setFilterList([]);
    setPage(1);
    setTabValue(0);
  };

  const handleCourse = (event = {}, value = '') => {
    if (value) {
      setSelectedCourse(value);
    }
    setFilterList([]);
    setPage(1);
    setTabValue(0);
  };

  return (
    <>
      <Layout>
        <CommonBreadcrumbs
          componentName='Online Class'
          childComponentName={
            window.location.pathname === '/erp-online-class'
              ? 'Online Class View'
              : window.location.pathname === '/erp-online-class-teacher-view'
              ? 'Teacher Class View'
              : window.location.pathname === '/erp-online-class-student-view'
              ? 'Student Class View'
              : ''
          }
          isAcademicYearVisible={true}
        />
        {loading && <Loader />}
        <CommonBreadcrumbs
          componentName='Online Class'
          childComponentName={
            window.location.pathname === '/erp-online-class'
              ? 'Online Class View'
              : window.location.pathname === '/erp-online-class-teacher-view'
              ? 'Teacher Class View'
              : window.location.pathname === '/erp-online-class-student-view'
              ? 'Student Class View'
              : ''
          }
          isAcademicYearVisible={true}
        />
        <Grid container spacing={2} className='teacherBatchViewMainDiv'>
          <Grid item md={12} xs={12} className='teacherBatchViewFilter'>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={handleClassType}
                  id='branch_id'
                  className='dropdownIcon'
                  value={selectedClassType}
                  options={classTypes || []}
                  getOptionLabel={(option) => option?.type || ''}
                  filterSelectedOptions
                  getOptionSelected={(option, value) => option?.id == value?.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Class Type'
                      placeholder='Class Type'
                    />
                  )}
                />
              </Grid>
              {window.location.pathname !== '/erp-online-class-student-view' && (
                <>
                  <Grid item md={3} xs={12}>
                    <Autocomplete
                      multiple
                      style={{ width: '100%' }}
                      size='small'
                      onChange={handleBranch}
                      id='branch_id'
                      className='dropdownIcon'
                      value={selectedBranch || []}
                      options={branchList || []}
                      getOptionLabel={(option) => option?.branch?.branch_name || ''}
                      getOptionSelected={(option, value) =>
                        option?.branch?.id == value?.branch?.id
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='Branch'
                          placeholder='Branch'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <Autocomplete
                      multiple
                      style={{ width: '100%' }}
                      size='small'
                      limitTags={2}
                      onChange={handleGrade}
                      id='grade_id'
                      className='dropdownIcon'
                      value={selectedGrade || []}
                      options={gradeList || []}
                      getOptionLabel={(option) => option?.grade__grade_name || ''}
                      getOptionSelected={(option, value) => option?.id == value?.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='Grade'
                          placeholder='Grade'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <Autocomplete
                      multiple
                      style={{ width: '100%' }}
                      size='small'
                      limitTags={2}
                      onChange={handleSection}
                      id='section_id'
                      className='dropdownIcon'
                      value={selectedSection || []}
                      options={sectionList || []}
                      getOptionLabel={(option) => option?.section__section_name || ''}
                      getOptionSelected={(option, value) => option?.id == value?.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='Section'
                          placeholder='Section'
                        />
                      )}
                    />
                  </Grid>

                  {selectedClassType?.id === 0 && (
                    <Grid item md={3} xs={12}>
                      <Autocomplete
                        multiple
                        style={{ width: '100%' }}
                        size='small'
                        onChange={handleSubject}
                        id='course_id'
                        className='dropdownIcon'
                        value={selectedSubject}
                        options={subjectList}
                        limitTags={2}
                        getOptionLabel={(option) => option?.subject__subject_name}
                        getOptionSelected={(option, value) => option?.id == value?.id}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant='outlined'
                            label='Subject'
                            placeholder='Subject'
                          />
                        )}
                      />
                    </Grid>
                  )}

                  {selectedClassType?.id > 0 && (
                    <Grid item md={3} xs={12}>
                      <Autocomplete
                        style={{ width: '100%' }}
                        size='small'
                        onChange={handleCourse}
                        id='course_id'
                        className='dropdownIcon'
                        value={selectedCourse || ''}
                        options={courseList || []}
                        getOptionLabel={(option) => option?.course_name || ''}
                        filterSelectedOptions
                        getOptionSelected={(option, value) => option?.id == value?.id}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant='outlined'
                            label='Course'
                            placeholder='Course'
                          />
                        )}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} sm={3}>
                    <LocalizationProvider dateAdapter={MomentUtils}>
                      <DateRangePicker
                        startText='Select-date-range'
                        value={dateRangeTechPer}
                        onChange={(newValue) => {
                          setDateRangeTechPer(newValue);
                        }}
                        renderInput={({ inputProps, ...startProps }, endProps) => {
                          return (
                            <>
                              <TextField
                                {...startProps}
                                inputProps={{
                                  ...inputProps,
                                  value: `${moment(inputProps.value).format(
                                    'MM/DD/YYYY'
                                  )} - ${moment(endProps.inputProps.value).format(
                                    'MM/DD/YYYY'
                                  )}`,
                                  readOnly: true,
                                  endAdornment: (
                                    <IconButton>
                                      <DateRangeIcon
                                        style={{ width: '35px' }}
                                        color='primary'
                                      />
                                    </IconButton>
                                  ),
                                }}
                                size='small'
                              />
                            </>
                          );
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </>
              )}
            </Grid>

            {window.location.pathname !== '/erp-online-class-student-view' && (
              <Grid container spacing={2} style={{ marginTop: '5px' }}>
                <Grid item md={2} xs={12}>
                  <Button
                    variant='contained'
                    size='medium'
                    style={{ width: '100%' }}
                    className='cancelButton labelColor'
                    onClick={() => handleClearFilter()}
                  >
                    Clear All
                  </Button>
                </Grid>
                <Grid item md={2} xs={12}>
                  <Button
                    variant='contained'
                    size='medium'
                    style={{ color: 'white', width: '100%' }}
                    color='primary'
                    onClick={() => handleFilter()}
                  >
                    Get Classes
                  </Button>
                </Grid>
                <Grid item md={3} xs={12}>
                  <Button
                    variant='contained'
                    size='medium'
                    color='primary'
                    style={{ color: 'white', width: '100%' }}
                    onClick={handleDownload}
                  >
                    Download Class Data
                  </Button>
                </Grid>
              </Grid>
            )}
            {window.location.pathname !== '/erp-online-class-student-view' && (
              <Divider style={{ margin: '10px 0px' }} />
            )}
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} className='teacherBatchViewLCardList'>
                <TabPanel
                  tabValue={tabValue}
                  setTabValue={setTabValue}
                  setPage={setPage}
                  setSelectedViewMore={setSelectedViewMore}
                />
              </Grid>
              {window.location.pathname !== '/erp-online-class-student-view' && (
                <Grid item md={12} xs={12}>
                  {filterList?.length === 0 && (
                    <Grid item md={12} xs={12}>
                      <Grid container spacing={2}>
                        <Grid
                          item
                          md={12}
                          xs={12}
                          style={{ textAlign: 'center', marginTop: '10px' }}
                        >
                          <img
                            src={filterImage}
                            alt='crash'
                            height='250px'
                            width='250px'
                          />
                          <Typography>
                            Please select the filter to dislpay classes
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              )}
              {filterList?.length > 0 && (
                <Grid item md={12} xs={12} className='teacherBatchViewLCardList'>
                  <Grid container spacing={2}>
                    {filterList?.length === 0 && (
                      <Grid item md={12} xs={12}>
                        <Grid container spacing={2}>
                          <Grid item md={12} xs={12} style={{ textAlign: 'center' }}>
                            <img
                              src={filterImage}
                              alt='crash'
                              height='250px'
                              width='250px'
                            />
                            <Typography style={{ fontSize: '24px', fontWeight: 'bold' }}>
                              Classes Not Found
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                    <Grid container spacing={2}>
                      <Grid item md={selectedViewMore ? 8 : 12} xs={12}>
                        <Grid container spacing={2}>
                          {filterList?.map((item, i) => (
                            <Grid item md={selectedViewMore ? 4 : 3} xs={12}>
                              <CardView
                                tabValue={tabValue}
                                fullData={item}
                                handleViewMore={setSelectedViewMore}
                                selectedViewMore={selectedViewMore || {}}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                      {selectedViewMore?.id && (
                        <Grid item md={selectedViewMore ? 4 : 0} xs={12}>
                          <DetailCardView
                            tabValue={tabValue}
                            loading={loading}
                            setLoading={setLoading}
                            fullData={selectedViewMore}
                            handleClose={handleClose}
                            viewMoreRef={viewMoreRef}
                            selectedClassType={selectedClassType}
                            selectedGrade={selectedGrade}
                          />
                        </Grid>
                      )}
                    </Grid>

                    <Grid
                      container
                      spacing={3}
                      className='paginateData paginateMobileMargin'
                    >
                      <Grid item md={12}>
                        <Pagination
                          onChange={handlePagination}
                          style={{ marginTop: 25, marginLeft: 500 }}
                          count={Math.ceil(totalCount / limit)}
                          color='primary'
                          page={page}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Layout>
    </>
  );
};
export default withRouter(ErpAdminViewClass);
