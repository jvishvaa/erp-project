import React, { useEffect, useState, useContext } from 'react';
import {
  makeStyles,
  Grid,
  Box,
  Paper,
  SwipeableDrawer,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
  SvgIcon,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './academicStyles.scss';
import AddTopic from './addTopic';
import { withRouter } from 'react-router-dom';
import Layout from '../../Layout';
import { useParams } from 'react-router-dom';
import './editPeriod.scss';
import CreateHomeWorkDialog from '../dialogs/createHomeWorkDialog';
import CreateClassWorkDialog from '../dialogs/createClassWorkDialog';
import CreateDiary from '../dialogs/createDiary';
import Card from './card';
import LessonPlanTabs from './lessonPlanTabs';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import { AlertNotificationContext } from '../../.././context-api/alert-context/alert-state';
import EditDiaryDialog from '../dialogs/editDiaryDialog';
import CheckIcon from '@material-ui/icons/Check';
import CardMedia from '@material-ui/core/CardMedia';
import WhiteClock from '../../../assets/images/whiteClock.png';
import Countdown, { zeroPad } from 'react-countdown';
import moment from 'moment';
import AssessmentView from '../dialogs/assessmentView';
import StudentClassParticipate from '../dialogs/studentClassParticipate';
import StudentHwCwStats from './studentCwHwStats';
import LessonPlanTabsStudent from './lessonPlanStudent';
import apiRequest from '../../../config/apiRequest';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Loader from '../../../components/loader/loader';
import EditIcon from '@material-ui/icons/Edit';
import CreateCwEditDialoge from '../dialogs/createCwEditDialoge';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  JoinClassButton: {
    width: '200px',
    height: '7vh',
    fontWeight: 'bold',
    borderRadius: '5px',
    background: '#dd1c1c',
    '&:hover': {
      background: '#dd1c1c',
    },
  },
  ongoingClass: {
    width: '250px',
    height: '7vh',
    fontWeight: 'bold',
    borderRadius: '5px',
    '&:hover': {
      background: '#2fc256',
    },
  },
  createDiaryBtn: {
    background: '#e3f2f5',
    color: 'black',
    borderRadius: '20px',
    '&:hover': {
      background: '#e3f2f5',
    },
  },
  periodAddSection: {
    color: 'black',
    background: '#fff',
    borderRadius: '0px',
    width: '100%',
    '&:hover': {
      background: '#fff',
    },
  },
  buttonzoom: {
    background: 'green',
  },
  buttonzoom1: {
    background: 'pink',
  },
  classAddSection: {
    color: 'grey',
    background: '#fff',
    borderRadius: '4px',
    width: '142%',
    fontSize: '11px',
    fontWeight: 700,
    border: '1px solid #cccccc',
    '&:hover': {
      background: '#fff',
    },
  },
}));

const EditPeriod = withRouter(({ history, ...props }) => {
  const { id } = useParams();
  const grade = history?.location?.state?.data?.grade?.name;
  const section = history?.location?.state?.data?.section?.name;
  const classes = useStyles({});
  const [periodUI, setPeriodUI] = useState(null);
  const [uniqueIdd, setUniqueIdd] = useState(null);
  const [open, setOpen] = useState(false);
  const [topicAddClicked, setTopicAddClicked] = useState(false);
  const [assignClassWork, setAssignClassWork] = useState(false);
  const [assignHomeWork, setAssignHomeWork] = useState(false);
  const [openClassWork, setOpenClassWork] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [periodData, setPeriodData] = useState([]);
  const [periodId, setPeriodId] = useState();
  const [date, setDate] = useState(null);
  const { setAlert } = useContext(AlertNotificationContext);
  const [accordianOpen, setAccordianOpen] = useState(false);
  const [topicDetails, setTopicDetails] = useState([]);
  const [periodDetails, setPeriodDetails] = useState(history?.location?.state?.data);
  const periodName = periodDetails?.subject?.name;
  const [openParticipate, setOpenParticipate] = useState(false);
  const [loading, setLoading] = useState(false);

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };
  const [isClassWorkOpen, setIsClassWorkOpen] = useState(false);
  const [isHomeWorkOpen, setIsHomeWorkOpen] = useState(false);
  const [isDairyCreated, setIsDairyCreated] = useState(false);
  const [createdDairy, setCreatedDairy] = useState([]);
  const [dairyId, setDairyId] = useState(null);
  const [assignedTopic, setAssignedTopic] = useState(null);
  const userData = JSON.parse(localStorage.getItem('userDetails'));
  const user_id = userData?.user_id;
  const user_level = userData?.user_level;
  const isStudent = user_level == 13 ? true : false;
  const [attFlag, setAttFlag] = useState(false)
  const [currTime, setCurrTime] = useState(new Date());
  const [currDate, setCurrDate] = useState();
  const [classDate, setClassDate] = useState();
  const [editCw, setEditCw] = useState(false);
  const [class_StartTime, setClassStartTime] = useState(
    history?.location?.state?.data?.start
  );
  const [refresh, setRefresh] = useState(false);
  const viewAttendance = () => {
    history.push({
      pathname: `/academic-calendar/each-attendance/${id}`,
      state: {
        periodId: id,
        online_class_id: periodData?.online_class_id,
        date: date,
        grade: grade,
        section: section,
        periodName: periodName,
        is_att_confirm: periodData?.is_attendance_confirm
      },
    });
  };

  const joinQuiz = (i) => {
    history.push({
      pathname: `/erp-online-class/${periodData.online_class_id}/${assignClassWork?.quiz_list[0]?.question_paper_id}/pre-quiz`,
    });
  };

  const addTopic = () => {
    setTopicAddClicked(true);
  };

  const viewClassParticipate = () => {
    if (isStudent) {
      setOpenParticipate(true);
      setPeriodUI('studentParticipate');
    } else {
      history.push({
        pathname: `/academic-calendar/view-participate/${id}`,
        periodId: id,
        cpConfirm: periodData?.is_cp_confirm
      });
    }
  };

  const viewClassWork = () => {
    history.push({
      pathname: '/academic-calendar/view-class-work',
      state: {
        periodId: id,
        online_class_id: periodData?.online_class_id,
        date: date,
      },
    });
  };

  const handleClassWork = () => {
    setOpenClassWork(!openClassWork);
  };
  const handleViewHomeWork = (id) => {
    history.push({
      pathname: `/academic-calendar/view-home-work/${id}`,
      homeworkId: id,
    });
  };

  const handleSudentSubmitHW = (id) => {
    history.push({
      pathname: `/academic-calendar/submit-home-work/${id}`,
      homeworkId: id,
    });
  };

  const toggleDrawerDiary = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };
  const toggleClassWorkDrawer = () => {
    setIsClassWorkOpen((prevState) => !prevState);
  };
  const toggleHomeWorkDrawer = () => {
    setIsHomeWorkOpen((prevState) => !prevState);
  };
  const toggleCwDrawer = () => {
    setEditCw((prevState) => !prevState);
  };
  const openViewDairy = () => {
    setLoading(true);
    setOpen(!open);
    axiosInstance
      .get(`/academic/general-dairy-messages/?diary_id=${dairyId}`)
      .then((res) => {
        setCreatedDairy(res?.data?.result?.results);
        setLoading(false);
      })
      .catch((err) => {
        // console.log(err);
        setLoading(false);
      });
  };
  useEffect(() => {
    if (history?.location?.state) {
      setClassStartTime(
        `${moment(class_StartTime).subtract(5, 'minutes').format('HH:mm:00')}`
      );
      setCurrTime(`${moment(currTime).format('HH:mm:00')}`);
      setPeriodId(periodDetails?.info?.id);
      setClassDate(`${moment(class_StartTime).format('YYYY-MM-DD')}`);
      setCurrDate(`${moment(currTime).format('YYYY-MM-DD')}`);
    }
  }, [periodDetails, history]);

  const handleClass = () => {
    setLoading(true);
    let user_id;
    if (isStudent) {
      user_id = 13;
    } else {
      user_id = 11;
    }
    apiRequest(
      'get',
      `/oncls/v1/retrieve_zoom_link_by_user_level/?online_class_id=${periodData.online_class_id}&user_level_id=${user_id}`
    )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          const url = result.data?.result;
          if (isStudent) {
            window.open(url.join_url, '_blank');
          } else {
            window.open(url.start_url, '_blank');
          }
        } else {
          setAlert('error', result?.data?.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setLoading(false);
      });
    if (isStudent && !periodData?.attendance_details?.is_present) {
      joinStudentClass();
    }
  };

  useEffect(() => {
    if (history?.location?.state) {
      let url;
      if (isStudent) {
        url = `${endpoints.period.retrieveStudentDetails}?period_id=${id}`;
      } else {
        url = `${endpoints.period.retrieveTeacherDetails}?period_id=${id}`;
      }
      setLoading(true);
      axiosInstance
        .get(url)
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setLoading(false);
            const lists = result?.data?.result;
            setPeriodData(lists);
            setDate(lists?.date);
            setIsDairyCreated(lists?.general_dairy_details?.assigned);
            setDairyId(lists?.general_dairy_details?.id);
            setTopicDetails(lists?.topic_details?.topic_details);
            // setAssessmentId(lists?.test_details[0]?.id)
            // setQuestionPaperId(lists?.test_details[0]?.question_paper_id)
            // setIsAssessment(lists?.test_details[0]?.submitted)
            if (lists?.homework_details?.assigned) {
              setAssignHomeWork(lists?.homework_details?.homework_list);
            }
            if (lists?.classwork_details?.assigned) {
              setAssignClassWork(lists?.classwork_details);
            }
          }
        })
        .catch((error) => {
          setLoading(false);
          // setAlert('error', error?.message);
        });
    }
    setRefresh(false);
  }, [history, refresh, isDairyCreated, isClassWorkOpen, attFlag]);

  const submitHomework = (reqObj) => {
    let obj = {
      ...reqObj,
      period_id: id,
      date: date,
    };
    if (periodData?.homework_details?.homework_list.length) {
      axiosInstance
        .put(
          `/academic/${periodData?.homework_details?.homework_list[0]?.homework_id}/update-hw/`,
          obj
        )
        .then((result) => {
          if (result.data.status_code === 200 || result.data.status_code === 201) {
            setAlert('success', result.data.message);
            toggleHomeWorkDrawer();
            setRefresh(true);
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    } else {
      axiosInstance
        .post(`${endpoints.homework.upload}`, obj)
        .then((result) => {
          if (result.data.status_code === 200 || result.data.status_code === 201) {
            setAlert('success', result.data.message);
            toggleHomeWorkDrawer();
            setRefresh(true);
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  };

  const handleAccordionChange = (value) => (event, newExpanded) => {
    if (value > 0) {
      setAccordianOpen(newExpanded ? value : false);
    }
  };

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return '';
    } else {
      return (
        <CardMedia className='countdownTimerContainer'>
          <SvgIcon
            component={() => (
              <img
                style={{ height: '17px', width: '17px', marginTop: '5px' }}
                src={WhiteClock}
              />
            )}
          />
          <span className='countdownTimer'>
            Starts in : {zeroPad(minutes)}:{zeroPad(seconds)}
          </span>
        </CardMedia>
      );
    }
  };
  const handleDiary = () => {
    setIsDairyCreated(true);
  };

  const joinStudentClass = () => {
    setLoading(true);
    axiosInstance
      .put(`${endpoints.period.updateAttendanceStudent.replace('<period-id>', id)}`)
      .then((response) => {
        if (response?.data?.status_code === 200) {
          setAlert('success', response.data?.message);
          setLoading(false);
          setAttFlag(!attFlag);
        }
      })
      .catch((e) => {
        setAlert('error', e?.message);
        setLoading(false);
      });
  };

  const handleEditClassWork = () => {
    setEditCw(!editCw);
  };
  const handleEditHomeWork = () => {
    // console.log('inside edit home work');
  };

  const renderPeriodsUI = () => {
    switch (periodUI) {
      case 'addTopic':
        return (
          <AddTopic
            setPeriodUI={setPeriodUI}
            periodId={id}
            setAssignedTopic={setAssignedTopic}
            uniqueIdd={uniqueIdd}
            setUniqueIdd={setUniqueIdd}
          />
        );
      case 'lessonPlanTabs':
        return (
          <>
            <LessonPlanTabs
              setPeriodUI={setPeriodUI}
              periodId={id}
              checkid={'default'}
              assignedTopic={assignedTopic}
              upcomingTopicId={uniqueIdd}
            />
          </>
        );

      case 'card':
        return (
          <Card
            setPeriodUI={setPeriodUI}
            periodId={id}
            uniqueIdd={uniqueIdd}
            setUniqueIdd={setUniqueIdd}
          />
        );
      case 'studentParticipate':
        return (
          <StudentClassParticipate
            periodId={id}
            userId={user_id}
            openParticipate={openParticipate}
            setOpenParticipate={setOpenParticipate}
            date={date}
            periodName={periodName}
          />
        );
      default:
        return (
          <>
            <Box p={23}>
              {periodDetails?.ongoing_status !== 'Completed' && !isStudent && (
                <>
                  <h4> Select a Topic to teach in this period</h4>
                  <Button
                    variant='contained'
                    color='secondary'
                    className={classes.button}
                    onClick={() => setPeriodUI('addTopic')}
                  >
                    Add Topic
                  </Button>
                </>
              )}
            </Box>
          </>
        );
    }
  };
  return (
    <Layout>
      {/* {loading && <Loader />} */}
      <div className='container' style={{ minHeight: '650px' }}>
        <ArrowBackIcon
          style={{ size: 'small', marginLeft: '15px', cursor: 'pointer' }}
          onClick={() => {
            history.goBack();
          }}
        />
        <div className='initialRow'>
          <div className='onlineClass'>
            <Box p={2}>
              <Paper>
                <Box p={3}>
                  {!isStudent ? (
                    <div className='classDetails'>
                      <div
                        className='classes'
                        style={{
                          margin: '10px',
                          padding: '5px',
                        }}
                      >
                        <p
                          style={{
                            fontSize: '15px',
                            fontWeight: '600',
                          }}
                        >
                          {history?.location?.state?.data?.grade?.name}
                        </p>
                        <p>{history?.location?.state?.data?.section?.name}</p>
                      </div>
                      {periodDetails?.ongoing_status === 'Completed' ? (
                        <div>
                          <Button
                            variant='contained'
                            // className={classes.JoinClassButton}
                            // onClick={handleClass}
                            disabled
                          >
                            {periodDetails?.info?.type_name !== 'Examination'
                              ? ' Class Completed '
                              : 'Exam Completed'}
                          </Button>
                        </div>
                      ) : periodDetails?.ongoing_status === 'On going...' ? (
                        <Button
                          variant='contained'
                          className={classes.ongoingClass}
                          onClick={handleClass}
                        // style={{ width: '250px' }}
                        >
                          Ongoing
                        </Button>
                      ) : (
                        <div >
                          <Button
                            variant='contained'
                            className={classes.JoinClassButton}
                            onClick={handleClass}
                            disabled={
                              currTime < class_StartTime || currDate !== classDate
                            }
                          >
                            Host Class
                            {/* {isOngoing ? 'Ongoing' : 'Host Class'} */}
                          </Button>
                          {currTime < class_StartTime && currDate === classDate && (
                            <p
                              style={{
                                fontSize: 'x-small',
                                fontWeight: '900',
                                marginTop: '5%',
                                marginLeft: '16%',
                                color: 'red',
                              }}
                            >
                              you can Host class at {class_StartTime}
                            </p>
                          )}
                          {currTime >= class_StartTime && currDate === classDate && (
                            // <Grid item md={12} xs={12}>
                            <div>
                              <Typography
                                style={{
                                  font: 'normal normal normal 16px/18px Raleway',
                                  borderRadius: '7px',
                                  textAlign: 'center'
                                }}
                              >
                                <span
                                  className='countdownTimerWrapper teacherBatchCardLable'

                                >
                                  <Countdown
                                    date={new Date(periodDetails?.start)}
                                    renderer={renderer}
                                  ></Countdown>
                                </span>
                              </Typography>
                            </div>
                          )}
                        </div>
                      )}
                      {/* </div> */}


                    </div>
                  ) : (
                    <div className='classDetails'>
                      <div
                        className='classes'
                        style={{
                          margin: '10px',
                          padding: '5px',
                        }}
                      >
                        <p
                          style={{
                            fontSize: '15px',
                            fontWeight: '600',
                          }}
                        >
                          {history?.location?.state?.data?.grade?.name}
                        </p>
                        <p>{history?.location?.state?.data?.section?.name}</p>
                      </div>
                      {periodDetails?.ongoing_status === 'Completed' ? (
                        <div>
                          <Button
                            variant='contained'
                            // className={classes.JoinClassButton}
                            // onClick={handleClass}
                            disabled
                          >
                            Class Completed
                          </Button>
                        </div>
                      ) : periodDetails?.ongoing_status === 'On going...' ? (
                        <Button
                          variant='contained'
                          className={classes.ongoingClass}
                          onClick={handleClass}
                        // style={{ width: '250px' }}
                        >
                          Ongoing
                        </Button>
                      ) : (
                        <div>
                          <Button
                            variant='contained'
                            className={classes.JoinClassButton}
                            onClick={handleClass}
                            disabled={
                              currTime < class_StartTime || currDate !== classDate
                            }
                          >
                            <p>Join Class</p>
                          </Button>
                          {currTime < class_StartTime && currDate === classDate && (
                            <p
                              style={{
                                fontSize: 'x-small',
                                fontWeight: '900',
                                marginTop: '5%',
                                marginLeft: '16%',
                                color: 'red',
                              }}
                            >
                              you can Join class at {class_StartTime}
                            </p>
                          )}
                          {currTime >= class_StartTime && currDate === classDate && (
                            // <Grid item md={12} xs={12}>
                            <div>
                              <Typography
                                style={{
                                  font: 'normal normal normal 16px/18px Raleway',
                                  borderRadius: '7px',
                                  textAlign: 'center'
                                }}
                              >
                                <span
                                  className='countdownTimerWrapper teacherBatchCardLable'
                                >
                                  <Countdown
                                    date={new Date(periodDetails?.start)}
                                    renderer={renderer}
                                  ></Countdown>
                                </span>
                              </Typography>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </Box>
              </Paper>
            </Box>
            {/* <ArrowBackIcon
              style={{ size: 'small', marginLeft: '15px', cursor: 'pointer' }}
              onClick={() => {
                history.goBack();
              }}
            /> */}
          </div>
          {!isStudent ? (
            <div className='attendence'>
              <Box p={2}>
                <Paper>
                  <Box p={2} style={{ cursor: 'pointer' }} onClick={viewAttendance}>
                    <div className='att1'>
                      <div className='presentWrapper'>
                        <div className='presentTitle'>Present</div>
                        <div className='PresentNum'>
                          {periodData?.attendance_details?.total_students_present}
                        </div>
                      </div>
                      <div className='absentWrapper'>
                        <div className='absentTitle'>Absent</div>
                        <div className='AbsentNum'>
                          {periodData?.attendance_details?.total_students_absent}
                        </div>
                      </div>
                    </div>
                    <div className='attenWrapper'>View Attendance</div>
                  </Box>
                </Paper>
              </Box>
            </div>
          ) : (
            <div className='attendences'>
              <Box p={2}>
                <Paper>
                  <Box p={2} style={{ cursor: 'pointer' }}>
                    <div className='att11'>
                      <div className='presentWrapper'>
                        <div style={{ width: '20%', color: 'black' }}>
                          <h3>Attendence</h3>
                        </div>
                        {periodData?.attendance_details?.is_present ? (
                          <div className='attendOnline'>
                            <h5>Present</h5>
                          </div>
                        ) : (
                          <div className='notyet'>
                            <h5>Not Yet</h5>
                          </div>
                        )}
                      </div>
                    </div>
                  </Box>
                </Paper>
              </Box>
            </div>
          )}
        </div>
        <div className='alreadyAddedTopic'>
          {!isStudent &&
            periodDetails?.info?.type_name !== 'Examination' &&
            topicDetails?.map((value, index) => {
              return (
                <div className={`acc${index + 1}`} style={{}}>
                  {value ? (
                    <Accordion
                      expanded={accordianOpen === index + 1}
                      onChange={handleAccordionChange(index + 1)}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel1a-content'
                        id='panel1a-header'
                      >
                        {value?.topic_name}{' '}
                        <div style={{ marginLeft: '76%', display: 'flex' }}>
                          {value?.status === 2
                            ? 'Completed'
                            : value?.status === 1
                              ? 'Partially completed'
                              : 'Not completed'}
                          {/* <CheckIcon style={{ fontSize: 'large', color: '#53e24a' }} /> */}
                        </div>
                      </AccordionSummary>
                      {accordianOpen && (
                        <>
                          <AccordionDetails>
                            <LessonPlanTabs
                              // filesData = {filesData}
                              data={value}
                              TopicId={value?.topic_id}
                              isAccordian={accordianOpen}
                              checkid={'accordian'}
                              assignedTopic={value?.id}
                            />
                          </AccordionDetails>
                          <div></div>
                        </>
                      )}
                    </Accordion>
                  ) : (
                    <></>
                  )}
                </div>
              );
            })}
        </div>
        {periodDetails?.info?.type_name !== 'Examination' ? (
          <div className='secondRow'>
            <div className='topic'>
              <Box p={2}>
                {isStudent && <LessonPlanTabsStudent upcomingTopicId={topicDetails} />}
                <Paper>{renderPeriodsUI()}</Paper>
              </Box>
            </div>
            <div className='right-side'>
              <div className='create-diary-button'>
                {isDairyCreated ? (
                  <Button
                    variant='contained'
                    className={classes.createDiaryBtn}
                    onClick={openViewDairy}
                  >
                    {!isStudent ? 'Diary Created' : 'View Diary'}
                  </Button>
                ) : !isStudent ? (
                  <Button
                    variant='contained'
                    className={classes.createDiaryBtn}
                    onClick={toggleDrawerDiary}
                  >
                    Create Diary
                  </Button>
                ) : null}
                <SwipeableDrawer
                  anchor='right'
                  open={isDrawerOpen}
                  onClose={toggleDrawerDiary}
                  onOpen={toggleDrawerDiary}
                  style={{ padding: '20px' }}
                >
                  <CreateDiary
                    periodId={id}
                    onClose={toggleDrawerDiary}
                    handleDiary={handleDiary}
                  />
                </SwipeableDrawer>
                <SwipeableDrawer
                  anchor='right'
                  open={open}
                  onClose={openViewDairy}
                  onOpen={openViewDairy}
                  style={{ padding: '20px' }}
                >
                  {createdDairy?.map((period, i) => (
                    <EditDiaryDialog
                      open={open}
                      isStudent={!isStudent}
                      setOpen={setOpen}
                      onClose={openViewDairy}
                      lesson={period}
                      periodId={id}
                      style={{ width: '70%' }}
                    />
                  ))}
                </SwipeableDrawer>
              </div>
              <div className='classParticipationWrapper'>
                <Button
                  variant='contained'
                  className={classes.periodAddSection}
                  onClick={viewClassParticipate}
                >
                  Class Participation
                </Button>
              </div>
              {!isStudent ? (
                <>
                  {assignClassWork ? (
                    <div className='classworkPresent'>
                      <Grid container className='swipe-container'>
                        <SwipeableDrawer
                          className='my__swipable'
                          id='private_swipe'
                          anchor='right'
                          open={isClassWorkOpen}
                          onClose={toggleClassWorkDrawer}
                          onOpen={toggleClassWorkDrawer}
                        >
                          <CreateClassWorkDialog
                            periodId={id}
                            onClose={toggleClassWorkDrawer}
                            // periodId={history?.location?.state?.data?.id}
                            topicId={uniqueIdd}
                            style={{ width: '70%' }}
                          />
                        </SwipeableDrawer>
                      </Grid>
                      <div className='classesWrapper'>
                        {assignClassWork?.classwork_details.map((each, index) => (
                          <div className='individualClass'>
                            <paper variant='outlined'>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  padding: '5px 10px',
                                }}
                              >
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <div
                                    onClick={viewClassWork}
                                    style={{
                                      fontWeight: '900',
                                      cursor: 'pointer',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {`Class work`} <br />
                                    <p style={{ fontSize: 'x-small' }}>class work</p>
                                  </div>
                                  <div
                                    style={{ fontSize: '11px', whiteSpace: 'nowrap' }}
                                  ></div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <div
                                    style={{
                                      fontSize: '11px',
                                      color: 'green',
                                      cursor: 'pointer',
                                    }}
                                    onClick={viewClassWork}
                                  >
                                    Submitted
                                  </div>
                                  <div
                                    style={{
                                      background: '#cbf9cb',
                                      borderRadius: '20px',
                                      textAlign: 'center',
                                      width: '30px',
                                    }}
                                  >
                                    {each?.submitted}
                                  </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <div
                                    style={{
                                      fontSize: '11px',
                                      color: 'red',
                                      cursor: 'pointer',
                                    }}
                                    onClick={viewClassWork}
                                  >
                                    Pending
                                  </div>
                                  <div
                                    style={{
                                      background: '#f9d4d4',
                                      borderRadius: '20px',
                                      textAlign: 'center',
                                      width: '30px',
                                    }}
                                  >
                                    {each?.pending}
                                  </div>
                                </div>
                                <div>
                                  <EditIcon
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleEditClassWork}
                                  />
                                  <Grid container className='swipe-container'>
                                    <SwipeableDrawer
                                      className='my__swipable'
                                      id='private_swipe'
                                      anchor='right'
                                      open={editCw}
                                      onClose={toggleCwDrawer}
                                      onOpen={toggleCwDrawer}
                                    >
                                      <CreateCwEditDialoge
                                        onClose={toggleCwDrawer}
                                        style={{ width: '70%' }}
                                        periodClassWorkId={
                                          periodData?.classwork_details
                                            ?.classwork_details[0]?.period_classwork_id
                                        }
                                        topicId={uniqueIdd}
                                      // handleCreate={(obj) => submitHomework(obj)}
                                      />
                                    </SwipeableDrawer>
                                  </Grid>{' '}
                                </div>
                              </div>
                            </paper>
                          </div>
                        ))}
                        {assignClassWork?.quiz_list?.map((each, index) => (
                          <div className='individualClass' style={{ marginTop: '2px' }}>
                            <paper variant='outlined'>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  padding: '5px 10px',
                                }}
                              >
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <div
                                    onClick={viewClassWork}
                                    style={{
                                      fontWeight: '900',
                                      cursor: 'pointer',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {`Class work`} <br />
                                    <p style={{ fontSize: 'x-small' }}>Quiz </p>
                                  </div>
                                  <div
                                    style={{ fontSize: '11px', whiteSpace: 'nowrap' }}
                                  ></div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <div
                                    style={{
                                      fontSize: '11px',
                                      color: 'green',
                                      cursor: 'pointer',
                                    }}
                                    onClick={viewClassWork}
                                  >
                                    Attended
                                  </div>
                                  <div
                                    style={{
                                      background: '#cbf9cb',
                                      borderRadius: '20px',
                                      textAlign: 'center',
                                      width: '30px',
                                    }}
                                  >
                                    {each?.submitted}
                                  </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <div
                                    style={{
                                      fontSize: '11px',
                                      color: 'red',
                                      cursor: 'pointer',
                                    }}
                                    onClick={viewClassWork}
                                  >
                                    Pending
                                  </div>
                                  <div
                                    style={{
                                      background: '#f9d4d4',
                                      borderRadius: '20px',
                                      textAlign: 'center',
                                      width: '30px',
                                    }}
                                  >
                                    {each?.pending}
                                  </div>
                                </div>
                                <div>
                                  {index === 0 ? (
                                    <div
                                      onClick={() => {
                                        joinQuiz(index);
                                      }}
                                    >
                                      <Button
                                        variant='contained'
                                        size='small'
                                        style={{
                                          display: 'flex',
                                          flexWrap: 'wrap',
                                          fontSize: '9px',
                                          background: '#E2EEFE',
                                          color: '#3680DE',
                                          marginTop: '21px',
                                          // marginRight: '-16px',
                                          padding: '1px 0px',
                                          position: 'absolute',
                                          right: '16px',
                                          fontWeight: '900',
                                          borderRadius: '0px',
                                          width: '14%',
                                        }}
                                      >
                                        Launch Quiz
                                      </Button>
                                    </div>
                                  ) : (
                                    ''
                                  )}
                                </div>
                              </div>
                            </paper>
                          </div>
                        ))}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end ',
                        }}
                      >
                        <div
                          style={{
                            padding: '0px 5px',
                            padding: '0px 0px',
                            margin: '1px 46px 20px 20px',
                          }}
                        >
                          <Button
                            variant='contained'
                            className={classes.classAddSection}
                            onClick={toggleClassWorkDrawer}
                          >
                            + Add class Work
                          </Button>
                        </div>
                      </div>
                      <Grid container className='swipe-container'>
                        <SwipeableDrawer
                          className='my__swipable'
                          id='private_swipe'
                          anchor='right'
                          open={isClassWorkOpen}
                          onClose={toggleClassWorkDrawer}
                          onOpen={toggleClassWorkDrawer}
                        >
                          {/* <CreateClassWork onClose={toggleClassWorkDrawer} style={{width:"70%"}}/> */}
                          <CreateClassWorkDialog
                            periodId={id}
                            onClose={toggleClassWorkDrawer}
                            topicId={uniqueIdd}
                            style={{ width: '70%' }}
                          />
                        </SwipeableDrawer>
                      </Grid>
                    </div>
                  ) : (
                    <>
                      <div className='assignTasks'>
                        <Button
                          variant='contained'
                          className={classes.periodAddSection}
                          onClick={toggleClassWorkDrawer}
                        >
                          Assign Class Work
                        </Button>
                      </div>
                      <Grid container className='swipe-container'>
                        <SwipeableDrawer
                          className='my__swipable'
                          id='private_swipe'
                          anchor='right'
                          open={isClassWorkOpen}
                          onClose={toggleClassWorkDrawer}
                          onOpen={toggleClassWorkDrawer}
                        >
                          <CreateClassWorkDialog
                            onClose={toggleClassWorkDrawer}
                            periodId={id}
                            topicId={uniqueIdd}
                            style={{ width: '70%' }}
                          />
                        </SwipeableDrawer>
                      </Grid>{' '}
                    </>
                  )}

                  {/* <div className='classesWrapper'>
              <div className='individualClass'>
                <paper variant='outlined'>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '5px 10px',
                    }}
                  >
                    <div className='assignTasks'>
                      <Button
                        variant='contained'
                        className={classes.periodAddSection}
                        onClick={() => handleSudentSubmitHW(984)}
                      >
                        Submitted
                      </Button>
                    </div>
                  </div>
                </paper>
              </div>
            </div> */}
                  {assignHomeWork ? (
                    <>
                      <div className='classworkPresent'>
                        <Grid container className='swipe-container'>
                          <SwipeableDrawer
                            className='my__swipable'
                            id='private_swipe'
                            anchor='right'
                            open={isHomeWorkOpen}
                            onClose={toggleHomeWorkDrawer}
                            onOpen={toggleHomeWorkDrawer}
                          >
                            {/* <CreateHomeWork onClose={toggleDrawer} style={{width:"70%"}}/> */}
                            <CreateHomeWorkDialog
                              onClose={toggleHomeWorkDrawer}
                              style={{ width: '70%' }}
                              handleCreate={(obj) => submitHomework(obj)}
                              homeworkDetails={
                                periodData?.homework_details?.homework_list[0]
                              }
                            />
                          </SwipeableDrawer>
                        </Grid>
                        {assignHomeWork?.map((each, index) => {
                          return (
                            <div className='classesWrapper'>
                              <div className='individualClass'>
                                <paper variant='outlined'>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      padding: '5px 10px',
                                    }}
                                  >
                                    <div
                                      style={{ display: 'flex', flexDirection: 'column' }}
                                    >
                                      <div
                                        style={{ fontWeight: '900', cursor: 'pointer' }}
                                        onClick={() =>
                                          handleViewHomeWork(each?.homework_id)
                                        }
                                      >
                                        {`HW `}
                                      </div>
                                      {/* <div style={{ fontSize: '11px' }}></div> */}
                                    </div>
                                    <div
                                      style={{ display: 'flex', flexDirection: 'column' }}
                                    >
                                      <div
                                        style={{
                                          fontSize: '11px',
                                          color: 'green',
                                          cursor: 'pointer',
                                        }}
                                        onClick={() =>
                                          handleViewHomeWork(each?.homework_id)
                                        }
                                      >
                                        Submitted
                                      </div>
                                      <div
                                        style={{
                                          background: '#cbf9cb',
                                          borderRadius: '20px',
                                          textAlign: 'center',
                                          width: '30px',
                                        }}
                                      >
                                        {each.submitted}
                                      </div>
                                    </div>
                                    <div
                                      style={{ display: 'flex', flexDirection: 'column' }}
                                    >
                                      <div
                                        style={{
                                          fontSize: '11px',
                                          color: 'red',
                                          cursor: 'pointer',
                                        }}
                                        onClick={() =>
                                          handleViewHomeWork(each?.homework_id)
                                        }
                                      >
                                        Pending
                                      </div>
                                      <div
                                        style={{
                                          background: '#f9d4d4',
                                          borderRadius: '20px',
                                          textAlign: 'center',
                                          width: '30px',
                                        }}
                                      >
                                        {each.pending}
                                      </div>
                                    </div>
                                    <div
                                      style={{ display: 'flex', flexDirection: 'column' }}
                                    >
                                      <div
                                        style={{
                                          fontSize: '11px',
                                          color: 'grey',
                                          cursor: 'pointer',
                                        }}
                                        onClick={() =>
                                          handleViewHomeWork(each?.homework_id)
                                        }
                                      >
                                        Evaluated
                                      </div>
                                      <div
                                        style={{
                                          background: 'grey',
                                          borderRadius: '20px',
                                          textAlign: 'center',
                                          width: '30px',
                                        }}
                                      >
                                        {each.evaluated}
                                      </div>
                                    </div>
                                    <div>
                                      <EditIcon
                                        style={{ cursor: 'pointer' }}
                                        onClick={toggleHomeWorkDrawer}
                                      />
                                    </div>
                                  </div>
                                </paper>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='assignTasks'>
                        <Button
                          variant='contained'
                          className={classes.periodAddSection}
                          onClick={toggleHomeWorkDrawer}
                        >
                          Assign Home Work
                        </Button>
                      </div>{' '}
                      <Grid container className='swipe-container'>
                        <SwipeableDrawer
                          className='my__swipable'
                          id='private_swipe'
                          anchor='right'
                          open={isHomeWorkOpen}
                          onClose={toggleHomeWorkDrawer}
                          onOpen={toggleHomeWorkDrawer}
                        >
                          <CreateHomeWorkDialog
                            onClose={toggleHomeWorkDrawer}
                            style={{ width: '70%' }}
                            handleCreate={(obj) => submitHomework(obj)}
                            homeworkDetails={periodData?.homework_details}
                          />
                        </SwipeableDrawer>
                      </Grid>{' '}
                    </>
                  )}

                  {!assignHomeWork && !assignClassWork && (
                    <div className='noTopicWrapper'>No topic added to the period</div>
                  )}
                </>
              ) : (
                <StudentHwCwStats
                  data={periodData}
                  hwData={periodData?.homework_details}
                  periodDetails={periodDetails?.ongoing_status}

                />
              )}
            </div>
          </div>
        ) : (
          <div className='assessmentParent'>
            <AssessmentView
              isStudent={!isStudent}
              periodId={id}
              assessmentSubmitted={periodData?.assessment_details}
              periodData={periodData}
              assessmentId={periodData?.test_details?.id}
              questionPaperId={periodData?.test_details?.question_paper_id}
              isAssessment={periodData?.test_details?.submitted}
            />
          </div>
        )}
      </div>
    </Layout>
  );
});
export default EditPeriod;
