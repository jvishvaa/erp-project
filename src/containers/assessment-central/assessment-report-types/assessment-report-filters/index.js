import React, { useEffect, useState, useContext } from 'react';
import {
  Grid,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Box,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { fetchAssessmentReportList } from '../../../../redux/actions';
import { generateQueryParamSting } from '../../../../utility-functions';
import axiosInstance from 'config/axios';
import { connect, useSelector } from 'react-redux';
import axios from 'axios';
import endpoints from 'config/endpoints';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import './assessment-report-filters.css';
import { result } from 'lodash';
import FileSaver from 'file-saver';
import { getReportCardStatus } from '../../report-card/apis';
import { handleDownloadPdf } from '../../../../../src/utility-functions';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import apiRequest from 'containers/dashboard/StudentDashboard/config/apiRequest';
import Weeklyassesmentreport from '../student-report/weekly-quiz-performnace';
import Loading from '../../../../components/loader/loader'
let url = '';
const AssessmentReportFilters = ({
  widerWidth,
  isMobile,
  fetchAssessmentReportList,
  selectedReportType,
  isFilter,
  setIsFilter,
  classTopicAverage,
  page,
  setPage,
  setSelectedERP,
  pageSize,
  setIsPreview,
  setReportCardData,
  filterData,
  setFilterData
}) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [moduleId, setModuleId] = useState('');
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [previewButton, setPreviewButton] = useState(false);
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [dropdownData, setDropdownData] = useState({
    branch: [],
    grade: [],
    section: [],
    subject: [],
    test: [],
    chapter: [],
    topic: [],
    erp: [],
  });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(null);
  const [mappingList, setMappingList] = useState([]);
  const [downloadTestId, setDownloadTestId] = useState(null);

  const [examDate, setExamDate] = useState(null);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Assessment' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Assessment Report') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
    fetchReportCardStatus();
  }, []);

  // const checkReportAvailable = (branchId, gradeId) => {
  //   return mappingList.some(({ branch_details = {}, grade_details = {}, status }) => {
  //     const { branch_id = '' } = branch_details || {};
  //     const { grade_id = '' } = grade_details || {};
  //     return branch_id === branchId && grade_id === gradeId && status === '2';
  //   });
  // };

  const fetchReportCardStatus = async () => {
    try {
      const {
        result = [],
        message = 'Error',
        status_code: status = 400,
      } = await getReportCardStatus();
      setMappingList(result);
    } catch (err) { }
  };

  useEffect(() => {
    if (page && isFilter) handleFilter();
  }, [page]);

  useEffect(() => {
    handleAcademicYear('', selectedAcademicYear);
    setIsFilter(false);
    setPage(1);
    if (selectedReportType?.id) {
      setFilterData({
        branch: '',
        grade: '',
        section: '',
        subject: '',
        test: '',
        chapter: '',
        topic: '',
      });
    }
  }, [selectedReportType?.id, moduleId]);

  const fetchReportCardData = (params) => {
    setLoading(true);
    apiRequest('get', `${endpoints.assessmentReportTypes.reportCardData}${params}`, null, null, false, 60000)
      .then((result) => {
        if (result?.data?.status === 200) {
          setReportCardData(result?.data?.result);
          setIsPreview(true);
          setPreviewButton(true);
          setLoading(false);
        }
        setLoading(false);
      })

      .catch((error) => {
        setAlert('error', "Error While Fetching Report Card")
        setLoading(false);
      });
  };

  const handleDateChange = (name, date) => {
    if (name === 'startDate') setStartDate(date);
    else setEndDate(date);
  };
  const handleDateChanges = (name, date) => {
    if (name === 'examDate') setExamDate(date);
  };

  const handlePreview = () => {
    setLoading(true);
    let paramObj = {
      session_year_id: selectedAcademicYear?.id,
      acad_session: filterData.branch?.id,
      erp: filterData.erp?.erp_id,
      grade: filterData.grade?.grade_id,
      section: filterData.section?.section_id,
      // acad_session: 17,
      // erp: '2105670829_OLV',
      // grade: 3,
    };
    const isPreview = Object.values(paramObj).every(Boolean);
    if (!isPreview) {
      for (const [key, value] of Object.entries(paramObj).reverse()) {
        if (key === 'acad_session' && !Boolean(value))
          setAlert('error', `Please select Branch`);
        else if (!Boolean(value)) setAlert('error', `Please select ${key}.`);
      }
      return;
    }
    let params = `?${generateQueryParamSting({ ...paramObj, is_student: false })}`;
    fetchReportCardData(params);
  };

  const handleFilter = () => {
    let paramObj = {
      test: filterData.test?.id,
    };
    if (selectedReportType?.id === 3) {
      paramObj = { ...paramObj, section_mapping: filterData.section?.id };
    }
    if (selectedReportType?.id === 4) {
      paramObj = {
        ...paramObj,
        section_mapping: filterData.section?.id,
        topic: filterData.topic?.id,
      };
    }
    if (selectedReportType?.id === 6) {
      paramObj = {
        ...paramObj,
        section_mapping: filterData.section?.id,
      };
    }
    if (selectedReportType?.id === 7) {
      paramObj = {
        ...paramObj,
        section_mapping: filterData.section?.id,
      };
    }
    // setSelectedERP([]);
    const filterFlag = Object.values(paramObj).every(Boolean);
    if (filterFlag) {
      paramObj = { ...paramObj, page: page, page_size: pageSize };
      url = `?${generateQueryParamSting(paramObj)}`;
      fetchAssessmentReportList(selectedReportType, url);
      setIsFilter(true);
    } else {
      for (const [key, value] of Object.entries(paramObj).reverse()) {
        if (key === 'central_gs_id' && !Boolean(value))
          setAlert('error', `Please select Subject.`);
        if (key === 'section_mapping' && !Boolean(value))
          setAlert('error', `Please select Section.`);
        else if (!Boolean(value)) setAlert('error', `Please select ${key}.`);
      }
    }
  };

  function getBranch(acadId) {
    axiosInstance
      .get(`${endpoints.academics.branches}?session_year=${acadId}&module_id=${moduleId}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              branch: result.data?.data?.results,
            };
          });
        }
      })
      .catch((error) => { });
  }

  function getGrade(acadId, branchId) {
    axiosInstance
      .get(
        `${endpoints.academics.grades}?session_year=${acadId}&branch_id=${branchId}&module_id=${moduleId}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              grade: result.data?.data,
            };
          });
        }
      })
      .catch((error) => { });
  }

  function getSection(acadId, branchId, gradeId) {
    axiosInstance
      .get(
        `${endpoints.academics.sections}?session_year=${acadId}&branch_id=${branchId}&grade_id=${gradeId}&module_id=${moduleId}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              section: result.data?.data,
            };
          });
        }
      })
      .catch((error) => { });
  }

  function getSubject(acadMappingId, gradeId) {
    axiosInstance
      .get(
        `${endpoints.assessmentErp.subjectList}?session_year=${acadMappingId}&grade=${gradeId}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              subject: result.data?.result,
            };
          });
        }
      })
      .catch((error) => { });
  }

  function getTest(branchId, gradeId, subjectId) {
    axiosInstance
      .get(
        `${endpoints.assessmentErp.testList}?session_year=${selectedAcademicYear?.id}&branch=${branchId}&grade=${gradeId}&subjects=${subjectId}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              test: result.data?.result,
            };
          });
        }
      })
      .catch((error) => { });
  }

  function getChapter(subjectId) {
    axiosInstance
      .get(`${endpoints.assessmentErp.chapterList}?subject=${subjectId}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              chapter: result.data?.result,
            };
          });
        }
      })
      .catch((error) => { });
  }

  function getTopic(chapterId, isCentral) {
    setDropdownData({ ...dropdownData, topic: [] });
    if (isCentral) {
      axios
        .get(`${endpoints.createQuestionApis.topicList}?chapter=${chapterId}`, {
          headers: { 'x-api-key': 'vikash@12345#1231' },
        })
        .then((result) => {
          if (result.data.status_code === 200) {
            setDropdownData((prev) => {
              return {
                ...prev,
                topic: result.data?.result,
              };
            });
          }
        })
        .catch((error) => { });
    } else {
      axiosInstance
        .get(`${endpoints.assessmentErp.topicList}?chapter=${chapterId}`)
        .then((result) => {
          if (result.data.status_code === 200) {
            setDropdownData((prev) => {
              return {
                ...prev,
                topic: result.data?.result,
              };
            });
          }
        })
        .catch((error) => { });
    }
  }

  const getERP = (branchId, gradeId, sectionId) => {
    setIsLoading(true);
    const {
      personal_info: { role = '' },
    } = userDetails || {};
    let params = `?branch=${branchId}&session_year=${selectedAcademicYear?.id}&grade=${gradeId}&section=${sectionId}`;
    if (role) params += `&role=${role}`;
    axiosInstance
      .get(`${endpoints.communication.studentUserList}${params}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDropdownData((prev) => {
            return {
              ...prev,
              erp: result.data?.data?.results,
            };
          });
        }
        setIsLoading(null);
      })
      .catch((error) => {
        setIsLoading(null);
      });
  };

  const handleAcademicYear = (event, value) => {
    setDropdownData({
      ...dropdownData,
      branch: [],
      grade: [],
      subject: [],
      section: [],
      test: [],
      chapter: [],
      topic: [],
    });
    setFilterData({
      ...filterData,
      branch: '',
      grade: '',
      section: '',
      subject: '',
      test: '',
      chapter: '',
      topic: '',
    });
    if (value) {
      getBranch(value?.id);
      setFilterData({ ...filterData, selectedAcademicYear });
    }
  };

  const handleBranch = (event, value) => {
    setDropdownData({
      ...dropdownData,
      grade: [],
      subject: [],
      section: [],
      test: [],
      chapter: [],
      topic: [],
      erp: [],
    });
    setFilterData({
      ...filterData,
      branch: '',
      grade: '',
      section: '',
      subject: '',
      test: '',
      chapter: '',
      topic: '',
      erp: '',
    });
    if (value) {
      getGrade(selectedAcademicYear?.id, value?.branch?.id);
      setFilterData({ ...filterData, branch: value });
    }
  };

  const handleGrade = (event, value) => {
    setDropdownData({
      ...dropdownData,
      subject: [],
      section: [],
      test: [],
      chapter: [],
      topic: [],
      erp: [],
    });
    setFilterData({
      ...filterData,
      grade: '',
      section: '',
      subject: '',
      test: '',
      chapter: '',
      topic: '',
      erp: '',
    });
    if (value) {
      setFilterData({ ...filterData, grade: value });
      if (
        selectedReportType.id === 3 ||
        selectedReportType.id === 4 ||
        selectedReportType.id === 6 ||
        selectedReportType.id === 7 ||
        selectedReportType.id === 8
      ) {
        getSection(
          selectedAcademicYear?.id,
          filterData.branch?.branch?.id,
          value?.grade_id
        );
      }
      if (selectedReportType.id !== 5) {
        getSubject(filterData.branch?.id, value?.grade_id);
      } else {
        // if (checkReportAvailable(filterData.branch?.branch?.id, value?.grade_id)) {
        getSection(
          selectedAcademicYear?.id,
          filterData.branch?.branch?.id,
          value?.grade_id
        );
        // } else {
        // setAlert('error', 'Report Card not published yet');
        // }
      }
    }
  };

  const handleSection = (event, value) => {
    setFilterData({ ...filterData, section: '' });
    if (value) {
      if (selectedReportType.id === 5) {
        getERP(
          filterData.branch?.branch?.id,
          filterData.grade?.grade_id,
          value?.section_id
        );
      }
      setFilterData({ ...filterData, section: value });
    }
  };

  const handleSubject = (event, value) => {
    setDropdownData({
      ...dropdownData,
      test: [],
      chapter: [],
      topic: [],
    });
    setFilterData({
      ...filterData,
      subject: '',
      test: '',
      chapter: '',
      topic: '',
    });
    if (value) {
      getTest(
        filterData.branch?.branch?.id,
        filterData.grade?.grade_id,
        value?.subject_id
      );
      if (selectedReportType.id === 4) getChapter(value?.subject_id);
      setFilterData({ ...filterData, subject: value });
    }
  };

  const handleTest = (event, value) => {
    setFilterData({ ...filterData, test: '' });
    if (value) {
      setFilterData({ ...filterData, test: value });
    }
  };

  const handleChapter = (event, value) => {
    setDropdownData({ ...dropdownData, topic: [] });
    setFilterData({ ...filterData, chapter: '', topic: '' });
    if (value) {
      getTopic(value?.id, value?.is_central);
      setFilterData({ ...filterData, chapter: value });
    }
  };

  const handleTopic = (event, value) => {
    setFilterData({ ...filterData, topic: '' });
    if (value) {
      setFilterData({ ...filterData, topic: value });
    }
  };

  const handleERP = (event, value) => {
    setFilterData({ ...filterData, erp: '' });
    if (value) {
      setFilterData({ ...filterData, erp: value });
    }
  };

  const handleDownload = async () => {
    if (selectedReportType?.id === 1 && isFilter) {
      try {
        const { data } = await axiosInstance.get(
          `${endpoints.assessmentReportTypes.reportDowloadSectionWise
          }?test=${JSON.stringify(filterData.test?.id)}`,
          {
            responseType: 'arraybuffer',
          }
        );
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, `ClassAverage_Report${new Date()}.xls`);
      } catch (error) {
        setAlert('error', 'Failed to download attendee list');
      }
    }
    if (selectedReportType?.id === 2 && isFilter) {
      try {
        const { data } = await axiosInstance.get(
          `${endpoints.assessmentReportTypes.reportDownloadTopicWise
          }?test=${JSON.stringify(filterData.test?.id)}`,
          {
            responseType: 'arraybuffer',
          }
        );
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, `Topic_Report${new Date()}.xls`);
      } catch (error) {
        setAlert('error', 'Failed to download attendee list');
      }
    }
    if (selectedReportType?.id === 3 && isFilter) {
      try {
        const { data } = await axiosInstance.get(
          `${endpoints.assessmentReportTypes.reportDownloadClassAverage
          }?test=${JSON.stringify(filterData.test?.id)}`,
          {
            responseType: 'arraybuffer',
          }
        );
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, `StudentMarks_Report${new Date()}.xls`);
      } catch (error) {
        setAlert('error', 'Failed to download attendee list');
      }
    }
    if (selectedReportType?.id === 4 && isFilter) {
      try {
        const { data } = await axiosInstance.get(
          `${endpoints.assessmentReportTypes.reportDownloadTopicStudentAverage
          }?test=${JSON.stringify(filterData.test?.id)}&section_mapping=${filterData.section?.id
          }&topic=${filterData.topic?.id}`,
          {
            responseType: 'arraybuffer',
          }
        );
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, `IndivisualTopic_Report${new Date()}.xls`);
      } catch (error) {
        setAlert('error', 'Failed to download attendee list');
      }
    }

    if (selectedReportType?.id === 6) {
      try {
        const { data } = await axiosInstance.get(
          `${endpoints.assessmentReportTypes.reportPdf}?test=${JSON.stringify(
            filterData.test?.id
          )}&section_mapping=${filterData.section?.id}`,
          {
            responseType: 'arraybuffer',
          }
        );
        const blob = new Blob([data], {
          type: 'application/pdf',
        });
        FileSaver.saveAs(blob, `Quiz_Report${new Date()}.pdf`);
      } catch (error) {
        setAlert('error', 'Failed to download attendee list');
      }
    }

    if (selectedReportType?.id === 7) {
      try {
        const { data } = await axiosInstance.get(
          `${endpoints.assessmentReportTypes.weeklyStudentReport}?section_mapping=${filterData.section?.id}&start_date=${startDate}&end_date=${endDate}`,
          {
            responseType: 'arraybuffer',
          }
        );
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, `WeeklyStudent_Report${new Date()}.xls`);
      } catch (error) {
        setAlert('error', 'Failed to download report');
      }
    }

    if (selectedReportType?.id === 8) {
      try {
        // http://localhost:8000/qbox/assessment/download-report-consolidate/?section_mapping=5&test=90&subject_id=3
        const { data } = await axiosInstance.get(
          `${endpoints.assessmentReportTypes.reportConsolidated}?section_mapping=${filterData.section?.id
          }&test=${JSON.stringify(filterData.test?.id)}&subject_id=${filterData?.subject?.subject_id
          }`,
          {
            responseType: 'arraybuffer',
          }
        );
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, `consolidated_Report${new Date()}.xls`);
      } catch (error) {
        setAlert('error', 'Failed to download report');
      }
    }

    if (selectedReportType?.id === 9) {
      try {
        const { data } = await axiosInstance.get(
          `${endpoints.assessmentReportTypes.individualQuizTeacherReport}?academic_year=${selectedAcademicYear?.id}&branch_id=${filterData.branch?.branch?.id}&grade_id=${filterData.grade?.grade_id}&subject_id=${filterData?.subject?.subject_id}&start_date=${startDate}&end_date=${endDate}`,
          {
            responseType: 'arraybuffer',
          }
        );
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, `individualTeacher_Report${new Date()}.xls`);
      } catch (error) {
        setAlert('error', 'Failed to download report');
      }
    }

    if (selectedReportType?.id === 10) {
      try {
        const { data } = await axiosInstance.get(
          `${endpoints.assessmentReportTypes.weeklyTeacherReportEachGrade}?academic_year=${selectedAcademicYear?.id}&branch_id=${filterData.branch?.branch?.id}&grade_id=${filterData.grade?.grade_id}&subject_id=${filterData?.subject?.subject_id}&start_date=${startDate}&end_date=${endDate}`,
          {
            responseType: 'arraybuffer',
          }
        );
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, `weeklyTeacherReport_EachGrade${new Date()}.xls`);
      } catch (error) {
        setAlert('error', 'Failed to download report');
      }
    }
    if (selectedReportType?.id === 13) {
      console.log(filterData, "dwa")
      try {
        const { data } = await axiosInstance.get(
          `${endpoints.assessmentReportTypes.downloadReportTestReport
          }?academic_year=${selectedAcademicYear?.id}&branch_id=${filterData?.branch?.branch?.id}&grade_id=${filterData?.grade?.grade_id}&subject_id=${filterData?.subject?.subject_id}&start_date=${startDate}&end_date=${endDate}`,
          {
            responseType: 'arraybuffer',
          }
        );
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, `Consolidated Report Assessment${new Date()}.xls`);
      } catch (error) {
        setAlert('error', 'Failed to download attendee list');
      }
    }
  };

  const handleClear = () => {
    url = '';
    setPage(1);
    setSelectedERP([]);
    setIsFilter(false);
    setDropdownData({
      ...dropdownData,
      grade: [],
      section: [],
      subject: [],
      test: [],
      chapter: [],
      topic: [],
      erp: [],
    });

    setFilterData({
      branch: '',
      grade: '',
      section: '',
      subject: '',
      test: '',
      chapter: '',
      topic: '',
    });
  };

  return (
    <>
      <Grid
        container
        spacing={isMobile ? 3 : 5}
        style={{
          width: widerWidth,
          margin: isMobile ? '10px 0px -10px 0px' : '-20px 0px 20px 8px',
        }}
      >
        {loading ? <Loading message='Please Wait While Report Card is Being Generated...' /> : null}
        {selectedReportType?.id !== 11 && (
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleBranch}
              id='branch'
              value={filterData.branch || {}}
              options={dropdownData.branch || []}
              getOptionLabel={(option) => option?.branch?.branch_name || ''}
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
        )}
        {selectedReportType?.id !== 11 && (
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleGrade}
              id='grade'
              value={filterData.grade || {}}
              options={dropdownData.grade || []}
              getOptionLabel={(option) => option?.grade__grade_name || ''}
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
        )}
        {(selectedReportType?.id === 3 ||
          selectedReportType?.id === 4 ||
          selectedReportType?.id === 5 ||
          selectedReportType?.id === 6 ||
          selectedReportType?.id === 7 ||
          selectedReportType?.id === 8) && (
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleSection}
                id='section'
                value={filterData.section || {}}
                options={dropdownData.section || []}
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
          )}
        {selectedReportType?.id !== 5 &&
          selectedReportType?.id !== 11 &&
          selectedReportType?.id !== 7 && (
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleSubject}
                id='subject'
                value={filterData.subject || {}}
                options={dropdownData.subject || []}
                getOptionLabel={(option) => option?.subject_name || ''}
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
          )}
        {selectedReportType?.id !== 5 &&
          selectedReportType?.id !== 7 &&
          selectedReportType?.id !== 9 &&
          selectedReportType?.id !== 10 &&
          selectedReportType?.id !== 11 &&
          selectedReportType?.id !== 13 && (
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleTest}
                id='test'
                value={filterData.test || {}}
                options={dropdownData.test || []}
                getOptionLabel={(option) => option?.test_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Test'
                    placeholder='Test'
                  />
                )}
              />
            </Grid>
          )}
        {selectedReportType?.id === 4 && (
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleChapter}
              id='chapter'
              value={filterData.chapter || {}}
              options={dropdownData.chapter || []}
              getOptionLabel={(option) => option?.chapter_name || ''}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Chapter'
                  placeholder='Chapter'
                />
              )}
            />
          </Grid>
        )}
        {selectedReportType?.id === 4 && (
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleTopic}
              id='topic'
              value={filterData.topic || {}}
              options={dropdownData.topic || []}
              getOptionLabel={(option) => option?.topic_name || ''}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Topic'
                  placeholder='Topic'
                />
              )}
            />
          </Grid>
        )}

        {selectedReportType?.id === 11 && <Weeklyassesmentreport />}
        {/* {selectedReportType?.id === 7 && (
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleTopic}
              id='topic'
              value={filterData.topic || {}}
              options={dropdownData.topic || []}
              getOptionLabel={(option) => option?.topic_name || ''}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Topic'
                  placeholder='Topic'
                />
              )}
            />
          </Grid>
        )} */}

        {selectedReportType?.id === 7 ||
          selectedReportType?.id == 13 && (
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
                <KeyboardDatePicker
                  size='small'
                  color='primary'
                  // disableToolbar
                  variant='dialog'
                  format='YYYY-MM-DD'
                  margin='none'
                  id='date-picker-start-date'
                  label='Start date'
                  value={startDate}
                  onChange={(event, date) => {
                    handleDateChange('startDate', date);
                  }}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  style={{ marginTop: -6 }}
                />
              </Grid>
              <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
                <KeyboardDatePicker
                  size='small'
                  // disableToolbar
                  variant='dialog'
                  format='YYYY-MM-DD'
                  margin='none'
                  id='date-picker-end-date'
                  name='endDate'
                  label='End date'
                  value={endDate}
                  onChange={(event, date) => {
                    handleDateChange('endDate', date);
                  }}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                // style={{ marginTop: -6 }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
          )}
        {selectedReportType?.id === 9 && (
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <KeyboardDatePicker
                size='small'
                color='primary'
                // disableToolbar
                variant='dialog'
                format='YYYY-MM-DD'
                margin='none'
                id='date-picker-start-date'
                label='Start date'
                value={startDate}
                onChange={(event, date) => {
                  handleDateChange('startDate', date);
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                style={{ marginTop: -6 }}
              />
            </Grid>
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <KeyboardDatePicker
                size='small'
                // disableToolbar
                variant='dialog'
                format='YYYY-MM-DD'
                margin='none'
                id='date-picker-end-date'
                name='endDate'
                label='End date'
                value={endDate}
                onChange={(event, date) => {
                  handleDateChange('endDate', date);
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              // style={{ marginTop: -6 }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        )}
        {selectedReportType?.id === 10 && (
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <KeyboardDatePicker
                size='small'
                color='primary'
                // disableToolbar
                variant='dialog'
                format='YYYY-MM-DD'
                margin='none'
                id='date-picker-start-date'
                label='Start date'
                value={startDate}
                onChange={(event, date) => {
                  handleDateChange('startDate', date);
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                style={{ marginTop: -6 }}
              />
            </Grid>
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <KeyboardDatePicker
                size='small'
                // disableToolbar
                variant='dialog'
                format='YYYY-MM-DD'
                margin='none'
                id='date-picker-end-date'
                name='endDate'
                label='End date'
                value={endDate}
                onChange={(event, date) => {
                  handleDateChange('endDate', date);
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              // style={{ marginTop: -6 }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        )}

        {/* {selectedReportType?.id === 8 && (
<MuiPickersUtilsProvider utils={MomentUtils}>
<Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <KeyboardDatePicker
              size='small'
              color='primary'
              // disableToolbar
              variant='dialog'
              format='YYYY-MM-DD'
              margin='none'
              id='date-picker-start-date'
              label='exam date'
              value={examDate}
              onChange={(event, date) => {
                handleDateChanges('examDate', date);
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
          </MuiPickersUtilsProvider>
)} */}
        {isFilter &&
          classTopicAverage &&
          (selectedReportType?.id === 3 || selectedReportType?.id === 4) && (
            <Grid item xs={12} sm={3}>
              <div className='classTopicContainer'>
                <div className='classTopicTag'>
                  {selectedReportType?.id === 3 ? 'Class Average' : 'Topic Average'}:
                </div>
                <div className='classTopicIcon'>{classTopicAverage}</div>
              </div>
            </Grid>
          )}
        {selectedReportType?.id === 5 && (
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleERP}
              id='erp'
              value={filterData.erp || {}}
              options={dropdownData.erp || []}
              getOptionLabel={({ user = '' }) =>
                user ? `${user?.first_name} ${user?.last_name}-${user?.username}` : ''
              }
              filterSelectedOptions
              renderInput={(params) => (
                <TextField {...params} variant='outlined' label='ERP' placeholder='ERP' />
              )}
            />
          </Grid>
        )}
      </Grid>

      <Grid
        container
        spacing={isMobile ? 3 : 5}
        style={{
          width: widerWidth,
          margin: isMobile ? '10px 0px -10px 0px' : '-20px 0px 20px 8px',
        }}
      >
        {selectedReportType?.id !== 11 && (
          <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
            <Button
              variant='contained'
              className='canceButton labelColor'
              size='medium'
              style={{ width: '100%' }}
              onClick={handleClear}
            >
              Clear All
            </Button>
          </Grid>
        )}
        {selectedReportType?.id === 6 ||
          selectedReportType?.id === 7 ||
          selectedReportType?.id === 8 ||
          selectedReportType?.id === 9 ||
          selectedReportType?.id === 10 ||
          selectedReportType?.id === 11 ||
          selectedReportType?.id === 13 ? null : (
          <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
            <Button
              variant='contained'
              size='medium'
              color='primary'
              disabled={loading}
              style={{ color: 'white', width: '100%' }}
              onClick={
                selectedReportType?.id === 5
                  ? handlePreview
                  : () => {
                    setSelectedERP([]);
                    handleFilter();
                  }
              }
            >
              {selectedReportType?.id === 5 ? 'Preview' : 'Filter'}
            </Button>
          </Grid>
        )}
        {selectedReportType?.id !== 5 && selectedReportType?.id !== 11 && (
          <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
            <Button
              variant='contained'
              size='medium'
              color='primary'
              style={{ color: 'white', width: '100%' }}
              onClick={handleDownload}
            >
              Download Report
            </Button>
          </Grid>
        )}
        {selectedReportType?.id === 5 &&
          filterData.branch &&
          filterData.grade &&
          filterData.section &&
          isLoading && (
            <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
              <Box style={{ display: 'flex', justifyContent: 'space-around' }}>
                <CircularProgress size={26} thickness={4} />
                <Typography color='secondary'>Fetching Details</Typography>
              </Box>
            </Grid>
          )}
      </Grid>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  fetchAssessmentReportList: (reportType, params) =>
    dispatch(fetchAssessmentReportList(reportType, params)),
});

export default connect(null, mapDispatchToProps)(AssessmentReportFilters);
