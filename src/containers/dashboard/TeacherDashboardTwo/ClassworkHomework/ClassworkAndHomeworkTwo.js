import React, { useState, useEffect, useContext } from 'react';
import {
  Paper,
  Grid,
  Typography,
  makeStyles,
  TableCell,
  TableBody,
  TableContainer,
  TableRow,
  TableHead,
  Table,
  TextField,
  IconButton,
} from '@material-ui/core';
import Layout from 'containers/Layout';
import Loader from '../../../../components/loader/loader';
import moment from 'moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import axios from 'axios';
import endpoints from 'config/endpoints';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import axiosInstance from '../../../../config/axios';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import DateRangeIcon from '@material-ui/icons/DateRange';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
import './date-picker-style.scss';
import { useHistory } from 'react-router-dom';
import NoFilterData from 'components/noFilteredData/noFilterData';
import Pagination from 'components/PaginationComponent';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

const ClassworkAndHomeworkTwo = ({ props }) => {
  const history = useHistory();
  const databranch = history?.location?.state?.data?.branch_id;
  const acadSessionId = history?.location?.state?.data?.acad_session_id;
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [homework, setHomework] = useState(true);
  const { setAlert } = useContext(AlertNotificationContext);

  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [selectedGradeIds, setSelectedGradeIds] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [sectionId, setSectionId] = useState('');

  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [subjectId, setSubjectId] = useState();
  const [selectedSectionIds, setSelectedSectionIds] = useState([]);
  const [periodDate, setPeriodDate] = useState();
  const [rowGrade, setRowGrade] = useState();
  const [rowSection, setRowSection] = useState();
  const [rowSubject, setRowSubject] = useState();

  const [classworkData, setClassworkData] = useState([]);

  const [dateRangeTechPer, setDateRangeTechPer] = useState([]);

  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const limit = 10;

  const [totalGradeSecSub, setTotalGradeSecSub] = useState(0);
  const [gradePageNumber, setGradePageNumber] = useState(1);

  const [totalCwRecord, setTotalCwRecord] = useState(0);
  const [cwPageNumber, setCwPageNumber] = useState(1);
  const [moduleId, setModuleId] = useState('');

  let date = moment().format('YYYY-MM-DD');

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [gradeSectionList, setGradeSectionList] = useState([]);
  const [indvalue, setIndvalue] = useState(0);

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

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
  }, [window.location.pathname]);

  const gradeSectionSubjectList = () => {
    const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
    setLoading(true);

    let urlGrade = `?acad_session=${acadSessionId}&page_size=${limit}&page_number=${gradePageNumber}`;
    if (selectedGradeIds) {
      urlGrade += `&grade_id=${selectedGradeIds}`;
    }
    if (subjectId) {
      urlGrade += `&subject_id=${subjectId}`;
    }
    if (selectedSectionIds) {
      urlGrade += `&section_id=${selectedSectionIds}`;
    }

    axios
      .get(`${endpoints.teacherDashboard.gradeSectionSubject}${urlGrade}`, {
        headers: {
          'X-DTS-HOST': window.location.host,
          // 'X-DTS-HOST': 'qa.olvorchidnaigaon.letseduvate.com',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          let gradeSecSub = result?.data?.result;
          setGradeSectionList(gradeSecSub);
          setTotalGradeSecSub(result?.data?.total_count_of_data);
          setRowGrade(gradeSecSub[0]?.section_mapping__grade__id);
          setRowSection(gradeSecSub[0]?.section_mapping__section__id);
          setRowSubject(gradeSecSub[0]?.subjects__id);
          setPageNumber(1);
          setCwPageNumber(1);
          setIndvalue(0);
          homeWorkList(
            gradeSecSub[0]?.section_mapping__grade__id,
            gradeSecSub[0]?.subjects__id,
            gradeSecSub[0]?.section_mapping__section__id,
            startDate,
            endDate
          );

          classWorkList(
            gradeSecSub[0]?.section_mapping__grade__id,
            gradeSecSub[0]?.subjects__id,
            gradeSecSub[0]?.section_mapping__section__id,
            startDate,
            endDate
          );
        } else {
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    gradeSectionSubjectList();
  }, [
    selectedGradeIds,
    subjectId,
    selectedSectionIds,
    sectionList,
    gradePageNumber,
    startDate,
    endDate,
  ]);

  const handleBranch = () => {
    setGradeList([]);
    setSelectedSection([]);
    setSelectedSubject([]);
    callApi(
      `${endpoints.academics.grades
      }?session_year=${sessionYearIDDDD}&branch_id=${databranch}&module_id=${moduleId}`,
      'gradeList'
    );
  };

  const handleGrade = (event = {}, value = []) => {
    if (value) {
      setSectionList([]);
      setSelectedSectionIds([]);
      setSubjectList([]);
      setSubjectId();
      setSelectedSubject([]);
      setSelectedGradeIds([]);
      setGradePageNumber(1);
      // const ids = value;
      const selectedId = value?.grade_id;
      setSelectedGrade(value);
      setSelectedGradeIds(selectedId);
      callApi(
        `${endpoints.academics.sections
        }?session_year=${sessionYearIDDDD}&branch_id=${databranch}&grade_id=${selectedId?.toString()}&module_id=${moduleId}`,
        'section'
      );
    } else {
      setSectionList([]);
      setSelectedSection([]);
      setSubjectList([]);
      setSelectedSubject([]);
      setSelectedGradeIds([]);
      setSubjectId();
      setSelectedSectionIds([]);
    }
  };

  const handleSection = (event = {}, value = []) => {
    // setSectionList([])
    // setSubjectId()
    if (value) {
      setSubjectList([]);
      setSelectedSubject([]);
      setSelectedSectionIds([]);
      setSubjectId();
      setGradePageNumber(1);
      setSelectedSection([]);
      const selectedsecctionId = value?.section_id;
      const sectionid = value?.id;
      setSectionId(sectionid);
      setSelectedSection(value);
      setSelectedSectionIds(selectedsecctionId);
      callApi(
        `${endpoints.academics.subjects
        }?session_year=${sessionYearIDDDD}&branch=${databranch}&grade=${selectedGradeIds?.toString()}&section=${selectedsecctionId.toString()}&module_id=${moduleId}`,
        'subject'
      );
    } else {
      setSubjectList([]);
      setSelectedSubject([]);
      setSelectedSectionIds([]);
      setSubjectId();
      setSelectedSection([]);
    }
  };

  const handleSubject = (event = {}, value = []) => {
    setSelectedSubject(value);
    setSubjectId(value?.subject__id);
    setGradePageNumber(1);
    // pendingInfo();
    // pendingDetails(sectionId, value?.subject__id, periodDate);
  };

  function callApi(api, key) {
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'gradeList') {
            setGradeList(result.data.data || []);
          }
          if (key === 'section') {
            setSectionList(result.data.data);
          }
          if (key === 'subject') {
            setSubjectList(result.data.data);
          }
        } else {
          console.log('error', result.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const { id } = JSON.parse(sessionStorage.getItem('acad_session')) || {};
  const sessionYearIDDDD = id;

  const homeWorkList = (
    grade,
    subject,
    section,
    hwstartdate = date,
    hwEndDate = date
  ) => {
    setLoading(true);
    const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};

    let url = `?acad_session=${acadSessionId}&branch_id=${databranch}&grade_id=${grade}&section_id=${section}&subject_id=${subject}&start_date=${hwstartdate}&end_date=${hwEndDate}&page_size=${limit}&page_number=${pageNumber}`;

    axios
      .get(`${endpoints.teacherDashboard.cwHWTeacherDashboard}${url}`, {
        headers: {
          'X-DTS-HOST': window.location.host,
          // 'X-DTS-HOST': 'qa.olvorchidnaigaon.letseduvate.com',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setTableData(result?.data?.result);
          setTotalRecords(result?.data?.total_count_of_data);
          // setTotalRecords(result?.data?.page_count)
          setAlert('success', result?.data?.message);
        } else {
          setAlert('error', result?.data?.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (moduleId) {
      handleBranch();
    }
  }, [moduleId]);

  const handleClick = (item, i) => {
    setIndvalue(i);
    setPageNumber(1);
    setCwPageNumber(1);
    setRowGrade(item?.section_mapping__grade__id);
    setRowSection(item?.section_mapping__section__id);
    setRowSubject(item?.subjects__id);
  };

  useEffect(() => {
    if (rowGrade && rowSubject && rowSection && homework) {
      homeWorkList(rowGrade, rowSubject, rowSection, startDate, endDate);
    }
  }, [pageNumber, rowSubject, rowSection, rowGrade, homework]);

  useEffect(() => {
    if (rowGrade && rowSubject && rowSection && !homework) {
      classWorkList(rowGrade, rowSubject, rowSection, startDate, endDate);
    }
  }, [cwPageNumber, rowSubject, rowSection, rowGrade, homework]);

  const handleDateChange = (newValue) => {
    setIndvalue(0);
    setDateRangeTechPer(newValue);
    setStartDate(moment(newValue[0]).format('YYYY-MM-DD'));
    setEndDate(moment(newValue[1]).format('YYYY-MM-DD'));
  };

  const homeworkfileopener = (data) => {
    console.log('debughomework', data);
    // setIsWorkDetail(true);
    // sethwcwdetails(data);
    history.push({
      pathname: './slide3',
      state: {
        detail: data,
        hwcwstatus: homework,
        databranch: databranch,
        selectedGradeIds1: selectedGradeIds,
        selectedSectionIds1: selectedSectionIds,
        subjectId1: subjectId,
        startDate1: startDate,
        endDate1: endDate,
        selectedGradevalue: selectedGrade,
        selectedSectionvalue: selectedSection,
        selectedSubjectvalue: selectedSubject,
      },
    });
  };

  const classworkfileopener = (item) => {
    history.push({
      pathname: './slide3',
      state: {
        detail: classworkData[0],
        hwcwstatus: homework,
        databranch: databranch,
        selectedGradeIds1: selectedGradeIds,
        selectedSectionIds1: selectedSectionIds,
        subjectId1: subjectId,
        startDate1: startDate,
        endDate1: endDate,
        selectedGradevalue: selectedGrade,
        selectedSectionvalue: selectedSection,
        selectedSubjectvalue: selectedSubject,
      },
    });
  };

  const classWorkList = (
    grade,
    subject,
    section,
    cwstartdate = date,
    cwEndDate = date
  ) => {
    setLoading(true);
    const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};

    axios
      .get(
        `${endpoints.teacherDashboard.classWorkTeacherDash}?acad_session_id=${acadSessionId}&grade_id=${grade}&section_id=${section}&subject_id=${subject}&start_date=${cwstartdate}&end_date=${cwEndDate}&page_size=${limit}&page_number=${cwPageNumber}`, //&start_date=2021-02-28&subject_id=9
        {
          headers: {
            'X-DTS-HOST': window.location.host,
            // 'X-DTS-HOST': 'qa.olvorchidnaigaon.letseduvate.com',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setClassworkData(result?.data?.result);
          setAlert('success', result?.data?.message);
          setTotalCwRecord(result?.data?.result?.total_count);
        } else {
          setAlert('error', result?.data?.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setLoading(false);
      });
  };
  // useEffect(() => endDate && gradeSectionSubjectList(), [startDate, endDate]);

  return (
    <Layout>
      {loading && <Loader />}
      <CommonBreadcrumbs
        componentName='Dashboard'
        childComponentName='Homework And Classwork'
      />
      <KeyboardBackspaceIcon
        style={{ cursor: 'pointer', marginLeft: 40 }}
        onClick={() => history.push({
          pathname: `/dashboard`,
          counter: 2,
        })}
      />
      <Grid
        xs={12}
        container
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        style={{ padding: 15 }}
      >
        <Grid container item direction='row' xs={12} md={6} spacing={2}>
          <Grid item xs={12} md={3} spacing={2}>
            <Autocomplete
              id='combo-box-demo'
              size='small'
              options={gradeList}
              onChange={handleGrade}
              getOptionLabel={(option) => option?.grade_name}
              // style={{ marginRight: 15 }}
              renderInput={(params) => (
                <TextField {...params} label='Grade' variant='outlined' />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3} spacing={2}>
            <Autocomplete
              id='combo-box-demo'
              size='small'
              options={sectionList}
              onChange={handleSection}
              value={selectedSection}
              getOptionLabel={(option) => option?.section__section_name}
              // style={{ marginRight: 15 }}
              renderInput={(params) => (
                <TextField {...params} label='Section' variant='outlined' />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3} spacing={2}>
            <Autocomplete
              id='combo-box-demo'
              size='small'
              options={subjectList}
              onChange={handleSubject}
              value={selectedSubject}
              getOptionLabel={(option) => option.subject__subject_name}
              renderInput={(params) => (
                <TextField {...params} label='Subject' variant='outlined' />
              )}
            />
          </Grid>
        </Grid>
        <div style={{ marginTop: window.innerWidth < 768 ? '15px' : '' }}>
          <LocalizationProvider dateAdapter={MomentUtils}>
            <DateRangePicker

              startText='Select-date-range'
              value={dateRangeTechPer}
              onChange={(newValue) => {
                handleDateChange(newValue);
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
                        )} - ${moment(endProps.inputProps.value).format('MM/DD/YYYY')}`,
                        readOnly: true,
                        endAdornment: (
                          <IconButton>
                            <DateRangeIcon style={{ width: '35px' }} color='primary' />
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
        </div>
      </Grid>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Grid
          container
          direction='row'
          xs={12}
          sm={8}
          md={4}
          style={{
            textAlign: 'center',
            marginLeft: 15,
            border: '1px solid #4093D4',
          }}
        >
          <Grid
            onClick={() => {
              setHomework(true);
              // setIndvalue(0)
              setPageNumber(1);
            }}
            xs={6}
            style={{
              background: homework ? '#4093D4' : 'white',
              color: homework ? 'white' : 'black',
              padding: '10px 0',
              cursor: 'pointer',
            }}
          >
            <b>Homework</b>
          </Grid>
          <Grid
            xs={6}
            onClick={() => {
              setHomework(false);
              // setIndvalue(0)
              setCwPageNumber(1);
            }}
            style={{
              background: homework ? 'white' : '#4093D4',
              color: homework ? 'black' : 'white',
              padding: '10px 0',
              cursor: 'pointer',
            }}
          >
            <b>Classwork</b>
          </Grid>
        </Grid>
        <Grid
          xs={12}
          sm={4}
          container
          direction='row'
          justifyContent='flex-end'
          style={{ marginRight: '15px' }}
        >
          <span style={{ color: '#074597' }}>Date Range Selected</span> :{' '}
          <span style={{ textAlign: 'right' }}>
            {endDate
              ? `${moment(startDate).format('MM/DD/YYYY')} to ${moment(endDate).format(
                'MM/DD/YYYY'
              )}`
              : `${moment(date).format('MM/DD/YYYY')}`}
          </span>
        </Grid>
      </div>
      <div style={{ overflowX: 'scroll', marginTop: 15 }}>
        <div style={{ minWidth: 768, backgroundColor: 'rgb(235, 242, 254)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              background: '#EBF2FE',
              padding: '20px',
              margin: '0 15px',
            }}
          >
            <div style={{ flex: homework ? 2 : 5, textAlign: 'center' }}>
              <b>Grade & Subject</b>
            </div>
            <div style={{ flex: homework ? 1 : 4, textAlign: 'center' }}>
              <b>Date</b>
            </div>
            <div
              style={{ flex: homework ? 1 : 4, textAlign: 'center', color: '#4DC41B' }}
            >
              <b>Total Submitted</b>
            </div>
            <div
              style={{ flex: homework ? 1 : 4, textAlign: 'center', color: '#F2A127' }}
            >
              <b>Total Pending</b>
            </div>
            {homework && (
              <div style={{ flex: 1, textAlign: 'center', color: '#3A90E6' }}>
                <b>Total Evaluated</b>
              </div>
            )}
            {homework && (
              <div style={{ flex: 1, textAlign: 'center' }}>
                <b>Title</b>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', margin: '0 15px' }}>
            <div style={{ width: '30%' }}>
              {gradeSectionList.map((item, i) => (
                <div>
                  <div
                    onClick={() => {
                      handleClick(item, i);
                    }}
                    style={{
                      textAlign: 'center',
                      padding: '20px 0',
                      borderBottom: '1px solid transparent',
                      background: indvalue == i ? 'white' : '#EBF2FE',
                      borderLeft: indvalue == i ? '8px solid #4093D4' : '',
                      cursor: 'pointer',
                    }}
                  >
                    <b>{item.section_mapping__grade__grade_name}</b>
                    {'\u00A0'}-{'\u00A0'}
                    {item.section_mapping__section__section_name} {'\u00A0'}
                    {'\u00A0'}
                    {'\u00A0'}
                    {item.subjects__subject_name}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                width: '70%',
                border: '1px solid #D7E0E7',
                borderLeft: '1px solid transparent',
                background: 'white',
              }}
            >
              <div>
                {(homework && tableData?.length === 0) ||
                  (!homework && classworkData?.classwork_details?.length === 0) ? (
                  <div style={{ marginTop: '10%', marginBottom: '10%' }}>
                    <NoFilterData data='No Data Found' />
                  </div>
                ) : (
                  <>
                    {homework &&
                      tableData.map((item) => (
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              padding: '20px 16px 20px 0',
                              borderBottom: '1px solid #D7E0E7',
                              cursor: 'pointer',
                            }}
                            onClick={() => homeworkfileopener(item)}
                          >
                            <div style={{ flex: 1, textAlign: 'center' }}>
                              {item.uploaded_at__date}
                            </div>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                              {item.total_submitted}
                            </div>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                              {item.total_pending}
                            </div>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                              {item.total_evaluated}
                            </div>
                            <div
                              style={{
                                flex: 1,
                                textAlign: 'center',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.title}
                            </div>
                          </div>
                        </div>
                      ))}
                    {!homework &&
                      classworkData?.classwork_details?.map((item) => (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '20px 0',
                            borderBottom: '1px solid #D7E0E7',
                            cursor: 'pointer',
                          }}
                          onClick={() => classworkfileopener(item)}
                        >
                          <div style={{ flex: 1, textAlign: 'center' }}>{item.date}</div>
                          <div style={{ flex: 1, textAlign: 'center' }}>
                            {item.submitted_count}
                          </div>
                          <div style={{ flex: 1, textAlign: 'center' }}>
                            {item.total_students - item.submitted_count}
                          </div>
                        </div>
                      ))}
                  </>
                )}
              </div>
              {homework && tableData?.length > 0 && (
                <Grid container justify='center'>
                  {totalRecords > 10 && (
                    <Pagination
                      totalPages={Math.ceil(totalRecords / limit)}
                      currentPage={pageNumber}
                      setCurrentPage={setPageNumber}
                    />
                  )}
                </Grid>
              )}
              {!homework && classworkData?.classwork_details?.length > 0 && (
                <Grid container justify='center'>
                  {totalCwRecord > 10 && (
                    <Pagination
                      totalPages={Math.ceil(totalCwRecord / limit)}
                      currentPage={cwPageNumber}
                      setCurrentPage={setCwPageNumber}
                    />
                  )}
                </Grid>
              )}
            </div>
          </div>
        </div>
        <Grid container justify='center'>
          {totalGradeSecSub > 10 && (
            <Pagination
              totalPages={Math.ceil(totalGradeSecSub / limit)}
              currentPage={gradePageNumber}
              setCurrentPage={setGradePageNumber}
            />
          )}
        </Grid>
      </div>
    </Layout>
  );
};

export default ClassworkAndHomeworkTwo;
