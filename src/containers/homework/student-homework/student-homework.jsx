/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Grid, TextField, Button, SvgIcon, Icon, Slide, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import MomentUtils from '@date-io/moment';
import moment from 'moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Loading from '../../../components/loader/loader';
import hwGiven from '../../../assets/images/hw-given.svg';
import studentHomeworkEvaluted from '../../../assets/images/student-hw-evaluated.svg';
import hwFileUnopened from '../../../assets/images/hw-file-unopened.svg';
import hwFileOpened from '../../../assets/images/Group-8243.svg';
import hwFileNotSubmitted from '../../../assets/images/cross.svg';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import HomeworkTimeline from './components/homework-timeline';
import TopPerformerCard from './components/top-performer-card/top-performer-card';
import HomeworkSubmission from './components/homework-submission/homework-submission';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import Layout from '../../Layout';
import './student-homework.css';
import StudenthomeworkMobileScreen from './student-homework-mobile-screen';
import MobileIconScreen from './student-homework-mobileScreen-Icon';
import MobileDatepicker from './student-homework-mobile-datepicker';

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
}));

const StudentHomework = withRouter(({ history, ...props }) => {
  const classes = useStyles();
  const themeContext = useTheme();
  const isMobileRender = useMediaQuery(themeContext.breakpoints.down('sm'));

  const { setAlert } = useContext(AlertNotificationContext);
  const [isHidden, setIsHidden] = useState(window.innerWidth < 600);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [messageRows, setMessageRows] = useState({ header: [], rows: [] });
  const [studentHomeworkData, setStudentHomeworkData] = useState({
    header: [],
    rows: [],
  });
  const [isSelectedCell, setIsSelectedCell] = useState({ row: '', index: '' });
  const [branchList, setBranchList] = useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [homeworkSubmission, setHomeworkSubmission] = useState({
    isOpen: false,
    subjectId: '',
    date: '',
    subjectName: '',
    status: 1,
  });
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(getDaysAfter(moment(), 6));
  const [selectedOtherLanguages, setSelectedOtherLanguages] = useState();
  const [selectedOtherSubjects, setSelectedOtherSubjects] = useState();
  const [optionalSubjects, setOptionalSubjects] = useState([]);
  const [mendaterySubjects, setMendaterySubjects] = useState([]);
  const [otherSubjects, setOtherSubjects] = useState([]);
  const [moduleId, setModuleId] = useState();
  const [modulePermision, setModulePermision] = useState(true);
  const [homeworkTimelineDisplay, setHomeworkTimelineDisplay] = useState(true)


  //   header: ['date', 'english', 'history', 'math', 'other', 'science'],
  //   rows: [
  // 	{
  // 	  id: 0,
  // 	  date: '11-10-20',
  // 	  english: { isHomework: true, isSubmited: false },
  // 	  history: { isHomework: true, isSubmited: true },
  // 	  math: { isHomework: false },
  // 	  other: { isHomework: true, isSubmited: false },
  // 	  science: { isHomework: true, isSubmited: false },
  // 	},
  // 	{
  // 	  id: 1,
  // 	  date: '12-10-20',
  // 	  english: { isHomework: true, isSubmited: false },
  // 	  history: { isHomework: true, isSubmited: true },
  // 	  math: { isHomework: false },
  // 	  other: { isHomework: true, isSubmited: true },
  // 	  science: { isHomework: true, isSubmited: false },
  // 	},
  // 	{
  // 	  id: 2,
  // 	  date: '13-10-20',
  // 	  english: { isHomework: true, isSubmited: true },
  // 	  history: { isHomework: true, isSubmited: false },
  // 	  math: { isHomework: false },
  // 	  other: { isHomework: true, isSubmited: false },
  // 	  science: { isHomework: true, isSubmited: true },
  // 	},
  // 	{
  // 	  id: 3,
  // 	  date: '14-10-20',
  // 	  english: { isHomework: true, isSubmited: false },
  // 	  history: { isHomework: true, isSubmited: true },
  // 	  math: { isHomework: false },
  // 	  other: { isHomework: true, isSubmited: false },
  // 	  science: { isHomework: true, isSubmited: false },
  // 	},
  // 	{
  // 	  id: 4,
  // 	  date: '15-10-20',
  // 	  english: { isHomework: true, isSubmited: false },
  // 	  history: { isHomework: true, isSubmited: false },
  // 	  math: { isHomework: false },
  // 	  other: { isHomework: true, isSubmited: false },
  // 	  science: { isHomework: true, isSubmited: false },
  // 	},
  // 	{
  // 	  id: 5,
  // 	  date: '16-10-20',
  // 	  english: { isHomework: true, isSubmited: false },
  // 	  history: { isHomework: false },
  // 	  math: { isHomework: true, isSubmited: true },
  // 	  other: { isHomework: true, isSubmited: true },
  // 	  science: { isHomework: true, isSubmited: false },
  // 	},
  // 	{
  // 	  id: 6,
  // 	  date: '17-10-20',
  // 	  english: { isHomework: true, isSubmited: false },
  // 	  history: { isHomework: true, isSubmited: false },
  // 	  math: { isHomework: false },
  // 	  other: { isHomework: true, isSubmited: false },
  // 	  science: { isHomework: true, isSubmited: false },
  // 	},
  //   ],

  const getTableDetails = async () => {
    try {
      const result = await axiosInstance.get(
        `${endpoints.homeworkStudent.getStudentSubjects}?module_id=${moduleId}&start_date=${startDate}&end_date=${endDate}`
      );
      if (result.data.status_code === 200) {
        setStudentHomeworkData(result.data.data);
        setMendaterySubjects(result.data.data.header.mandatory_subjects);
        setOptionalSubjects(result.data.data.header.optional_subjects);
        setOtherSubjects(result.data.data.header.others_subjects);
      } else {
        setAlert('error', result.data.message);
      }
    } catch (error) {
      setAlert('error', error.message);
    }
  };

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

    studentHomeworkData.rows.forEach((items) => {
      const tempobj = { date: items.class_date };
      if (items.hw_details.length) {
        tempHeader.forEach((header) => {
          if (header.subject_slag !== 'date') {
            items.hw_details.forEach((subjects) => {
              if (subjects.subject === header.id)
                tempobj[header.subject_slag] = {
                  homeworkId: subjects.id,
                  isHomework: true,
                  isSubmited: subjects.hw_status.is_submitted,
                  isEvaluted: subjects.hw_status.is_evaluated,
                  isOpened: subjects.hw_status.is_opened,
                };
            });
            if (!tempobj[header.subject_slag]) {
              tempobj[header.subject_slag] = { isHomework: false };
            }
          }
        });
      } else {
        tempHeader.forEach((header) => {
          if (header.subject_slag !== 'date')
            tempobj[header.subject_slag] = { isHomework: false };
        });
      }
      temprows.push(tempobj);
      // console.log(temprows, "temprows")
    });
    setMessageRows({ header: tempHeader, rows: temprows });
  };

  const handleOtherLanguage = (event, value) => {
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

  const handleCellClick = (row, index) => {
    if (isSelectedCell.row === row && isSelectedCell.index === index) {
      setIsSelectedCell({ row: '', index: '' });
      return;
    }
    setIsSelectedCell({ row, index });
  };

  const handleOpenHomework = (id, classDate, subjectName, status) => {
    setHomeworkSubmission({
      isOpen: true,
      homeworkId: id,
      date: classDate,
      subjectName,
      status,
    });
  };

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

  // const handleFromDateChange = (event, value) => {
  //   setSelectedFromDate(value);
  // };

  // const handleToDateChange = (event, value) => {
  //   setSelectedToDate(value);
  // };

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

  useEffect(() => {
    if (moduleId) {
      getTableDetails();
    }
  }, [homeworkSubmission.isOpen, startDate, endDate, moduleId]);

  useEffect(() => {
    if (studentHomeworkData.rows.length) {
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


  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div className='message_log_wrapper' style={{backgroundColor: '#F9F9F9'}}>
          <div className='message_log_breadcrumb_wrapper' style={{backgroundColor: '#F9F9F9'}}>
            <CommonBreadcrumbs componentName='Homework' />
          </div>
          {!homeworkSubmission.isOpen &&
            <div className='create_group_filter_container'>
              <Grid container spacing={5} className='message_log_container'>
                {
                  <div className="mobile-date-picker">
                    <MobileDatepicker
                      onChange={(date) => handleEndDateChange(date)}
                      handleStartDateChange={handleStartDateChange}
                      handleEndDateChange={handleEndDateChange} />
                  </div>

                  // <MuiPickersUtilsProvider utils={MomentUtils} className='date_provider'>
                  //   <Grid item xs={12} sm={3}>
                  //     <KeyboardDatePicker
                  //       // clearable
                  //       // margin='normal'
                  //       id='date-picker-dialog'
                  //       label='Start Date'
                  //       className='message_log_date_piker'
                  //       format='YYYY-MM-DD'
                  //       value={startDate}
                  //       onChange={(date) => handleStartDateChange(date)}
                  //       // maxDate={new Date()}
                  //       KeyboardButtonProps={{
                  //         'aria-label': 'change date',
                  //       }}
                  //     />
                  //   </Grid>
                  //   <Grid item xs={12} sm={3}>

                  //     <KeyboardDatePicker
                  //       margin='normal'
                  //       id='date-picker-dialog'
                  //       label='End Date'
                  //       className='message_log_date_piker'
                  //       format='YYYY-MM-DD'
                  //       value={endDate}
                  //       onChange={(date) => handleEndDateChange(date)}
                  //       // maxDate={new Date()}
                  //       KeyboardButtonProps={{
                  //         'aria-label': 'change date',
                  //       }}
                  //     />


                  //   </Grid>
                  // </MuiPickersUtilsProvider>
                }
              </Grid>
            </div>
          }
          <div className='message_log_white_wrapper'>
            {
              isMobile ? <MobileIconScreen  isOpen={homeworkSubmission.isOpen} /> :

                !homeworkSubmission.isOpen &&
                <div className='homework_block_wrapper'>
                  <div className='homework_block icon-desc-container-desk' style={{fontSize: '16px', color: '#014b7e'}}>Weekly Time table </div>
                  <div className='icon-desc-container-desk'>
                    <SvgIcon
                      component={() => (
                        <img
                          style={{ width: '25px', marginRight: '5px' }}
                          src={hwGiven}
                          alt='given'
                        />
                      )}
                    />
                    <span style={{fontSize: '16px', color: '#014b7e'}}>HW Submitted</span>
                  </div>
                  <div className='icon-desc-container-desk'>
                    <SvgIcon
                      component={() => (
                        <img
                          style={{ width: '25px', marginRight: '5px' }}
                          src={hwFileOpened}
                          alt='evaluated'
                        />
                      )}
                    />
                    <span style={{fontSize: '16px', color: '#014b7e'}}>File Opened</span>
                  </div>
                  <div className='icon-desc-container-desk'>
                    <SvgIcon
                      component={() => (
                        <img
                          style={{ width: '25px', marginRight: '5px' }}
                          src={hwFileUnopened}
                          alt='submitted'
                        />
                      )}
                    />
                    <span style={{fontSize: '16px', color: '#014b7e'}}>File unopened</span>
                  </div>
                  <div className='icon-desc-container-desk'>
                    <SvgIcon
                      component={() => (
                        <img
                          style={{ width: '25px', marginRight: '5px' }}
                          src={studentHomeworkEvaluted}
                          alt='submitted'
                        />
                      )}
                    />
                    <span style={{fontSize: '16px', color: '#014b7e'}}>Evaluated</span>
                  </div>
                  <div className='icon-desc-container-desk'>
                    <SvgIcon
                      component={() => (
                        <img
                          style={{
                            width: '25px',
                            marginRight: '5px',
                          }}
                          src={hwFileNotSubmitted}
                          alt='homework not submitted'
                        />
                      )}
                    />
                    <span style={{fontSize: '16px', color: '#014b7e'}}>HW not submitted</span>
                  </div>
                </div>
            }


            {homeworkSubmission.isOpen ? (
              <HomeworkSubmission
                loading={loading}
                setLoading={setLoading}
                homeworkSubmission={homeworkSubmission}
                setHomeworkSubmission={setHomeworkSubmission}
              />
            ) : (
                <div className='create_group_filter_container for-mobile'>
                  {
                    isMobile ? <StudenthomeworkMobileScreen mobileScreenResponse={messageRows} handleOpenHomework={handleOpenHomework} 
                    studentHomeworkData={studentHomeworkData}
                    homeworkTimelineDisplay={homeworkTimelineDisplay}
                    setHomeworkTimelineDisplay={setHomeworkTimelineDisplay}
                    moduleId={moduleId}
                    mendaterySubjects={mendaterySubjects}
                    /> :
                      <Grid container className='homework_container' spacing={2}>
                        <Grid xs={12} lg={(studentHomeworkData.header?.is_top_performers || !homeworkTimelineDisplay) ? 9 : 12} item>
                          <Paper className={`homework_table_wrapper ${classes.root}`}>
                            <TableContainer
                              className={`table table-shadow homework_table ${classes.container}`}
                            >
                              <Table stickyHeader aria-label='sticky table'>
                                <TableHead className='view_groups_header tb-header'>
                                  <TableRow>
                                    {messageRows.header?.map((headers, i) =>
                                      headers.isOptional ? (
                                        <TableCell className='homework_header homework_header_dropdown_wrapper'>
                                          <span className='homework_student_header_count'>
                                            {optionalSubjects.length}
                                          </span>
                                          <Autocomplete
                                            size='small'
                                            onChange={handleOtherLanguage}
                                            value={selectedOtherLanguages}
                                            id='message_log-branch'
                                            className='homework_student_other_language'
                                            options={optionalSubjects}
                                            getOptionLabel={(option) => option?.subject_slag}
                                            filterSelectedOptions
                                            disableClearable
                                            contentEditable
                                            renderInput={(params) => (
                                              <TextField
                                                className='homework_student_other_language-textfield'
                                                {...params}
                                                placeholder='Languages'
                                              />
                                            )}
                                          />
                                        </TableCell>
                                      ) : headers.isOthers ? (
                                        <TableCell className='homework_header homework_header_dropdown_wrapper'>
                                          <span className='homework_student_header_count'>
                                            {otherSubjects.length}
                                          </span>
                                          <Autocomplete
                                          style={{color: '#FF6B6B'}}
                                            size='small'
                                            onChange={handleOtherSubject}
                                            value={selectedOtherSubjects}
                                            id='message_log-branch'
                                            className='homework_student_other_language'
                                            options={otherSubjects}
                                            getOptionLabel={(option) => option?.subject_slag}
                                            filterSelectedOptions
                                            disableClearable
                                            renderInput={(params) => (
                                              <TextField
                                                className='homework_student_other_language-textfield'
                                                {...params}
                                                placeholder='Others'
                                              />
                                            )}
                                          />
                                        </TableCell>
                                      ) : (
                                            <TableCell className='homework_header'>
                                              {headers.subject_slag}
                                            </TableCell>
                                          )
                                    )}
                                  </TableRow>
                                </TableHead>
                                <TableBody className='table_body'>
                                  {messageRows.rows.map((row, rowIndex) => (
                                    <TableRow
                                      // onClick={() => handleUserDetails(row.id)}
                                      key={`message_log_details${rowIndex}`}
                                    >
                                      {messageRows.header?.map((headers, i) =>
                                        headers.subject_slag === 'date' ? (
                                          <TableCell>
                                            <div className="table-date">
                                               <div className='day-icon'>
                                                        {moment(row.date).format('dddd').split('')[0]}
                                                    </div>
                                            <div className="date-web">{row.date}</div>
                                            </div></TableCell>
                                        ) : row[headers.subject_slag].isHomework ? (
                                          <TableCell
                                            align='middle'
                                            onClick={() => handleCellClick(rowIndex, i)}
                                            className={
                                              isSelectedCell.row === rowIndex &&
                                                isSelectedCell.index === i
                                                ? 'selected'
                                                : 'not_selected'
                                            }
                                          >
                                            {row[headers.subject_slag].isSubmited ? (
                                              <span
                                                onClick={() =>
                                                  handleOpenHomework(
                                                    row[headers.subject_slag].homeworkId,
                                                    row.date,
                                                    headers.subject_slag,
                                                    2
                                                  )
                                                }
                                              >
                                                <SvgIcon
                                                  component={() => (
                                                    <img
                                                      style={{
                                                        width: '35px',
                                                        height: '35px',
                                                        padding: '5px',
                                                        cursor: 'pointer',
                                                      }}
                                                      src={hwGiven}
                                                      alt='given'
                                                    />
                                                  )}
                                                />
                                              </span>
                                            ) : new Date(
                                              new Date().getFullYear(),
                                              new Date().getMonth(),
                                              new Date().getDate()
                                            ) >= new Date(row.date) ? (
                                                  <SvgIcon
                                                    component={() => (
                                                      <img
                                                        style={{
                                                          width: '35px',
                                                          height: '35px',
                                                          padding: '5px',
                                                        }}
                                                        src={hwFileNotSubmitted}
                                                        alt='homeworkunopened'
                                                      />
                                                    )}
                                                  />
                                                ) : null}
                                            {!row[headers.subject_slag].isSubmited ?
                                              <>
                                                {row[headers.subject_slag].isOpened ? (
                                                  <span
                                                    onClick={() =>
                                                      handleOpenHomework(
                                                        row[headers.subject_slag].homeworkId,
                                                        row.date,
                                                        headers.subject_slag,
                                                        1
                                                      )
                                                    }
                                                  >
                                                    <SvgIcon
                                                      component={() => (
                                                        <img
                                                          style={{
                                                            width: '35px',
                                                            height: '35px',
                                                            padding: '5px',
                                                            cursor: 'pointer',
                                                          }}
                                                          src={hwFileOpened}
                                                          alt='homeworkopened'
                                                        />
                                                      )}
                                                    />
                                                  </span>
                                                ) : (
                                                    <span
                                                      onClick={() =>
                                                        handleOpenHomework(
                                                          row[headers.subject_slag].homeworkId,
                                                          row.date,
                                                          headers.subject_slag,
                                                          1
                                                        )
                                                      }
                                                    >
                                                      <SvgIcon
                                                        component={() => (
                                                          <img
                                                            style={{
                                                              width: '35px',
                                                              height: '35px',
                                                              padding: '5px',
                                                              cursor: 'pointer',
                                                            }}
                                                            src={hwFileUnopened}
                                                            alt='homeworkunopened'
                                                          />
                                                        )}
                                                      />
                                                    </span>
                                                  )}
                                              </>
                                              : null}
                                            {
                                              row[headers.subject_slag].isEvaluted ? (
                                                <span
                                                  onClick={() =>
                                                    handleOpenHomework(
                                                      row[headers.subject_slag].homeworkId,
                                                      row.date,
                                                      headers.subject_slag,
                                                      3
                                                    )
                                                  }
                                                >
                                                  <SvgIcon
                                                    component={() => (
                                                      <img
                                                        style={{
                                                          width: '35px',
                                                          height: '35px',
                                                          padding: '5px',
                                                          cursor: 'pointer',
                                                        }}
                                                        src={studentHomeworkEvaluted}
                                                        alt='homeworkEvaluted'
                                                      />
                                                    )}
                                                  />
                                                </span>
                                              ) : null}
                                          </TableCell>
                                        ) : (
                                              <TableCell />
                                            )
                                      )}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Paper>
                        </Grid>
                        <Grid xs={12} lg={3} item>
                          <Grid className='homework_right_wrapper' container>
                            <Grid lg={12} className='homework_right_wrapper_items' item>
                              {(studentHomeworkData.header?.is_hw_ration && homeworkTimelineDisplay) &&
                                <HomeworkTimeline setHomeworkTimelineDisplay={setHomeworkTimelineDisplay}
                                  moduleId={moduleId} />
                              }
                            </Grid>
                            <Grid lg={12} className='homework_right_wrapper_items' item>
                              {studentHomeworkData.header?.is_top_performers &&
                                <TopPerformerCard subjects={mendaterySubjects} />
                              }
                            </Grid>
                          </Grid>
                        </Grid>

                      </Grid>
                  }
                </div>
              )}
          </div>
        </div>
      </Layout>
    </>
  );
});

export default StudentHomework;
