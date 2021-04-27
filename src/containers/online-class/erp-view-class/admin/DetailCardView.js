// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useContext, useState, useEffect } from 'react';
// import { Grid, Card, Divider, Button, Popover, Typography } from '@material-ui/core';
// import { useHistory } from 'react-router-dom';
// import CloseIcon from '@material-ui/icons/Close';
// import moment from 'moment';
// import Timer from 'react-compound-timer';
// import axiosInstance from '../../../../config/axios';
// import endpoints from '../../../../config/endpoints';
// import Loader from '../../../../components/loader/loader';
// import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
// import ResourceDialog from '../../../online-class/online-class-resources/resourceDialog';
// import CountdownTimer from './CountdownTimer';
// import './index.css';

// const JoinClass = (props) => {
//   const fullData = props.fullData;
//   const handleClose = props.handleClose;
//   const [loading, setLoading] = useState(false);
//   const { setAlert } = useContext(AlertNotificationContext);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [joinAnchor, setJoinAnchor] = useState(null);
//   const [isAccept, setIsAccept] = useState(props.data ? props.data.is_accepted : false);
//   const [isRejected, setIsRejected] = useState(
//     props.data ? props.data.is_restricted : false
//   );
//   const history = useHistory();

//   const classStartTime = moment(props && props?.data && props?.data?.date).format(
//     'DD-MM-YYYY'
//   );
//   const currDate = moment(new Date()).format('DD-MM-YYYY');

//   const startTime = props && props?.data?.start_time;
//   const currTime = moment(new Date()).format('x');
//   const endTime = new Date(`${props.data.date}T${props?.data?.end_time}`).getTime();
//   const classTimeMilli = new Date(`${props.data.date}T${startTime}`).getTime();
//   const diffTime = classTimeMilli - 5 * 60 * 1000;

//   // console.log(
//   //   classTimeMilli,
//   //   parseInt(currTime),
//   //   diffTime,
//   //   'TTTTTTTTTTT',
//   //   new Date(`${props.data.date}T${startTime}`).getTime()
//   // );

//   const handleCloseData = () => {
//     setAnchorEl(null);
//     // setJoinAnchor(null)
//   };
//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//     // setJoinAnchor(event.currentTarget);
//   };
//   const handleCloseAccept = () => {
//     setJoinAnchor(null);
//   };

//   const handleClickAccept = (event) => {
//     if (diffTime > parseInt(currTime)) {
//       setJoinAnchor(event.currentTarget);
//     } else if (parseInt(currTime) > diffTime || parseInt(currTime) === diffTime) {
//       handleIsAccept();
//     }
//   };

//   const handleIsAccept = () => {
//     const params = {
//       zoom_meeting_id: fullData && fullData.id,
//       class_date: props.data && props.data.date,
//       is_accepted: true,
//     };
//     axiosInstance
//       .put(endpoints.studentViewBatchesApi.rejetBatchApi, params)
//       .then((res) => {
//         setLoading(false);
//         setIsAccept(true);
//       })
//       .catch((error) => {
//         setLoading(false);
//         setAlert('error', error.message);
//       });
//   };

//   const handleIsAttended = () => {
//     const params = {
//       zoom_meeting_id: fullData && fullData.id,
//       class_date: props.data && props.data.date,
//       is_attended: true,
//     };
//     axiosInstance
//       .put(endpoints.studentViewBatchesApi.rejetBatchApi, params)
//       .then((res) => {
//         setLoading(false);
//         setIsAccept(true);
//       })
//       .catch((error) => {
//         setLoading(false);
//         setAlert('error', error.message);
//       });
//   };

//   const handleJoinButton = (callback) => {
//     handleIsAttended();
//     callback();
//   };
//   function handleCancel() {
//     // alert('2')
//     setLoading(true);
//     const params1 = {
//       zoom_meeting_id: fullData && fullData.id,
//       class_date: props.data && props.data.date,
//     };

//     const params2 = {
//       zoom_meeting_id: fullData && fullData.id,
//       class_date: props.data && props.data.date,
//       is_restricted: true,
//     };

//     if (window.location.pathname === '/erp-online-class-student-view') {
//       //url = endpoints.studentViewBatchesApi.rejetBatchApi;
//       axiosInstance
//         .put(endpoints.studentViewBatchesApi.rejetBatchApi, params2)
//         .then((res) => {
//           setLoading(false);
//           setAlert('success', 'Class Rejected');
//           handleClose('success');
//           // handleCloseData();
//         })
//         .catch((error) => {
//           setLoading(false);
//           setAlert('error', error.message);
//         });
//     } else {
//       //url = endpoints.teacherViewBatches.cancelBatchApi;
//       axiosInstance
//         .put(endpoints.teacherViewBatches.cancelBatchApi, params1)
//         .then((res) => {
//           setLoading(false);
//           // handleClick();
//           setAlert('success', 'Class Canceled');
//           handleClose('success');
         
//         })
//         .catch((error) => {
//           setLoading(false);
//           // setAlert('error', error.message);
//         });
//     }
//   }

//   const open = Boolean(anchorEl);
//   const id = open ? 'simple-popover' : undefined;
//   const openJoin = Boolean(joinAnchor);
//   const ids = open ? 'accept-popover' : undefined;
//   return (
//     <Grid container spacing={2} direction='row' alignItems='center'>
//       <Grid item md={6} xs={12}>
//         <span className='TeacherFullViewdescreption1'>
//           {moment(props.data ? props.data.date : '').format('DD-MM-YYYY')}
//         </span>
//       </Grid>

//       {isAccept ? (
//         <Grid item xs={6}>
//           <Button
//             size='small'
//             color='secondary'
//             fullWidth
//             variant='contained'
//             onClick={() =>
//               handleJoinButton(() => window.open(fullData && fullData.join_url))
//             }
//             className='teacherFullViewSmallButtons'
//           >
//             Join
//           </Button>
//         </Grid>
//       ) : (
//         <>
//           {/* {isRejected ? (
//             <Grid item xs={6}>
//               <Typography style={{ color: '#ff6b6b' }}>Rejected</Typography>
//             </Grid>
//           ) : ( */}
//           {endTime < currTime ? (
//             <Button
//               size='small'
//               color='secondary'
//               variant='contained'
//               disabled='true'
//               className='teacherFullViewSmallButtons'
//             >
//               Class Over
//             </Button>
//           ) : isRejected ? (
//             <>
//               <Grid item xs={6}>
//                 <Typography style={{ color: '#ff6b6b' }}>Rejected</Typography>
//               </Grid>
//             </>
//           ) : (
//             <>
//               <Grid item md={3} xs={6}>
//                 {window.location.pathname === '/erp-online-class' ? (
//                   <Button
//                     size='small'
//                     color='secondary'
//                     fullWidth
//                     variant='contained'
//                     onClick={() =>
//                       window.open(fullData && fullData.presenter_url, '_blank')
//                     }
//                     className='teacherFullViewSmallButtons'
//                   >
//                     Audit
//                   </Button>
//                 ) : (
//                   ''
//                 )}
//                 {window.location.pathname === '/erp-online-class-teacher-view' ? (
//                   <Button
//                     size='small'
//                     color='secondary'
//                     fullWidth
//                     variant='contained'
//                     onClick={() =>
//                       window.open(fullData && fullData.presenter_url, '_blank')
//                     }
//                     className='teacherFullViewSmallButtons'
//                   >
//                     Host
//                   </Button>
//                 ) : (
//                   ''
//                 )}
//                 {window.location.pathname === '/erp-online-class-student-view' ? (
//                   <>
//                     <Popover
//                       id={ids}
//                       open={openJoin}
//                       joinAnchor={joinAnchor}
//                       onClose={handleClose}
//                       style={{ overflow: 'hidden', margin: '19% 0 0 30%' }}
//                       className='xyz'
//                       anchorOrigin={{
//                         vertical: 'top',
//                         horizontal: 'center',
//                       }}
//                       transformOrigin={{
//                         vertical: 'top',
//                         horizontal: 'center',
//                       }}
//                     >
//                       <Grid
//                         container
//                         spacing={2}
//                         style={{ textAlign: 'center', padding: '10px' }}
//                       >
//                         <Grid item xs={12} style={{ textAlign: 'right' }}>
//                           <CloseIcon
//                             style={{ color: '#014B7E' }}
//                             onClick={() => handleCloseAccept()}
//                           />
//                         </Grid>
//                         <Grid item md={12} xs={12}>
//                           <Typography>
//                             You Can Join 5mins Before :{' '}
//                             {moment(`${props?.data?.date}T${startTime}`).format(
//                               'hh:mm:ss A'
//                             )}
//                           </Typography>
//                         </Grid>
//                       </Grid>
//                     </Popover>
//                     <Button
//                       size='small'
//                       color='secondary'
//                       fullWidth
//                       variant='contained'
//                       // onClick={handleIsAccept}
//                       onClick={(e) => handleClickAccept(e)}
//                       disabled={classStartTime === currDate ? false : true}
//                       className='teacherFullViewSmallButtons'
//                     >
//                       Accept
//                     </Button>
//                   </>
//                 ) : (
//                   ''
//                 )}
//               </Grid>
//               <Grid item md={3} xs={6}>
//                 <Popover
//                   id={id}
//                   open={open}
//                   anchorEl={anchorEl}
//                   onClose={handleClose}
//                   style={{ overflow: 'hidden' }}
//                   anchorOrigin={{
//                     vertical: 'top',
//                     horizontal: 'center',
//                   }}
//                   transformOrigin={{
//                     vertical: 'top',
//                     horizontal: 'center',
//                   }}
//                 >
//                   <Grid
//                     container
//                     spacing={2}
//                     style={{ textAlign: 'center', padding: '10px' }}
//                   >
//                     <Grid item md={12} xs={12}>
//                       <Typography>Are you sure to Cancel ?</Typography>
//                     </Grid>
//                     <Grid item md={6} xs={12}>
//                       <Button
//                         variant='contained'
//                         size='small'
//                         style={{ fontSize: '11px' }}
//                         onClick={() => handleCloseData()}
//                       >
//                         Cancel
//                       </Button>
//                     </Grid>
//                     <Grid item md={6} xs={12}>
//                       <Button
//                         variant='contained'
//                         color='primary'
//                         style={{ fontSize: '11px' }}
//                         size='small'
//                         onClick={() => handleCancel()}
//                       >
//                         Confirm
//                       </Button>
//                     </Grid>
//                   </Grid>
//                 </Popover>
//                 <Button
//                   size='small'
//                   fullWidth
//                   variant='contained'
//                   onClick={(e) => handleClick(e)}
//                   className='teacherFullViewSmallButtons1'
//                 >
//                   {window.location.pathname === '/erp-online-class-student-view'
//                     ? 'Reject'
//                     : 'Cancel'}
//                 </Button>
//               </Grid>
//             </>
//           )}
//         </>
//       )}
//     </Grid>
//   );
// };

// const DetailCardView = ({
//   fullData,
//   handleClose,
//   viewMoreRef,
//   selectedClassType,
//   selectedGrade,
// }) => {
//   const [noOfPeriods, setNoOfPeriods] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { setAlert } = useContext(AlertNotificationContext);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const history = useHistory();
//   const { role_details } = JSON.parse(localStorage.getItem('userDetails'));
//   /*
//   useEffect(() => {
//     if (fullData) {
//       axiosInstance
//         .get(
//           `erp_user/${
//             fullData  && fullData.id
//           }/online-class-details/`
//         )
//         .then((res) => {
//           setNoOfPeriods(res.data.data);
//         })
//         .catch((error) => setAlert('error', error.message));
//     }
//   }, [fullData]);
//   */
//   // console.log(selectedClassType, '[[[[[[[[[[[[[[[[');
//   useEffect(() => {
//     let detailsURL =
//       window.location.pathname === '/erp-online-class-student-view'
//         ? `erp_user/${fullData && fullData.id}/student-oc-details/`
//         : `erp_user/${fullData && fullData.id}/online-class-details/`;

//     if (fullData) {
//       axiosInstance
//         .get(detailsURL)
//         .then((res) => {
//           // console.log(res.data);
//           setNoOfPeriods(res.data.data);
//         })
//         .catch((error) => setAlert('error', error.message));
//     }
//   }, [fullData, handleClose]);

//   const handleCloseData = () => {
//     setAnchorEl(null);
//   };

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? 'simple-popover' : undefined;

//   const converTime = (info) => {
//     let hour = info.split(':')[0];
//     let min = info.split(':')[1];
//     const part = hour > 12 ? 'PM' : 'AM';
//     min = `${min}`.length === 1 ? `0${min}` : min;
//     hour = hour > 12 ? hour - 12 : hour;
//     hour = `${hour}`.length === 1 ? `0${hour}` : hour;
//     return `${hour}:${min} ${part}`;
//   };

//   // function handleCancel() {
//   //   alert('1')
//   //   setLoading(true);
//   //   const params = {
//   //     zoom_meeting_id: fullData && fullData.id,
//   //     class_date: fullData && fullData?.online_class?.start_time.split('T')[0],
//   //   };
//   //   let url = '';
//   //   if (window.location.pathname === '/erp-online-class-student-view') {
//   //     url = endpoints.studentViewBatchesApi.rejetBatchApi;
//   //   } else {
//   //     url = endpoints.teacherViewBatches.cancelBatchApi;
//   //   }
//   //   axiosInstance
//   //     .put(url, params)
//   //     .then((res) => {
//   //       setLoading(false);
//   //       setAlert('success', res.data.message);
//   //       handleClose('success');
//   //     })
//   //     .catch((error) => {
//   //       setLoading(false);
//   //       setAlert('error', error.message);
//   //     });
//   // }

//   console.log(fullData.online_class.cource_id, selectedGrade, '=====================');
//   const handleAttendance = () => {
//     history.push(`/aol-attendance-list/${fullData.online_class && fullData.id}`);
//   };
//   const handleCoursePlan = () => {
//     if (window.location.pathname === '/erp-online-class-student-view') {
//       sessionStorage.setItem('isErpClass', 2);
//       history.push(
//         `/create/course/${fullData.online_class && fullData.online_class.course_id}/5`
//       );
//     } else if (window.location.pathname === '/erp-online-class-teacher-view') {
//       sessionStorage.setItem('isErpClass', 3);
//       history.push(
//         `/create/course/${fullData.online_class && fullData.online_class.cource_id}/${
//           // selectedGrade.map((el)=>el.id)
//           1
//         }`
//       );
//     } else if (window.location.pathname === '/erp-online-class') {
//       sessionStorage.setItem('isErpClass', 1);
//       history.push(
//         `/create/course/${fullData.online_class && fullData.online_class.cource_id}/${
//           // selectedGrade.map((el)=>el.id)
//           1
//         }`
//       );
//     }
//   };
//   const [openPopup, setOpenPopup] = React.useState(false);
//   const [selectedValue, setSelectedValue] = React.useState('');

//   const handleClickOpen = () => {
//     setOpenPopup(true);
//   };

//   const handleClosePopup = (value) => {
//     setOpenPopup(false);
//     setSelectedValue(value);
//   };

//   return (
//     <>
//       <Grid container spacing={2} ref={viewMoreRef}>
//         <Grid item md={12} xs={12} className='teacherBatchFullViewMainDiv'>
//           <Card className='teacherBatchFullViewMainCard'>
//             <Grid container spacing={2} className='teacherBatchFullViewHeader'>
//               <Grid item xs={12} style={{ textAlign: 'right' }}>
//                 <CloseIcon style={{ color: '#014B7E' }} onClick={() => handleClose()} />
//               </Grid>
//               <Grid item xs={12}>
//                 <Grid container spacing={2}>
//                   <Grid item md={8} xs={8}>
//                     <h4 className='teacherBatchFullCardLable'>
//                       {(fullData &&
//                         fullData.online_class &&
//                         fullData.online_class.title) ||
//                         ''}
//                     </h4>
//                     <h4 className='teacherBatchFullCardLable'>
//                       {(fullData &&
//                         fullData.online_class &&
//                         fullData.online_class.subject &&
//                         fullData.online_class.subject.length !== 0 &&
//                         fullData.online_class.subject.map((item) => (
//                           <span>
//                             {item.subject_name || ''}
//                             &nbsp;
//                           </span>
//                         ))) ||
//                         ''}
//                     </h4>
//                   </Grid>
//                   <Grid item md={4} xs={4}>
//                     <h4 className='teacherBatchFullCardLable'>
//                       {(fullData &&
//                         fullData.join_time &&
//                         converTime(fullData.join_time.split(' ')[1])) ||
//                         ''}
//                     </h4>
//                     <h4 className='teacherBatchFullCardLable'>
//                       {noOfPeriods && noOfPeriods.length}
//                       &nbsp;Periods
//                     </h4>
//                   </Grid>
//                 </Grid>
//               </Grid>
//               {/* 
//                     <IconButton
//                       size='small'
//                       className='teacherBatchFullViewClose'
//                       onClick={() => handleClose()}
//                     >
//                       <CloseIcon className='teacherBatchFullViewCloseIcon' />
//                     </IconButton>
//                   </Grid> */}
//             </Grid>
//             <Grid container spacing={2}>
//               <Grid item md={12} xs={12}>
//                 <span className='TeacherFullViewdescreption'>Periods Date</span>
//               </Grid>
//               <Grid item md={12} xs={12}>
//                 <Divider className='fullViewDivider' />
//                 {noOfPeriods && noOfPeriods.length === 0 && (
//                   <Typography style={{ color: '#ff6b6b', margin: '10px' }}>
//                     No Record found
//                   </Typography>
//                 )}
//                 {noOfPeriods &&
//                   noOfPeriods.length > 0 &&
//                   noOfPeriods.map((data) => (
//                     <JoinClass
//                       data={data}
//                       fullData={fullData}
//                       handleClose={handleClose}
//                     />
//                   ))}

//                 <Divider className='fullViewDivider' />
//               </Grid>
//               <Grid item md={12} xs={12}>
//                 {window.location.pathname !== '/erp-online-class-student-view' ? (
//                   <Button
//                     fullWidth
//                     size='small'
//                     className='teacherFullViewFullButtons'
//                     onClick={handleAttendance}
//                   >
//                     Attendance
//                   </Button>
//                 ) : (
//                   <Button
//                     fullWidth
//                     size='small'
//                     className='teacherFullViewFullButtons'
//                     onClick={handleClickOpen}
//                   >
//                     Resources
//                   </Button>
//                 )}
//                 {selectedClassType && selectedClassType.id !== 0 && (
//                   <Button
//                     fullWidth
//                     size='small'
//                     className='teacherFullViewFullButtons'
//                     onClick={handleCoursePlan}
//                   >
//                     View Course Plan
//                   </Button>
//                 )}
//               </Grid>
//             </Grid>
//           </Card>
//         </Grid>
//       </Grid>
//       <ResourceDialog
//         selectedValue={selectedValue}
//         open={openPopup}
//         onClose={handleClosePopup}
//         title={fullData.online_class.title}
//         resourceId={fullData.id}
//         onlineClassId={fullData.online_class.id}
//         startDate={fullData.online_class.start_time}
//         endDate={fullData.online_class.end_time}
//       />
//       {loading && <Loader />}
//     </>
//   );
// };

// export default DetailCardView;
/* eslint-disable react-hooks/exhaustive-deps */
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
import './index.css';
import { useDispatch } from 'react-redux';
import { attendanceAction } from '../../../../redux/actions/onlineClassActions'
import { Grid, Card, Divider, Button, Popover, Typography,Tooltip,IconButton } from '@material-ui/core';
import { useHistory ,Route,withRouter} from 'react-router-dom';
import {
  AttachFile as AttachFileIcon,
} from '@material-ui/icons';


const JoinClass = (props) => {
  const fullData = props.fullData;
  const handleClose = props.handleClose;
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [joinAnchor, setJoinAnchor] = useState(null);
  const [isAccept, setIsAccept] = useState(props.data ? props.data.is_accepted : false);
  const [isRejected, setIsRejected] = useState(
    props.data ? props.data.is_restricted : false
  );
  const history = useHistory();

  const classStartTime = moment(props && props?.data && props?.data?.date).format(
    'DD-MM-YYYY'
  );
  const currDate = moment(new Date()).format('DD-MM-YYYY');

  const startTime = props && props?.data?.start_time;
  const currTime = moment(new Date()).format('x');
  const endTime = new Date(`${props.data.date}T${props?.data?.end_time}`).getTime();
  const classTimeMilli = new Date(`${props.data.date}T${startTime}`).getTime();
  const diffTime = classTimeMilli - 5 * 60 * 1000;

  // console.log(
  //   classTimeMilli,
  //   parseInt(currTime),
  //   diffTime,
  //   'TTTTTTTTTTT',
  //   new Date(`${props.data.date}T${startTime}`).getTime()
  // );

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

  const handleClickAccept = (event) => {
    if (diffTime > parseInt(currTime)) {
      setJoinAnchor(event.currentTarget);
    } else if (parseInt(currTime) > diffTime || parseInt(currTime) === diffTime) {
      handleIsAccept();
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

  const handleJoinButton = (callback) => {
    handleIsAttended();
    callback();
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


  function handleHost(data) {
    setLoading(true);
    axiosInstance
    .get(`${endpoints.teacherViewBatches.hostApi}?id=${data.id}`)
    .then((res) => {
      setLoading(false);
      if(res?.data?.url){
        window.open(res?.data?.url, '_blank');
      } else {
        setAlert('error', res?.data?.message); 
      }
    })
    .catch((error) => {
      setLoading(false);
      setAlert('error', error.message);
    });
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const openJoin = Boolean(joinAnchor);
  const ids = open ? 'accept-popover' : undefined;
  return (
    <Grid container spacing={2} direction='row' alignItems='center'>
      <Grid item md={6} xs={12}>
        <span className='TeacherFullViewdescreption1'>
          {moment(props.data ? props.data.date : '').format('DD-MM-YYYY')}
        </span>
      </Grid>
      { window.location.pathname === '/erp-online-class-teacher-view' ? (
            <Tooltip title='Attach Question Paper'>
            <IconButton
            onClick={() =>
              history.push({
                pathname: '/erp-online-class/assign/qp',
                state: { data: fullData.online_class.id },
              })}
          
            >
              <AttachFileIcon />
            </IconButton>
          </Tooltip>
          ) : (
            ''
          )
          }
          {
              <Grid item xs={3}>
              <Button
                size='small'
                color='secondary'
                fullWidth
                variant='contained'
                onClick={() =>
                  history.push({
                    pathname: '/erp-online-class/pre-quiz',
                    state: { data: fullData.online_class.id },
                  })}
                
                className='teacherFullViewSmallButtons'
              >
                Quiz
              </Button>
            </Grid>
          }

      {isAccept ? (
        <Grid item xs={6}>
          <Button
            size='small'
            color='secondary'
            fullWidth
            variant='contained'
            onClick={() =>
              handleJoinButton(() => window.open(fullData && fullData.join_url))
            }
            className='teacherFullViewSmallButtons'
          >
            Join
          </Button>
        </Grid>
      ) : (
        <>
          {/* {isRejected ? (
            <Grid item xs={6}>
              <Typography style={{ color: '#ff6b6b' }}>Rejected</Typography>
            </Grid>
          ) : ( */}
          {endTime < currTime ? (
            <Button
              size='small'
              color='secondary'
              variant='contained'
              disabled='true'
              className='teacherFullViewSmallButtons'
            >
              Class Over
            </Button>
          ) : isRejected ? (
            <>
              <Grid item xs={6}>
                <Typography style={{ color: '#ff6b6b' }}>Rejected</Typography>
              </Grid>
            </>
          ) : (
            <>
              <Grid item md={3} xs={6}>
                {window.location.pathname === '/erp-online-class' ? (
                  <Button
                    size='small'
                    color='secondary'
                    fullWidth
                    variant='contained'
                    onClick={() =>
                      window.open(fullData && fullData.presenter_url, '_blank')
                    }
                    className='teacherFullViewSmallButtons'
                  >
                    Audit
                  </Button>
                ) : (
                  ''
                )}
                {window.location.pathname === '/erp-online-class-teacher-view' ? (
                  <Button
                    size='small'
                    color='secondary'
                    fullWidth
                    variant='contained'
                    onClick={()=> handleHost(fullData)}
                    // onClick={() =>
                    //   window.open(fullData && fullData.presenter_url, '_blank')
                    // }
                    className='teacherFullViewSmallButtons'
                  >
                    Host
                  </Button>
                ) : (
                  ''
                )}
                {window.location.pathname === '/erp-online-class-student-view' ? (
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
                            {moment(`${props?.data?.date}T${startTime}`).format(
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
                      disabled={classStartTime === currDate ? false : true}
                      className='teacherFullViewSmallButtons'
                    >
                      Accept
                    </Button>
                  </>
                ) : (
                  ''
                )}
              </Grid>
              <Grid item md={3} xs={6}>
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
                <Button
                  size='small'
                  fullWidth
                  variant='contained'
                  onClick={(e) => handleClick(e)}
                  className='teacherFullViewSmallButtons1'
                >
                  {window.location.pathname === '/erp-online-class-student-view'
                    ? 'Reject'
                    : 'Cancel'}
                </Button>
              </Grid>
            </>
          )}
        </>
      )}
    </Grid>
  );
};

const DetailCardView = ({
  fullData,
  handleClose,
  viewMoreRef,
  selectedClassType,
  selectedGrade,
}) => {
  const [noOfPeriods, setNoOfPeriods] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const { role_details } = JSON.parse(localStorage.getItem('userDetails'));
  /*
  useEffect(() => {
    if (fullData) {
      axiosInstance
        .get(
          `erp_user/${
            fullData  && fullData.id
          }/online-class-details/`
        )
        .then((res) => {
          setNoOfPeriods(res.data.data);
        })
        .catch((error) => setAlert('error', error.message));
    }
  }, [fullData]);
  */
  // console.log(selectedClassType, '[[[[[[[[[[[[[[[[');
  useEffect(() => {
    let detailsURL =
      window.location.pathname === '/erp-online-class-student-view'
        ? `erp_user/${fullData && fullData.id}/student-oc-details/`
        : `erp_user/${fullData && fullData.id}/online-class-details/`;

    if (fullData) {
      axiosInstance
        .get(detailsURL)
        .then((res) => {
          setNoOfPeriods(res.data.data);
        })
        .catch((error) => setAlert('error', error.message));
    }
  }, [fullData, handleClose]);

  const handleCloseData = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
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

  function handleCancel() {
    setLoading(true);
    const params = {
      zoom_meeting_id: fullData && fullData.id,
      class_date: fullData && fullData?.online_class?.start_time.split('T')[0],
    };
    let url = '';
    if (window.location.pathname === '/erp-online-class-student-view') {
      url = endpoints.studentViewBatchesApi.rejetBatchApi;
    } else {
      url = endpoints.teacherViewBatches.cancelBatchApi;
    }
    axiosInstance
      .put(url, params)
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

  const handleAttendance = () => {
    dispatch(attendanceAction(fullData ? fullData.online_class?.start_time : ''));
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

  return (
    <>
      <Grid container spacing={2} ref={viewMoreRef}>
        <Grid item md={12} xs={12} className='teacherBatchFullViewMainDiv'>
          <Card className='teacherBatchFullViewMainCard'>
            <Grid container spacing={2} className='teacherBatchFullViewHeader'>
              <Grid item xs={12} style={{ textAlign: 'right' }}>
                <CloseIcon style={{ color: '#014B7E' }} onClick={() => handleClose()} />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item md={8} xs={8}>
                    <h4 className='teacherBatchFullCardLable'>
                      {(fullData &&
                        fullData.online_class &&
                        fullData.online_class.title) ||
                        ''}
                    </h4>
                    <h4 className='teacherBatchFullCardLable'>
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
                    </h4>
                  </Grid>
                  <Grid item md={4} xs={4}>
                    <h4 className='teacherBatchFullCardLable'>
                      {(fullData &&
                        fullData.join_time &&
                        converTime(fullData.join_time.split(' ')[1])) ||
                        ''}
                    </h4>
                    <h4 className='teacherBatchFullCardLable'>
                      {noOfPeriods && noOfPeriods.length}
                      &nbsp;Periods
                    </h4>
                  </Grid>
                </Grid>
              </Grid>
              {/* 
                    <IconButton
                      size='small'
                      className='teacherBatchFullViewClose'
                      onClick={() => handleClose()}
                    >
                      <CloseIcon className='teacherBatchFullViewCloseIcon' />
                    </IconButton>
                  </Grid> */}
            </Grid>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <span className='TeacherFullViewdescreption'>Periods Date</span>
              </Grid>
              <Grid item md={12} xs={12}>
                <Divider className='fullViewDivider' />
                {noOfPeriods && noOfPeriods.length === 0 && (
                  <Typography style={{ color: '#ff6b6b', margin: '10px' }}>
                    No Record found
                  </Typography>
                )}
                {noOfPeriods &&
                  noOfPeriods.length > 0 &&
                  noOfPeriods.map((data) => (
                    <JoinClass
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
      <ResourceDialog
        selectedValue={selectedValue}
        open={openPopup}
        onClose={handleClosePopup}
        title={fullData.online_class.title}
        resourceId={fullData.id}
        onlineClassId={fullData.online_class.id}
        startDate={fullData.online_class.start_time}
        endDate={fullData.online_class.end_time}
      />
      {loading && <Loader />}
    </>
  );
};

export default withRouter(DetailCardView);
