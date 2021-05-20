/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect, useRef } from 'react';
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
// import './style.scss';
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
import CardView from './CardView';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import Layout from '../../../Layout';
import DateRangeIcon from '@material-ui/icons/DateRange';
import DetailCardView from './DetailCardView';

const ErpAdminViewClass = ({ history }) => {
  // const [dateRangeTechPer, setDateRangeTechPer] = useState([
  //   moment().subtract(6, 'days'),
  //   moment(),
  // ]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [branchList, setBranchList] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const [studentDetails] = useState(
    JSON.parse(window.localStorage.getItem('userDetails'))
  );
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [academicYear, setAcademicYear] = useState([]);
  const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [batchList, setBatchList] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [filterList, setFilterList] = useState('');
  const [filterFullData, setFilterFullData] = useState('');
  const [selectedModule] = useState(4);
  const [selectedViewMore, setSelectedViewMore] = useState('');
  const viewMoreRef = useRef(null);
  const limit = 9;
  const [dateRangeTechPer, setDateRangeTechPer] = useState([
    moment().subtract(6, 'days'),
    moment(),
  ]);
  const [startDateTechPer, setStartDateTechPer] = useState(moment().format('YYYY-MM-DD'));
  const [endDateTechPer, setEndDateTechPer] = useState(getDaysAfter(moment(), 7));

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
        } = JSON.parse(localStorage.getItem('filterData')) || {};
        setPage(pageNumber);
        if (classtype?.id >= 0) {
          setSelectedClassType(classtype);
          if (window.location.pathname === '/erp-online-class-student-view') {
            callApi(
              `${endpoints.studentViewBatchesApi.getBatchesApi}?user_id=${
                studentDetails &&
                studentDetails.role_details &&
                studentDetails.role_details.erp_user_id
              }&page_number=${pageNumber}&page_size=${limit}&class_type=${classtype?.id}`,
              'filter'
            );
          }
        }
        if (date?.length) {
          setDateRangeTechPer([moment(date?.[0]), moment(date?.[1])]);
        }
        if (academic?.id) {
          setSelectedAcadmeicYear(academic);
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
              callApi(
                `${endpoints.teacherViewBatches.courseListApi}?grade=${gradeIds}`,
                'course'
              );
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
                    callApi(
                      `${
                        endpoints.aol.classes
                      }?is_aol=0&session_year=${acadId}&section_mapping_ids=${section.map(
                        (el) => el?.id
                      )}&subject_id=${subject.map((el) => el?.subject__id)}&class_type=${
                        classtype?.id
                      }&start_date=${moment(date?.[0]).format(
                        'YYYY-MM-DD'
                      )}&end_date=${moment(date?.[1]).format(
                        'YYYY-MM-DD'
                      )}&module_id=${moduleId}&page_number=${pageNumber}&page_size=${limit}`,
                      'filter'
                    );
                  }
                } else {
                  if (course?.id) {
                    setSelectedCourse(course);
                    callApi(
                      `${
                        endpoints.aol.classes
                      }?is_aol=0&session_year=${acadId}&section_mapping_ids=${section.map(
                        (el) => el?.id
                      )}&class_type=${classtype?.id}&start_date=${moment(
                        date?.[0]
                      ).format('YYYY-MM-DD')}&end_date=${moment(date?.[1]).format(
                        'YYYY-MM-DD'
                      )}&course_id=${
                        course?.id
                      }&page_number=${pageNumber}&page_size=${limit}&module_id=${moduleId}`,
                      'filter'
                    );
                  }
                }
              }
            }
          }
        }
      }
    }
  }, [moduleId, window.location.pathname]);

  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'academicYearList') {
            setAcademicYear(result?.data?.data || []);
          }
          if (key === 'branchList') {
            setBranchList(result?.data?.data?.results || []);
          }
          if (key === 'gradeList') {
            setGradeList(result?.data?.data || []);
          }
          if (key === 'section') {
            setSectionList(result?.data?.data);
          }
          if (key === 'course') {
            setCourseList(result?.data?.result || []);
          }
          if (key === 'subject') {
            setSubjectList(result?.data?.data);
          }
          if (key === 'filter') {
            setTotalCount(result?.data?.count);
            setFilterFullData(result?.data);
            setFilterList(result?.data?.data);
            setSelectedViewMore('');
            const viewData = JSON.parse(localStorage.getItem('viewMoreData')) || '';
            setSelectedViewMore(viewData);
          }
          setLoading(false);
        } else {
          setAlert('error', result?.data?.message);
          setLoading(false);
          setFilterFullData([]);
          setFilterList([]);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
        setFilterFullData([]);
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
          }&module_id=${moduleId}`,
          'filter'
        );
      }
      if (
        window.location.pathname === '/erp-online-class' ||
        window.location.pathname === '/erp-online-class-teacher-view'
      ) {
        if (selectedCourse.id) {
          callApi(
            `${endpoints.aol.classes}?is_aol=0&session_year=${
              selectedAcademicYear.id
            }&section_mapping_ids=${selectedSection.map((el) => el.id)}&class_type=${
              selectedClassType.id
            }&start_date=${startDateTechPer?.format(
              'YYYY-MM-DD'
            )}&end_date=${endDateTechPer?.format('YYYY-MM-DD')}&course_id=${
              selectedCourse?.id
            }&page_number=${page}&page_size=${limit}&module_id=${moduleId}`,
            'filter'
          );
        } else {
          callApi(
            `${endpoints.aol.classes}?is_aol=0&session_year=${
              selectedAcademicYear?.id
            }&section_mapping_ids=${selectedSection.map(
              (el) => el.id
            )}&subject_id=${selectedSubject.map((el) => el?.subject__id)}&class_type=${
              selectedClassType?.id
            }&start_date=${startDateTechPer?.format(
              'YYYY-MM-DD'
            )}&end_date=${endDateTechPer?.format(
              'YYYY-MM-DD'
            )}&page_number=${page}&page_size=${limit}&module_id=${moduleId}`,
            'filter'
          );
        }
      }
    }
  }

  useEffect(() => {
    if (moduleId) {
      callApi(
        `${endpoints.userManagement.academicYear}?module_id=${moduleId}`,
        'academicYearList'
      );
    }
    if (window.location.pathname === '/erp-online-class-student-view') {
      callApi(
        `${endpoints.studentViewBatchesApi.getBatchesApi}?user_id=${
          studentDetails &&
          studentDetails.role_details &&
          studentDetails.role_details.erp_user_id
        }&page_number=${page}&page_size=${limit}&class_type=${selectedClassType?.id}`,
        'filter'
      );
    }
  }, [selectedClassType, moduleId]);

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
            }&page_number=${page}&page_size=${limit}&module_id=${moduleId}`,
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
            )}&page_number=${page}&page_size=${limit}&module_id=${moduleId}`,
            'filter'
          );
        }
      } else if (
        window.location.pathname === '/erp-online-class-student-view' &&
        selectedClassType
      ) {
        callApi(
          `${endpoints.studentViewBatchesApi.getBatchesApi}?user_id=${
            studentDetails &&
            studentDetails.role_details &&
            studentDetails.role_details.erp_user_id
          }&page_number=${page}&page_size=${limit}&class_type=${selectedClassType?.id}`,
          'filter'
        );
      }
    }
  }, [page]);

  function handleClearFilter() {
    localStorage.removeItem('filterData');
    localStorage.removeItem('viewMoreData');
    setDateRangeTechPer([moment().subtract(6, 'days'), moment()]);
    setEndDate('');
    setStartDate('');
    setSelectedGrade([]);
    setCourseList([]);
    setSelectedCourse('');
    setBatchList([]);
    setSelectedBatch('');
    setFilterList([]);
    setSelectedViewMore('');
    setSectionList([]);
    setSelectedSection([]);
    setSubjectList([]);
    setSelectedSubject([]);
    setSelectedBranch([]);
    setSelectedClassType('');
    setSelectedAcadmeicYear('');
    setPage(1);
  }

  function handleFilter() {
    const [startDateTechPer, endDateTechPer] = dateRangeTechPer;

    if (!selectedClassType) {
      setAlert('warning', 'Select Classtype');
      return;
    }
    if (!selectedAcademicYear) {
      setAlert('warning', 'Select Academic Year');
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
    setPage(1);

    localStorage.removeItem('viewMoreData');
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
        }&page_number=${page}&page_size=${limit}&module_id=${moduleId}`,
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
        )}&module_id=${moduleId}&page_number=${page}&page_size=${limit}`,
        'filter'
      );
    }
  }

  function handleDate(v1) {
    if (v1 && v1.length !== 0) {
      setStartDate(moment(new Date(v1[0])).format('YYYY-MM-DD'));
      setEndDate(moment(new Date(v1[1])).format('YYYY-MM-DD'));
    }
    setDateRangeTechPer(v1);
  }
  return (
    <>
      <Layout>
        <Grid container spacing={2} className='teacherBatchViewMainDiv'>
          <Grid item md={12} xs={12}>
            <Grid container spacing={2} justify='middle' className='signatureNavDiv'>
              <Grid item md={12} xs={12} style={{ display: 'flex' }}>
                <button
                  type='button'
                  className='SignatureNavigationLinks'
                  onClick={() => history.push('/dashboard')}
                >
                  Dashboard
                </button>
                <ArrowForwardIosIcon className='SignatureUploadNavArrow' />
                <span className='SignatureNavigationLinks'>Online Class</span>
                <ArrowForwardIosIcon className='SignatureUploadNavArrow' />
                <span className='SignatureNavigationLinks'>
                  {window.location.pathname === '/erp-online-class'
                    ? 'Online Class View'
                    : ''}
                  {window.location.pathname === '/erp-online-class-teacher-view'
                    ? 'Teacher Class View'
                    : ''}
                  {window.location.pathname === '/erp-online-class-student-view'
                    ? 'Student Class View'
                    : ''}
                </span>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={12} xs={12} className='teacherBatchViewFilter'>
            <Grid container spacing={2} style={{ marginTop: '10px' }}>
              <Grid item md={3} xs={12}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  onChange={(event, value) => {
                    if (window.location.pathname === '/erp-online-class-student-view') {
                      localStorage.setItem(
                        'filterData',
                        JSON.stringify({
                          classtype: value,
                        })
                      );
                    }
                    localStorage.removeItem('viewMoreData');
                    setSelectedClassType(value);
                    setSelectedGrade([]);
                    setCourseList([]);
                    setSelectedCourse('');
                    setBatchList([]);
                    setSelectedBatch('');
                    setFilterList([]);
                    setSelectedViewMore('');
                    setSectionList([]);
                    setSelectedSection([]);
                    setSubjectList([]);
                    setSelectedSubject([]);
                    setSelectedBranch([]);
                    setSelectedAcadmeicYear('');
                    setFilterList([]);
                    setPage(1);
                  }}
                  id='branch_id'
                  className='dropdownIcon'
                  value={selectedClassType}
                  options={classTypes || []}
                  getOptionLabel={(option) => option?.type || ''}
                  filterSelectedOptions
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
                      style={{ width: '100%' }}
                      size='small'
                      onChange={(event, value) => {
                        setSelectedAcadmeicYear(value);
                        if (value) {
                          callApi(
                            `${endpoints.communication.branches}?session_year=${value?.id}&module_id=${moduleId}`,
                            'branchList'
                          );
                        }
                        setBranchList([]);
                        setGradeList([]);
                        setSelectedGrade([]);
                        setCourseList([]);
                        setSelectedCourse('');
                        setBatchList([]);
                        setSelectedBatch('');
                        setFilterList([]);
                        setSelectedViewMore('');
                        setSectionList([]);
                        setSelectedSection([]);
                        setSubjectList([]);
                        setSelectedSubject([]);
                        setSelectedBranch([]);
                        setFilterList([]);
                        setPage(1);
                      }}
                      id='branch_id'
                      className='dropdownIcon'
                      value={selectedAcademicYear}
                      options={academicYear}
                      getOptionLabel={(option) => option?.session_year}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          label='Academic Year'
                          placeholder='Academic Year'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <Autocomplete
                      multiple
                      style={{ width: '100%' }}
                      size='small'
                      onChange={(event, value) => {
                        setSelectedBranch([]);
                        setGradeList([]);
                        if (value?.length) {
                          const ids = value.map((el) => el);
                          const selectedId = value.map((el) => el?.branch?.id);
                          setSelectedBranch(ids);
                          callApi(
                            `${endpoints.academics.grades}?session_year=${
                              selectedAcademicYear.id
                            }&branch_id=${selectedId.toString()}&module_id=${moduleId}`,
                            'gradeList'
                          );
                        }
                        setSelectedGrade([]);
                        setCourseList([]);
                        setSelectedCourse('');
                        setBatchList([]);
                        setSelectedBatch('');
                        setFilterList([]);
                        setSectionList([]);
                        setSelectedSection([]);
                        setSubjectList([]);
                        setSelectedSubject([]);
                        setFilterList([]);
                        setPage(1);
                      }}
                      id='branch_id'
                      className='dropdownIcon'
                      value={selectedBranch}
                      options={branchList}
                      getOptionLabel={(option) => option?.branch?.branch_name}
                      filterSelectedOptions
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
                      onChange={(event, value) => {
                        setSelectedGrade([]);
                        if (value?.length) {
                          const ids = value.map((el) => el) || [];
                          const selectedId = value.map((el) => el?.grade_id) || [];
                          const branchId =
                            selectedBranch.map((el) => el?.branch?.id) || [];
                          setSelectedGrade(ids);
                          callApi(
                            `${endpoints.academics.sections}?session_year=${selectedAcademicYear?.id}&branch_id=${branchId}&grade_id=${selectedId}&module_id=${moduleId}`,
                            'section'
                          );
                          callApi(
                            `${endpoints.teacherViewBatches.courseListApi}?grade=${selectedId}`,
                            'course'
                          );
                        }
                        setCourseList([]);
                        setSelectedCourse('');
                        setBatchList([]);
                        setSelectedBatch('');
                        setFilterList([]);
                        setSectionList([]);
                        setSelectedSection([]);
                        setSubjectList([]);
                        setSelectedSubject([]);
                        setFilterList([]);
                        setPage(1);
                      }}
                      id='grade_id'
                      className='dropdownIcon'
                      value={selectedGrade}
                      options={gradeList}
                      getOptionLabel={(option) => option?.grade__grade_name}
                      filterSelectedOptions
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
                      onChange={(event, value) => {
                        setSelectedSection([]);
                        if (value?.length) {
                          const ids = value.map((el) => el);
                          const secId = value.map((el) => el?.section_id);
                          setSelectedSection(ids);
                          callApi(
                            `${endpoints.academics.subjects}?branch=${selectedBranch.map(
                              (el) => el?.branch?.id
                            )}&session_year=${
                              selectedAcademicYear?.id
                            }&grade=${selectedGrade.map(
                              (el) => el?.grade_id
                            )}&section=${secId}&module_id=${moduleId}`,
                            'subject'
                          );
                        }
                        setBatchList([]);
                        setSelectedBatch('');
                        setSelectedCourse('');
                        setSubjectList([]);
                        setSelectedSubject([]);
                        setFilterList([]);
                        setPage(1);
                      }}
                      id='section_id'
                      className='dropdownIcon'
                      value={selectedSection}
                      options={sectionList}
                      getOptionLabel={(option) => option?.section__section_name || ''}
                      filterSelectedOptions
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

                  {selectedClassType?.id === 0 && gradeList.length > 0 ? (
                    <Grid item md={3} xs={12}>
                      <Autocomplete
                        multiple
                        style={{ width: '100%' }}
                        size='small'
                        onChange={(event, value) => {
                          setSelectedSubject([]);
                          if (value?.length) {
                            const ids = value.map((el) => el) || [];
                            setSelectedSubject(ids);
                          }
                          setBatchList([]);
                          setSelectedBatch('');
                          setFilterList([]);
                          setPage(1);
                        }}
                        id='course_id'
                        className='dropdownIcon'
                        value={selectedSubject}
                        options={subjectList}
                        getOptionLabel={(option) => option?.subject__subject_name}
                        filterSelectedOptions
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
                  ) : (
                    <Grid item md={3} xs={12}>
                      <Autocomplete
                        style={{ width: '100%' }}
                        size='small'
                        onChange={(event, value) => {
                          setSelectedCourse(value);
                          setBatchList([]);
                          setSelectedBatch('');
                          setFilterList([]);
                          setPage(1);
                        }}
                        id='course_id'
                        className='dropdownIcon'
                        value={selectedCourse}
                        options={courseList}
                        getOptionLabel={(option) => option?.course_name}
                        filterSelectedOptions
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
                                    'DD-MM-YYYY'
                                  )} - ${moment(endProps.inputProps.value).format(
                                    'DD-MM-YYYY'
                                  )}`,
                                  readOnly: true,
                                  endAdornment: (
                                    // <InputAdornment position="end">
                                    <IconButton>
                                      <DateRangeIcon
                                        style={{ width: '35px' }}
                                        color='primary'
                                      />
                                    </IconButton>
                                    // </InputAdornment>
                                  ),
                                }}
                                size='small'
                                // style={{ minWidth: '100%' }}
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
                    size='large'
                    className='BatchViewfilterButtons'
                    onClick={() => handleClearFilter()}
                  >
                    Clear All
                  </Button>
                </Grid>
                <Grid item md={2} xs={12}>
                  <Button
                    variant='contained'
                    size='large'
                    className='BatchViewfilterButtons'
                    onClick={() => handleFilter()}
                  >
                    Get Classes
                  </Button>
                </Grid>
              </Grid>
            )}
            {window.location.pathname !== '/erp-online-class-student-view' && (
              <Divider style={{ margin: '10px 0px' }} />
            )}
            <Grid container spacing={2}>
              {window.location.pathname !== '/erp-online-class-student-view' && (
                <Grid item md={12} xs={12}>
                  {!filterList && (
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
              {filterList && (
                <Grid item md={12} xs={12} className='teacherBatchViewLCardList'>
                  <Grid container spacing={2}>
                    {filterList && filterList.length === 0 && (
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
                          {filterList &&
                            filterList.length !== 0 &&
                            filterList.map((item, i) => (
                              <Grid item md={selectedViewMore ? 6 : 4} xs={12}>
                                <CardView
                                  fullData={item}
                                  // index={i}
                                  handleViewMore={setSelectedViewMore}
                                  selectedViewMore={selectedViewMore || {}}
                                  viewMoreRef={viewMoreRef}
                                />
                              </Grid>
                            ))}
                        </Grid>
                      </Grid>
                      {selectedViewMore?.id && (
                        <Grid item md={selectedViewMore ? 4 : 0} xs={12}>
                          <DetailCardView
                            fullData={selectedViewMore}
                            // index={i}
                            handleClose={handleClose}
                            viewMoreRef={viewMoreRef}
                            selectedClassType={selectedClassType}
                            selectedGrade={selectedGrade}
                          />
                        </Grid>
                      )}
                    </Grid>
                    <div className='paginateData paginateMobileMargin'>
                      <Pagination
                        onChange={handlePagination}
                        style={{ marginTop: 25 }}
                        count={Math.ceil(totalCount / limit)}
                        color='primary'
                        page={page}
                      />
                    </div>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        {loading && <Loader />}
      </Layout>
    </>
  );
};
export default withRouter(ErpAdminViewClass);
