import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {
  Grid,
  TextField,
  Button,
  SvgIcon,
  Icon,
  Slide,
  useTheme,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import axiosInstance from '../../../config/axios';
import MobileDatepicker from '../student-homework/student-homework-mobile-datepicker';
import '../student-homework/student-homework.css';
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
    width: '100%',
    marginLeft: '5px',
    marginTop: '5px',
    [theme.breakpoints.down('xs')]: {
      width: '87vw',
      margin: 'auto',
    },
  },
  container: {
    maxHeight: 440,
  },
  table: {
    width: '98%',
    marginLeft: '3px',
    marginTop: '85px',
  },
}));

const StudentHomeWorkReport = () => {
  const classes = useStyles();
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const { setAlert } = useContext(AlertNotificationContext);
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [messageRows, setMessageRows] = useState({ header: [], data: [] });

  const [studentHomeworkData, setStudentHomeworkData] = useState({
    header: [],
    data: [],
  });
  const [homeworkSubmission, setHomeworkSubmission] = useState({
    isOpen: false,
    subjectId: '',
    date: '',
    subjectName: '',
    status: 1,
  });
  const [endDate, setEndDate] = useState(getDaysAfter(moment(), 6));
  const [moduleId, setModuleId] = useState();
  const [selectedOtherLanguages, setSelectedOtherLanguages] = useState();
  const [tableDisplay, setTableDisplay] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [optionalSubjects, setOptionalSubjects] = useState([]);
  const [mendaterySubjects, setMendaterySubjects] = useState([]);
  const [selectedOtherSubjects, setSelectedOtherSubjects] = useState();
  const [selectSub, setSelectSub] = useState('');
  const [otherSubjects, setOtherSubjects] = useState([]);
  const [reportHeaderData, setReportHeaderData] = useState([]);
  useEffect(() => {
    callApiReportData();
  }, [startDate, endDate, moduleId]);
  const handleStartDateChange = (date) => {
    const endDate = getDaysAfter(date.clone(), 6);
    setEndDate(endDate);
    setStartDate(date.format('YYYY-MM-DD'));
    // getTeacherHomeworkDetails(2, date, endDate);
  };

  const handleEndDateChange = (date) => {
    const startDate = getDaysBefore(date.clone(), 6);
    setStartDate(startDate);
    setEndDate(date.format('YYYY-MM-DD'));
    // getTeacherHomeworkDetails(2, startDate, date);
  };
  function getDaysAfter(date, amount) {
    return date ? date.add(amount, 'days').format('YYYY-MM-DD') : undefined;
  }
  function getDaysBefore(date, amount) {
    return date ? date.subtract(amount, 'days').format('YYYY-MM-DD') : undefined;
  }
  const handleTableData = () => {
    const tempHeader = [{ subject_slag: 'date' }];
    const temprows = [];
    if (Object.keys(studentHomeworkData.header).length) {
      studentHomeworkData.header.mandatory_subjects.forEach((items) => {
        tempHeader.push({ ...items, isOptional: false, isOthers: false });
      });
      if (!selectedOtherLanguages) {
        setSelectedOtherLanguages({
          ...studentHomeworkData.header.optional_subjects[0],
          isOptional: true,
          isOthers: false,
          isFirst: true,
        });
        tempHeader.push({
          ...studentHomeworkData.header.optional_subjects[0],
          isOptional: true,
          isFirst: true,
        });
      } else {
        tempHeader.push(selectedOtherLanguages);
      }

      if (!selectedOtherSubjects) {
        setSelectedOtherSubjects({
          ...studentHomeworkData.header.others_subjects[0],
          isOptional: false,
          isOthers: true,
          isFirstOther: true,
        });
        tempHeader.push({
          ...studentHomeworkData.header.others_subjects[0],
          isOptional: false,
          isOthers: true,
          isFirstOther: true,
        });
      } else {
        tempHeader.push(selectedOtherSubjects);
      }
    }

    // studentHomeworkData.data.forEach((items) => {
    //   const tempobj = { date: items.class_date };
    //   if (items.hw_details.length) {
    //     tempHeader.forEach((header) => {
    //       if (header.subject_slag !== 'date') {
    //         items.hw_details.forEach((subjects) => {
    //           if (subjects.subject === header.id)
    //             tempobj[header.subject_slag] = {
    //               homeworkId: subjects.id,
    //               isHomework: true,
    //               isSubmited: subjects.hw_status.is_submitted,
    //               isEvaluted: subjects.hw_status.is_evaluated,
    //               isOpened: subjects.hw_status.is_opened,
    //             };
    //         });
    //         if (!tempobj[header.subject_slag]) {
    //           tempobj[header.subject_slag] = { isHomework: false };
    //         }
    //       }
    //     });
    //   } else {
    //     tempHeader.forEach((header) => {
    //       if (header.subject_slag !== 'date')
    //         tempobj[header.subject_slag] = { isHomework: false };
    //     });
    //   }
    //   temprows.push(tempobj);
    // });
    setMessageRows({ header: tempHeader, data: temprows });
  };
  useEffect(() => {
    if (studentHomeworkData?.data?.length) {
      handleTableData();
    }
  }, [studentHomeworkData]);

  useEffect(() => {
    if (selectedOtherLanguages && !selectedOtherLanguages.isFirst) {
      handleTableData();
    }
  }, [selectedOtherLanguages]);
  useEffect(() => {
    if (selectedOtherSubjects && !selectedOtherSubjects.isFirstOther) {
      handleTableData();
    }
  }, [selectedOtherSubjects]);
  const handleOtherLanguage = (event, value) => {
    setSelectSub(event.target.value);
    if (value) {
      setSelectedOtherLanguages({
        ...value,
        isOptional: true,
        isOthers: false,
        isFirst: false,
      });
    } else {
      setSelectedOtherLanguages();
    }
  };

  const handleOtherSubject = (event, value) => {
    if (value) {
      setSelectedOtherSubjects({
        ...value,
        isOptional: false,
        isOthers: true,
        isFirstOther: false,
      });
    } else {
      setSelectedOtherSubjects();
    }
  };

  //   const handleCellClick = (row, index) => {
  //     if (isSelectedCell.row === row && isSelectedCell.index === index) {
  //       setIsSelectedCell({ row: '', index: '' });
  //       return;
  //     }
  //     setIsSelectedCell({ row, index });
  //   };

  //   const handleOpenHomework = (id, classDate, subjectName, status) => {
  //     setHomeworkSubmission({
  //       isOpen: true,
  //       homeworkId: id,
  //       date: classDate,
  //       subjectName,
  //       status,
  //     });
  //   };

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Homework' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Student Homework') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);
  //   const callApiReportData = async () => {
  //     try {
  //       const result = await axiosInstance.get(
  //         `/academic/student-homework-count/?module_id=${moduleId}&start_date=${startDate}&end_date=${endDate}`
  //       );
  //       if (result.data.status_code === 200) {
  //         //   setStudentHomeworkData(result.data.data);
  //         //   setMendaterySubjects(result.data.data.header.mandatory_subjects);
  //         //   setOptionalSubjects(result.data.data.header.optional_subjects);
  //         //   setOtherSubjects(result.data.data.header.others_subjects);
  //       } else {
  //         setAlert('error', result.data.message);
  //       }
  //     } catch (error) {
  //       setAlert('error', error.message);
  //     }
  //   };
  const callApiReportData = () => {
    axiosInstance
      .get(
        `/academic/student-homework-count/?module_id=${moduleId}&start_date=${startDate}&end_date=${endDate}`
      )
      .then((res) => {
        console.log(res, 'student-homework');
        if (res.data.data[0].hw_given) {
          setReportData(res?.data?.data);
          setReportHeaderData(res?.data?.header);
          setTableDisplay(true);
          setStudentHomeworkData(res?.data);
          setMendaterySubjects(res.data.header?.mandatory_subjects);
          setOptionalSubjects(res.data.header.optional_subjects);
          setOtherSubjects(res.data.header.others_subjects);
          handleChangeDataFormat();
        } else {
          setTableDisplay(false);
        }
      })
      .catch((error) => {
        if (error.message === "Cannot read property 'hw_given' of undefined") {
          setAlert('error', 'No data present');
        } else {
          setAlert('error', error.message);
        }
      });
  };
  const handleChangeDataFormat = () => {};
  return (
    <div>
      <Layout className='layout-container'>
        <div
          className='message_log_breadcrumb_wrapper'
          style={{ backgroundColor: '#F9F9F9' }}
        >
          <CommonBreadcrumbs componentName='Homework Report' />
        </div>
        <div className='create_group_filter_container'>
          <Grid container spacing={5} className='message_log_container'>
            <div className='mobile-date-picker'>
              <MobileDatepicker
                onChange={(date) => handleEndDateChange(date)}
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
              />
            </div>
          </Grid>
        </div>
        <div className={classes.table}>
          {' '}
          <Paper className={`homework_table_wrapper ${classes.root}`}>
            {tableDisplay ? (
              <>
                <TableContainer
                  className={`table table-shadow homework_table ${classes.container}`}
                >
                  <Table stickyHeader aria-label='sticky table'>
                    <TableHead className='view_groups_header tb-header'>
                      <TableRow>
                        <TableCell className='homework_header homework_header_dropdown_wrapper'>
                          Titles
                        </TableCell>
                        <TableCell>HomeWork given</TableCell>
                        <TableCell>Homework Submitted</TableCell>
                        <TableCell>Homework Evaluated</TableCell>
                        <TableCell>Homework Not submitted</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody className='table_body'>
                      {/* {reportData &&
                        reportData?.map((dataSubject, index) => (
                          <> */}

                      {reportData &&
                        reportData.map((data) => (
                          <TableRow>
                            <TableCell className='homework_header'>
                              {data?.subject_name}
                            </TableCell>
                            <TableCell align='middle'>{data?.hw_given}</TableCell>
                            <TableCell align='middle'>{data?.hw_submitted}</TableCell>
                            <TableCell align='middle'>{data?.hw_evaluated}</TableCell>
                            <TableCell align='middle'>{data?.not_submitted}</TableCell>
                          </TableRow>
                        ))}

                      {/* <TableRow>
                              {reportData &&
                                reportData.map((data) => (
                                  <TableCell align='middle'>
                                    {data?.hw_submitted}
                                  </TableCell>
                                ))} */}

                      {/* <TableCell /> */}
                      {/* </TableRow>
                            <TableRow>
                              {reportData &&
                                reportData.map((data) => (
                                  <TableCell align='middle'>
                                    {data?.hw_evaluated}
                                  </TableCell>
                                ))}

                              
                            </TableRow>
                            <TableRow>
                              {reportData &&
                                reportData.map((data) => (
                                  <TableCell align='middle'>
                                    {data?.not_submitted}
                                  </TableCell>
                                ))}

                             
                            </TableRow> */}
                      {/* </>
                        ))} */}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <></>
            )}
          </Paper>
        </div>
      </Layout>
    </div>
  );
};

export default StudentHomeWorkReport;
