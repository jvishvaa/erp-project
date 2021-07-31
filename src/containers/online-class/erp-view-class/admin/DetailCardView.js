import React, { useContext, useState, useEffect } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';
import Timer from 'react-compound-timer';
import axiosInstance from '../../../../config/axios';
import endpoints from '../../../../config/endpoints';
import Loader from '../../../../components/loader/loader';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import ResourceDialog from '../../../online-class/online-class-resources/resourceDialog';
import CountdownTimer from './CountdownTimer';
import UploadDialogBox from './UploadDialogBox';
import ClassIcon from '@material-ui/icons/Class';
import './index.css';
import { useDispatch } from 'react-redux';
import { SvgIcon } from '@material-ui/core';
import { attendanceAction } from '../../../../redux/actions/onlineClassActions';
import {
  Grid,
  Card,
  Divider,
  Button,
  Popover,
  Typography,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import { useHistory, Route, withRouter } from 'react-router-dom';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { AttachFile as AttachFileIcon } from '@material-ui/icons';
import edxtag from '../../../../assets/images/edxtag.jpeg';

const JoinClass = (props) => {
  const { setLoading, index, cardIndex, getClassName } = props;
  const fullData = props.fullData;
  const handleClose = props.handleClose;
  const { setAlert } = useContext(AlertNotificationContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [joinAnchor, setJoinAnchor] = useState(null);
  const [classWorkDialog, setDialogClassWorkBox] = useState(false);
  const [isAccept, setIsAccept] = useState(props.data ? props?.data?.is_accepted : false);
  const history = useHistory();
  const classStartTime = moment(props && props?.data && props?.data?.date).format(
    'DD-MM-YYYY'
  );

  const currDate = moment(new Date()).format('DD-MM-YYYY');

  const startTimeProp = props?.data?.start_time;
  const endTimeProp = props?.data?.end_time;

  const startTime = new Date(`${props.data.date}T${startTimeProp}`).getTime(); //in milliseconds
  const endTime = new Date(`${props.data.date}T${endTimeProp}`).getTime(); //in milliseconds

  const { email = '' } = JSON.parse(localStorage.getItem('userDetails'));

  const getCurrentTime = () => {
    return parseInt(moment(new Date()).format('x')) || 0;
  };

  const handleCloseData = () => {
    setAnchorEl(null);
    // setJoinAnchor(null)
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    // setJoinAnchor(event.currentTarget);
  };
  const handleCloseAccept = () => {
    setJoinAnchor(null);
  };
  const handleOpenClassWorkDialogBox = (value) => {
    setDialogClassWorkBox(value);
  };

  const handleClickAccept = (event) => {
    const currentTime = getCurrentTime();
    const diffTime = startTime - 5 * 60 * 1000;
    if (diffTime > currentTime) {
      setJoinAnchor(event.currentTarget);
    } else if (endTime >= currentTime && currentTime >= diffTime) {
      handleIsAccept();
    } else {
      setClassOver(true);
      setAlert('error', 'Class has ended!');
    }
  };

  const handleIsAccept = () => {
    const params = {
      zoom_meeting_id: fullData && fullData.id,
      class_date: props.data && props.data.date,
      is_accepted: true,
    };
    axiosInstance
      .put(endpoints.studentViewBatchesApi.rejetBatchApi, params)
      .then((res) => {
        setLoading(false);
        setIsAccept(true);
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  };

  const handleIsAttended = () => {
    const params = {
      zoom_meeting_id: fullData && fullData.id,
      class_date: props.data && props.data.date,
      is_attended: true,
    };
    axiosInstance
      .put(endpoints.studentViewBatchesApi.rejetBatchApi, params)
      .then((res) => {
        setLoading(false);
        setIsAccept(true);
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  };

  const [classOver, setClassOver] = useState(false);
  const handleJoinButton = (callback) => {
    const currentTime = getCurrentTime();
    if (endTime >= currentTime) {
      handleIsAttended();
      callback();
    } else {
      setClassOver(true);
      setAlert('error', 'Class has ended!');
    }
  };

  function handleCancel() {
    setLoading(true);
    const params1 = {
      zoom_meeting_id: fullData && fullData.id,
      class_date: props.data && props.data.date,
    };

    const params2 = {
      zoom_meeting_id: fullData && fullData.id,
      class_date: props.data && props.data.date,
      is_restricted: true,
    };

    if (window.location.pathname === '/erp-online-class-student-view') {
      //url = endpoints.studentViewBatchesApi.rejetBatchApi;
      axiosInstance
        .put(endpoints.studentViewBatchesApi.rejetBatchApi, params2)
        .then((res) => {
          setLoading(false);
          setAlert('success', 'Class Rejected');
          handleClose('success');
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.message);
        });
    } else {
      //url = endpoints.teacherViewBatches.cancelBatchApi;
      axiosInstance
        .put(endpoints.teacherViewBatches.cancelBatchApi, params1)
        .then((res) => {
          setLoading(false);
          setAlert('success', res.data.message);
          handleClose('success');
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.message);
        });
    }
  }
  const handleTakeQuiz = (fullData) => {
    if (fullData && fullData.online_class && fullData.online_class.question_paper_id) {
      history.push({
        pathname: `/erp-online-class/${fullData.online_class.id}/${fullData.online_class.question_paper_id}/pre-quiz`,
        state: { data: fullData.online_class.id },
      });
    } else {
      setAlert('error', 'This onlineclass does not have quiz associated with it.');
      return;
    }
  };

  const [disableHost, setDisableHost] = useState(false);

  const handleHostDisable = () => {
    let disableFlag = false;
    const isActiveEnd = endTime;
    const isActiveStart = startTime - 5 * 60 * 1000;
    if (isActiveStart <= getCurrentTime() && getCurrentTime() <= isActiveEnd) {
      setDisableHost(false);
      disableFlag = false;
    } else {
      setDisableHost(true);
      disableFlag = true;
    }
    return disableFlag;
  };

  useEffect(() => {
    if (window.location.pathname === '/erp-online-class-teacher-view') {
      handleHostDisable();
    }
  }, [new Date().getSeconds()]);

  function handleHost(data) {
    if (!handleHostDisable()) {
      setLoading(true);
      axiosInstance
        .get(`${endpoints.teacherViewBatches.hostApi}?id=${data.id}`)
        .then((res) => {
          setLoading(false);
          if (res?.data?.url) {
            window.open(res?.data?.url, '_blank');
          } else {
            setAlert('error', res?.data?.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.message);
        });
    } else {
      setDisableHost(true);
      setAlert('error', "Class can't be started now");
    }
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const openJoin = Boolean(joinAnchor);
  const ids = open ? 'accept-popover' : undefined;
  return (
    <Grid container spacing={2} direction='row' alignItems='center'>
      <Grid item xs={4}>
        <span className={`teacherFullViewdescreption1 ${getClassName()[2]}`}>
          {moment(props.data ? props.data.date : '').format('DD-MM-YYYY')}
        </span>
      </Grid>
      {fullData.online_class.question_paper_id==0?
      <Grid item xs={8}>
      {window.location.pathname === '/erp-online-class-teacher-view' && (
        <Tooltip title='Attach Question Paper'>
          <IconButton
            onClick={() =>
              history.push({
                pathname: `/erp-online-class/assign/${fullData.online_class.id}/qp`,
                state: { data: fullData.online_class.id },
              })
            }
          >
            <AttachFileIcon />
          </IconButton>
        </Tooltip>
      )
    } 
    </Grid>:
    <Grid item xs={8}>
    {window.location.pathname === '/erp-online-class-teacher-view' &&(
      <Button
        size='small'
        color='secondary'
        fullWidth
        variant='contained'
        onClick={() =>
          history.push({
            pathname: `/erp-online-class/${fullData.online_class.id}/${fullData.online_class.question_paper_id}/pre-quiz`,
            state: { data: fullData.online_class.id},
          })
        }
        disabled={props?.data?.is_cancelled}
        className={`teacherFullViewSmallButtons1 ${getClassName()[1]}`}
        // className='teacherFullViewSmallButtons'
      >
        Launch Quiz
      </Button>
    )
}
    </Grid>}
      
      {window.location.pathname === '/erp-online-class-student-view' ? (
        <>
          <Grid item xs={4}>
            <Button
              size='small'
              color='secondary'
              fullWidth
              variant='contained'
              onClick={() => handleTakeQuiz(fullData)}
              disabled={props?.data?.class_status?.toLowerCase() === 'cancelled' || fullData?.online_class?.question_paper_id===0}
              // className='takeQuizButton'
              className={`teacherFullViewSmallButtons1 ${getClassName()[1]}`}
            >
              Take Quiz
            </Button>
          </Grid>

          <Grid item xs={4}>
            <Button
              size='small'
              fullWidth
              variant='contained'
              onClick={() => {
                setDialogClassWorkBox(true);
              }}
              disabled={props?.data?.class_status?.toLowerCase() === 'cancelled'}
              className={`teacherFullViewSmallButtons1 ${getClassName()[1]}`}
            >
              Class Work
            </Button>
            {classWorkDialog && (
              <UploadDialogBox
                periodData={props?.data}
                setLoading={setLoading}
                fullData={fullData}
                classWorkDialog={classWorkDialog}
                OpenDialogBox={handleOpenClassWorkDialogBox}
              />
            )}
          </Grid>
        </>
      ) : (
        ''
      )}
{window.location.pathname === '/erp-online-class-teacher-view' ? (
        <>
          <Grid item xs={4}>
            <Button
              size='small'
              color='#344ADE'
              fullWidth
              variant='contained'
              onClick={() => {
                const { id = '', online_class = {} } = fullData || {};
                const { id: onlineClassId = '', start_time = '' } = online_class || {};
                const startDate = start_time.split('T')[0] || '';
                history.push({
                  pathname: `/erp-online-class/class-work/${onlineClassId}/${id}/${startDate}`,
                });
              }}
              disabled={props?.data?.is_cancelled}
              className={`teacherFullViewSmallButtons1 ${getClassName()[1]}`}
            >
              Class Work
            </Button>
          </Grid>
        </>
      ) : (
        ''
      )}

      {isAccept ? (
        <Grid item xs={4}>
          {endTime >= getCurrentTime() && !classOver ? (
            <Button
              size='small'
              color='secondary'
              fullWidth
              variant='contained'
              disabled={props?.data?.class_status?.toLowerCase() === 'cancelled'}
              onClick={() =>
                handleJoinButton(() => window.open(fullData && fullData.join_url))
              }
              className={`teacherFullViewSmallButtons ${getClassName()[3]}`}
            >
              Join
            </Button>
          ) : (
            <Button
              size='small'
              color='secondary'
              variant='contained'
              disabled='true'
              className='classOverButton'
            >
              Class Over
            </Button>
          )}
        </Grid>
      ) : (
        <>
          {endTime < getCurrentTime() && !classOver ? (
            <Grid item xs={4}>
              <Button
                size='small'
                color='secondary'
                variant='contained'
                disabled='true'
                className='classOverButton'
              >
                Class Over
              </Button>
            </Grid>
          ) : (
            <>
              <Grid item xs={4}>
                {window.location.pathname === '/erp-online-class' && (
                  <Button
                    size='small'
                    color='secondary'
                    fullWidth
                    disabled={props?.data?.is_cancelled}
                    variant='contained'
                    onClick={() => {
                      if (email !== props?.fullData?.online_class?.teacher?.email) {
                        window.open(fullData && fullData?.join_url, '_blank');
                      }
                      if (email === props?.fullData?.online_class?.teacher?.email) {
                        window.open(fullData && fullData?.presenter_url, '_blank');
                      }
                    }}
                    className={`teacherFullViewSmallButtons ${getClassName()[3]}`}
                  >
                    {email === props?.fullData?.online_class?.teacher?.email
                      ? 'Host'
                      : 'Audit'}
                  </Button>
                )}
                {window.location.pathname === '/erp-online-class-teacher-view' && (
                  <Button
                    size='small'
                    color='secondary'
                    fullWidth
                    variant='contained'
                    disabled={disableHost || props?.data?.is_cancelled}
                    onClick={() => handleHost(fullData)}
                    className={`teacherFullViewSmallButtons ${getClassName()[3]}`}
                  >
                    {/* Host Me */}
                    Host
                  </Button>
                )}
                {window.location.pathname === '/erp-online-class-student-view' && (
                  <>
                    <Popover
                      id={ids}
                      open={openJoin}
                      joinAnchor={joinAnchor}
                      onClose={handleClose}
                      style={{ overflow: 'hidden', margin: '19% 0 0 30%' }}
                      className='xyz'
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                    >
                      <Grid
                        container
                        spacing={2}
                        style={{ textAlign: 'center', padding: '10px' }}
                      >
                        <Grid item xs={12} style={{ textAlign: 'right' }}>
                          <CloseIcon
                            style={{ color: '#014B7E' }}
                            onClick={() => handleCloseAccept()}
                          />
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <Typography>
                            You Can Join 5mins Before :{' '}
                            {moment(`${props?.data?.date}T${startTimeProp}`).format(
                              'hh:mm:ss A'
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Popover>
                    <Button
                      size='small'
                      color='secondary'
                      fullWidth
                      variant='contained'
                      // onClick={handleIsAccept}
                      onClick={(e) => handleClickAccept(e)}
                      disabled={
                        props?.data?.class_status?.toLowerCase() === 'cancelled' ||
                        (classStartTime === currDate ? false : true)
                      }
                      className={`teacherFullViewSmallButtons ${getClassName()[3]}`}
                    >
                      Accept
                    </Button>
                  </>
                )}
              </Grid>
              <Grid item xs={4}>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  style={{ overflow: 'hidden' }}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    style={{ textAlign: 'center', padding: '10px' }}
                  >
                    <Grid item md={12} xs={12}>
                      <Typography>Are you sure to Cancel ?</Typography>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <Button
                        variant='contained'
                        size='small'
                        style={{ fontSize: '11px' }}
                        onClick={() => handleCloseData()}
                      >
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <Button
                        variant='contained'
                        color='primary'
                        style={{ fontSize: '11px' }}
                        size='small'
                        onClick={() => handleCancel()}
                      >
                        Confirm
                      </Button>
                    </Grid>
                  </Grid>
                </Popover>
                {window.location.pathname !== '/erp-online-class-student-view' && (
                  <Button
                    size='small'
                    fullWidth
                    disabled={props?.data?.is_cancelled}
                    variant='contained'
                    onClick={(e) => handleClick(e)}
                    className={`teacherFullViewSmallButtons1 ${getClassName()[1]}`}
                  >
                    {props?.data?.is_cancelled ? 'Cancelled' : 'Cancel'}
                  </Button>
                )}
              </Grid>
            </>
          )}
        </>
      )}
    </Grid>
  );
};

const DetailCardView = ({
  tabValue,
  fullData,
  handleClose,
  viewMoreRef,
  selectedClassType,
  loading,
  setLoading,
  index,
}) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const [noOfPeriods, setNoOfPeriods] = useState([]);
  const { role_details } = JSON.parse(localStorage.getItem('userDetails'));
  useEffect(() => {
    if (fullData?.id) {
      handleCallaData();
    }
  }, [fullData?.id]);

  const handleSetData = (response) => {
    const bifuracionArray = ['today', 'upcoming', 'completed', 'cancelled'];
    return (
      response.filter((element) => element?.class_status?.toLowerCase() === bifuracionArray[tabValue]) ||
      []
    );
  };

  const handleCallaData = () => {
    let detailsURL =
      window.location.pathname === '/erp-online-class-student-view'
        ? `erp_user/${fullData && fullData.id}/student-oc-details/`
        : `erp_user/${fullData && fullData.id}/online-class-details/`;

    if (fullData) {
      axiosInstance
        .get(detailsURL)
        .then((res) => {
          if (res?.data?.status_code === 200) {
            const response = res?.data?.data;
            let result = [];
            if (response?.length === 1) {
              result = response;
            }
            if (response?.length > 1) {
              result = handleSetData(response);
            }
            setNoOfPeriods(result);
          } else {
            setAlert('error', res?.data?.message);
          }
        })
        .catch((error) => setAlert('error', error.message));
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const converTime = (info) => {
    let hour = info.split(':')[0];
    let min = info.split(':')[1];
    const part = hour > 12 ? 'PM' : 'AM';
    min = `${min}`.length === 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = `${hour}`.length === 1 ? `0${hour}` : hour;
    return `${hour}:${min} ${part}`;
  };



  const handleAttendance = () => {
    dispatch(attendanceAction(fullData ? fullData.online_class?.start_time : ''));
    if (
      window.location.pathname === '/erp-online-class' ||
      window.location.pathname === '/erp-online-class-teacher-view'
    ) {
      history.push(`/erp-attendance-list/${fullData.online_class && fullData.id}`);
    }
    if (
      window.location.pathname === '/online-class/view-class' ||
      window.location.pathname === '/online-class/teacher-view-class'
    )
      history.push(`/aol-attendance-list/${fullData.online_class && fullData.id}`);
  };
  const handleCoursePlan = () => {
    if (window.location.pathname === '/erp-online-class-student-view') {
      sessionStorage.setItem('isErpClass', 2);
      history.push(
        `/create/course/${fullData.online_class && fullData.online_class.course_id}/5`
      );
    } else if (window.location.pathname === '/erp-online-class-teacher-view') {
      sessionStorage.setItem('isErpClass', 3);
      history.push(
        `/create/course/${fullData.online_class && fullData.online_class.cource_id}/${
          // selectedGrade.map((el)=>el.id)
          1
        }`
      );
    } else if (window.location.pathname === '/erp-online-class') {
      sessionStorage.setItem('isErpClass', 1);
      history.push(
        `/create/course/${fullData.online_class && fullData.online_class.cource_id}/${
          // selectedGrade.map((el)=>el.id)
          1
        }`
      );
    }
  };
  const [openPopup, setOpenPopup] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState('');

  const handleClickOpen = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = (value) => {
    setOpenPopup(false);
    setSelectedValue(value);
  };

  const getClassName = () => {
    let classIndex = `${fullData.class_type}`;
    
    return [
      `teacherBatchFullViewMainCard${classIndex}`,
      `teacherBatchFullViewHeader${classIndex}`,
      `addTextColor${classIndex}`,
      `darkButtonBackground${classIndex}`,
    ];
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        ref={viewMoreRef}
        className='teacherBatchFullViewMainParentDiv'
      >
        <Grid item md={12} xs={12} className='teacherBatchFullViewMainDiv'>
          <Card className={`teacherBatchFullViewMainCard ${getClassName()[0]}`}>
            <Grid
              container
              spacing={2}
              className={`teacherBatchFullViewHeader ${getClassName()[1]}`}
            >
              <Grid item xs={10}>
                {(fullData?.join_url?.includes('present-staging') ||
                  fullData?.presenter_url?.includes('present-staging')) && (
                  <div className='edxTag'>
                    <SvgIcon component={() => <img src={edxtag} />} />
                  </div>
                )}
              </Grid>
              <Grid item xs={2} style={{ textAlign: 'right' }}>
                <CloseIcon style={{ color: 'white' }} onClick={() => handleClose()} />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item md={8} xs={8}>
                    <Typography className='teacherBatchFullCardLable'>
                      {(fullData &&
                        fullData.online_class &&
                        fullData.online_class.title) ||
                        ''}
                    </Typography>
                    <Typography className='teacherBatchFullCardLable'>
                      {(fullData &&
                        fullData.online_class &&
                        fullData.online_class.subject &&
                        fullData.online_class.subject.length !== 0 &&
                        fullData.online_class.subject.map((item) => (
                          <span>
                            {item.subject_name || ''}
                            &nbsp;
                          </span>
                        ))) ||
                        ''}
                    </Typography>
                  </Grid>
                  <Grid item md={4} xs={4}>
                    <Typography className='teacherBatchFullCardLable'>
                      {(fullData &&
                        fullData.join_time &&
                        converTime(fullData.join_time.split(' ')[1])) ||
                        ''}
                    </Typography>
                    <Typography className='teacherBatchFullCardLable'>
                      {noOfPeriods?.length} &nbsp;
                      {noOfPeriods?.length > 1 ? 'Periods' : 'Period'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <span className={`teacherFullViewdescreption ${getClassName()[2]}`}>
                  Periods Date
                </span>
              </Grid>
              <Grid item md={12} xs={12} className='detailCardViewContainer'>
                <Divider className='fullViewDivider' />
                {noOfPeriods && noOfPeriods.length === 0 && (
                  <Typography
                    style={{ margin: '10px' }}
                    className={`${getClassName()[2]}`}
                  >
                    No Record found
                  </Typography>
                )}
                {noOfPeriods &&
                  noOfPeriods.length > 0 &&
                  noOfPeriods.map((data, i) => (
                    <JoinClass
                      cardIndex={index}
                      getClassName={getClassName}
                      setLoading={setLoading}
                      index={i}
                      data={data}
                      fullData={fullData}
                      handleClose={handleClose}
                    />
                  ))}

                <Divider className='fullViewDivider' />
              </Grid>
              <Grid item md={12} xs={12}>
                {window.location.pathname !== '/erp-online-class-student-view' ? (
                  <Button
                    fullWidth
                    size='small'
                    className='teacherFullViewFullButtons'
                    onClick={handleAttendance}
                  >
                    Attendance
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    size='small'
                    className='teacherFullViewFullButtons'
                    onClick={handleClickOpen}
                  >
                    Resources
                  </Button>
                )}
                {selectedClassType && selectedClassType.id !== 0 && (
                  <Button
                    fullWidth
                    size='small'
                    className='teacherFullViewFullButtons'
                    onClick={handleCoursePlan}
                  >
                    View Course Plan
                  </Button>
                )}
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      {openPopup && (
        <ResourceDialog
          selectedValue={selectedValue}
          open={openPopup}
          onClose={handleClosePopup}
          title={fullData?.online_class?.title}
          resourceId={fullData?.id}
          onlineClassId={fullData?.online_class?.id}
          startDate={fullData?.online_class?.start_time}
          endDate={fullData?.online_class?.end_time}
        />
      )}
      {loading && <Loader />}
    </>
  );
};

export default withRouter(DetailCardView);
