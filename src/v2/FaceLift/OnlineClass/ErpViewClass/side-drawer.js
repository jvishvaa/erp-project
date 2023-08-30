import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { message, Table, Empty, Button, Tooltip, Space, Popover, Popconfirm } from 'antd';
import APIREQUEST from 'config/apiRequest';
import axiosInstance from 'config/axios';
import { attendanceAction } from 'redux/actions';
import GoogleIcon from 'assets/images/google.png';
import ZOOMICON from '../../../../assets/images/zoom.png';
import edxtag from 'assets/images/edxtag.jpeg';
import { FileAddFilled, FileAddTwoTone } from '@ant-design/icons';
import UploadDialogBox from '../../../../containers/online-class/erp-view-class/admin/UploadDialogBox';
import endpoints from 'config/endpoints';
import moment from 'moment';
import ResourceDialog from '../../../../containers/online-class/online-class-resources/resourceDialog';
// import Loader from '../../../../components/loader/loader';

const JoinClass = (props) => {
  const { setLoading, getClassName, historicalData } = props;
  const fullData = props.fullData;
  const handleClose = props.handleClose;
  const [anchorEl, setAnchorEl] = useState(null);
  const [joinAnchor, setJoinAnchor] = useState(null);
  const [classWorkDialog, setDialogClassWorkBox] = useState(false);
  const [isClassWork, setIsClassWork] = useState(props.data.is_classwork);
  const [classOver, setClassOver] = useState(false);

  useEffect(() => {
    setIsClassWork(props?.data?.is_classwork);
  }, [props]);

  const history = useHistory();

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
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
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
      message.error(
        `You Can Join 5mins Before: ${moment(
          `${props?.data?.date}T${startTimeProp}`
        ).format('hh:mm:ss A')}`
      );
      return;
    } else if (endTime >= currentTime && currentTime >= diffTime) {
      handleJoinButton();
    } else {
      setClassOver(true);
      message.error('Class has ended!');
    }
  };

  const msApiMarkAttandance = (params) => {
    APIREQUEST('put', '/oncls/v1/mark-attendance/', params)
      .then((res) => {
        setLoading(false);
        if (res.data.status_code == 200) {
          if (params?.is_attended) {
            openZoomClass(fullData?.join_url);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.message);
      });
  };

  const apiMarkAttendance = (params) => {
    axiosInstance
      .put(endpoints.studentViewBatchesApi.rejetBatchApi, params)
      .then((res) => {
        setLoading(false);
        if (res.data.status_code == 200) {
          if (params?.is_attended) {
            openZoomClass(fullData?.join_url);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.message);
      });
  };

  const handleIsAttended = () => {
    const params = {
      zoom_meeting_id: fullData && fullData.id,
      class_date: props.data && props.data.date,
      is_attended: true,
      is_accepted: true,
    };
    if (JSON.parse(localStorage.getItem('isMsAPI')) && historicalData === false) {
      msApiMarkAttandance(params);
      return;
    }
    apiMarkAttendance(params);
  };

  const openZoomClass = (url) => {
    if (navigator.userAgent.indexOf('iPhone') >= 0) {
      window.location.assign(url);
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.click();
    link.remove();
  };

  const handleJoinButton = () => {
    const currentTime = getCurrentTime();
    if (endTime >= currentTime) {
      handleIsAttended();
    } else {
      setClassOver(true);
      message.error('Class has ended!');
    }
  };

  const msAPIhandleCancel = (url, params) => {
    APIREQUEST('put', url, params)
      .then((res) => {
        setLoading(false);
        message.success(res.data.message);
        handleClose('success');
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.message);
      });
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
      axiosInstance
        .put(endpoints.studentViewBatchesApi.rejetBatchApi, params2)
        .then((res) => {
          setLoading(false);
          message.success('Class Rejected');
          handleClose('success');
        })
        .catch((error) => {
          setLoading(false);
          message.error(error.message);
        });
    } else {
      if (JSON.parse(localStorage.getItem('isMsAPI')) && historicalData === false) {
        msAPIhandleCancel('/oncls/v1/class-cancel/', params1);
        return;
      }
      axiosInstance
        .put(endpoints.teacherViewBatches.cancelBatchApi, params1)
        .then((res) => {
          setLoading(false);
          message.success(res.data.message);
          handleClose('success');
        })
        .catch((error) => {
          setLoading(false);
          message.error(error.message);
        });
    }
  }
  const handleTakeQuiz = (fullData) => {
    if (fullData && fullData.online_class && fullData.online_class.question_paper_id) {
      let { assessment_id, is_erp_qp } = fullData?.online_class;
      history.push({
        pathname: `/erp-online-class/${fullData.online_class.id}/${fullData.online_class.question_paper_id}/pre-quiz`,
        state: {
          data: fullData.online_class.id,
          assessment_id: assessment_id,
          is_erp_qp: is_erp_qp,
        },
      });
    } else {
      message.error('This onlineclass does not have quiz associated with it.');
      return;
    }
  };

  const [disableHost, setDisableHost] = useState(false);

  const handleHostDisable = () => {
    // console.log(fullData, 'row');
    let disableFlag = false;
    const isActiveEnd = endTime;
    const isActiveStart = startTime - 5 * 60 * 1000;
    // console.log(startTime, 'startTime');
    // console.log(endTime, 'endTime');
    // console.log(isActiveStart, 'isActiveStart');
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
    if (
      window.location.pathname === '/erp-online-class-teacher-view' ||
      window.location.pathname === '/erp-online-class'
    ) {
      handleHostDisable();
    }
  }, [new Date().getSeconds(), props]);

  const msApihandleHost = (data) => {
    APIREQUEST('get', `/oncls/v1/zoom-redirect/?id=${data.id}`)
      .then((res) => {
        setLoading(false);
        if (res?.data?.url) {
          // window.open(res?.data?.url, '_blank');
          openZoomClass(res?.data?.url);
        } else {
          message.error(res?.data?.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.message);
      });
  };

  function handleHost(data) {
    if (!handleHostDisable()) {
      // setLoading(true);
      if (JSON.parse(localStorage.getItem('isMsAPI')) && historicalData === false) {
        msApihandleHost(data);
        return;
      }
      axiosInstance
        .get(`${endpoints.teacherViewBatches.hostApi}?id=${data.id}`)
        .then((res) => {
          setLoading(false);
          if (res?.data?.url) {
            // window.open(res?.data?.url, '_blank');
            openZoomClass(res?.data?.url);
          } else {
            message.error(res?.data?.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          message.error(error.message);
        });
    } else {
      setDisableHost(true);
      message.error("Class can't be started now");
    }
  }

  const isClassStartted = () => {
    let disableFlag = false;
    if (new Date().getTime() >= startTime) {
      disableFlag = false;
    } else {
      disableFlag = true;
    }
    return disableFlag;
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const openJoin = Boolean(joinAnchor);
  const ids = open ? 'accept-popover' : undefined;

  return (
    <>
      <div>
        <div className='row'>
          <div className='th-16 mb-3 pr-3'>
            <span>{moment(props.data ? props.data.date : '').format('DD-MM-YYYY')}</span>
          </div>
          {fullData.online_class.question_paper_id == 0 ? (
            <div className='pl-3'>
              {/* {window.location.pathname === '/erp-online-class-teacher-view' && (
                <Tooltip title='Attach Question Paper'>
                  <FileAddTwoTone
                    style={{ fontSize: '24px' }}
                    onClick={() =>
                      history.push({
                        pathname: `/erp-online-class/assign/${fullData.online_class.id}/qp`,
                        state: {
                          data: fullData.online_class.id,
                          historicalData: historicalData,
                        },
                      })
                    }
                  />
                </Tooltip>
              )} */}
            </div>
          ) : (
            <div>
              {window.location.pathname === '/erp-online-class-teacher-view' && (
                <div className='pl-3'>
                  {/* <Button
                    type='primary'
                    className='btn-block th-br-4 th-14'
                    onClick={() =>
                      history.push({
                        pathname: `/erp-online-class/${fullData.online_class.id}/${fullData.online_class.question_paper_id}/pre-quiz`,
                        state: {
                          data: fullData.online_class.id,
                          assessment_id: fullData?.online_class?.assessment_id,
                          is_erp_qp: fullData?.online_class?.is_erp_qp,
                        },
                      })
                    }
                    disabled={props?.data?.is_cancelled ? true : isClassStartted()}
                  >
                    Launch Quiz
                  </Button> */}
                </div>
              )}
            </div>
          )}
        </div>
        <div className='row'>
          {window.location.pathname === '/erp-online-class-student-view' ? (
            <>
              <div>
                {/* <Button
                  type='primary'
                  className='btn-block th-br-4 th-14'
                  onClick={() => handleTakeQuiz(fullData)}
                  disabled={
                    props?.data?.class_status?.toLowerCase() === 'cancelled'
                      ? true
                      : isClassStartted() ||
                        fullData?.online_class?.question_paper_id === 0
                  }
                >
                  Take Quiz
                </Button> */}
              </div>

              <div>
                {isClassWork && (
                  <Button
                    type='primary'
                    className='btn-block th-br-4 th-14'
                    onClick={() => {
                      setDialogClassWorkBox(true);
                    }}
                    disabled={
                      isClassStartted() ||
                      props?.data?.class_status?.toLowerCase() === 'cancelled'
                    }
                  >
                    Class Work
                  </Button>
                )}
                {classWorkDialog && (
                  <UploadDialogBox
                    historicalData={historicalData}
                    periodData={props?.data}
                    setLoading={setLoading}
                    fullData={fullData}
                    classWorkDialog={classWorkDialog}
                    OpenDialogBox={handleOpenClassWorkDialogBox}
                  />
                )}
              </div>
            </>
          ) : (
            ''
          )}
          {window.location.pathname === '/erp-online-class-teacher-view' ? (
            <>
              <div>
                {isClassWork && (
                  <div className='pr-3'>
                    <Button
                      type='primary'
                      className='btn-block th-br-4 th-14'
                      onClick={() => {
                        const { id = '', online_class = {} } = fullData || {};
                        const { id: onlineClassId = '', start_time = '' } =
                          online_class || {};
                        history.push({
                          pathname: `/erp-online-class/class-work/${onlineClassId}/${id}/${props.data.date}`,
                          state: { historicalData: historicalData },
                        });
                      }}
                      disabled={isClassStartted() || props?.data?.is_cancelled}
                    >
                      Class Work
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            ''
          )}

          {window.location.pathname === '/erp-online-class-student-view' && (
            <div>
              {/* {endTime >= getCurrentTime() && !classOver ? (
                <div className='pl-3'>
                  <Button
                    type='primary'
                    className='btn-block th-br-4 th-14'
                    disabled={props?.data?.class_status?.toLowerCase() === 'cancelled'}
                    onClick={(e) => handleClickAccept(e)}
                  >
                    Join
                  </Button>
                </div>
              ) : (
                <div className='pl-3'>
                  <Button
                    type='primary'
                    className='btn-block th-br-4 th-14'
                    disabled='true'
                  >
                    Class Over
                  </Button>
                </div>
              )} */}
            </div>
          )}

          {(window.location.pathname === '/erp-online-class-teacher-view' ||
            window.location.pathname === '/erp-online-class') && (
            <>
              {endTime < getCurrentTime() && !classOver ? (
                <div>
                  <Button
                    type='primary'
                    className='btn-block th-br-4 th-14'
                    disabled='true'
                  >
                    Class Over
                  </Button>
                </div>
              ) : (
                <>
                  <div>
                    {window.location.pathname === '/erp-online-class' && (
                      <div>
                        {/* <Button
                          type='primary'
                          className='btn-block th-br-4 th-14'
                          disabled={disableHost || props?.data?.is_cancelled}
                          onClick={() => {
                            if (email !== props?.fullData?.online_class?.teacher?.email) {
                              // window.open(fullData && fullData?.join_url, '_blank');
                              openZoomClass(fullData?.join_url);
                            }
                            if (email === props?.fullData?.online_class?.teacher?.email) {
                              // window.open(fullData && fullData?.presenter_url, '_blank');
                              openZoomClass(fullData?.presenter_url);
                            }
                          }}
                        >
                          {email === props?.fullData?.online_class?.teacher?.email
                            ? 'Host'
                            : 'Audit'}
                        </Button> */}
                      </div>
                    )}
                    {window.location.pathname === '/erp-online-class-teacher-view' && (
                      <div>
                        {/* <Button
                          type='primary'
                          className='btn-block th-br-4 th-14'
                          disabled={disableHost || props?.data?.is_cancelled}
                          onClick={() => handleHost(fullData)}
                        >
                          Host
                        </Button> */}
                      </div>
                    )}
                  </div>
                  <div>
                    {window.location.pathname !== '/erp-online-class-student-view' && (
                      <Popconfirm
                        title='Are you sure to Cancel ?'
                        onConfirm={() => handleCancel()}
                        onClose={() => handleCloseData()}
                        overlayStyle={{ zIndex: 2001 }} // Adjust the z-index value as needed
                      >
                        <div>
                          <Button
                            type='primary'
                            className='btn-block th-br-4 th-14'
                            disabled={props?.data?.is_cancelled}
                            variant='contained'
                            onClick={(e) => handleClick(e)}
                          >
                            {props?.data?.is_cancelled ? 'Cancelled' : 'Cancel'}
                          </Button>
                        </div>
                      </Popconfirm>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

const SideDrawer = ({
  tabValue,
  fullData,
  handleClose,
  viewMoreRef,
  loading,
  setLoading,
  index,
  historicalData,
}) => {
  const [loadingDrawer, setLoadingDrawer] = useState(false);
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
      response.filter(
        (element) => element?.class_status?.toLowerCase() === bifuracionArray[tabValue]
      ) || []
    );
  };

  const msCallData = () => {
    setLoadingDrawer(true);
    let detailsURL =
      window.location.pathname === '/erp-online-class-student-view'
        ? `/oncls/v1/${fullData?.id}/student-oncls-details/`
        : `/oncls/v1/${fullData?.id}/oncls-details/`;
    APIREQUEST('get', detailsURL)
      .then((res) => {
        handleMscallResponse(res);
        setLoadingDrawer(false);
      })
      .catch((error) => {
        setLoadingDrawer(false);
        message.error(error.message);
      });
  };

  const handleMscallResponse = (res) => {
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
      message.error(res?.data?.message);
    }
  };

  const handleCallaData = () => {
    if (JSON.parse(localStorage.getItem('isMsAPI')) && historicalData === false) {
      msCallData();
      return;
    }
    let detailsURL =
      window.location.pathname === '/erp-online-class-student-view'
        ? `erp_user/${fullData && fullData.id}/student-oc-details/`
        : `erp_user/${fullData && fullData.id}/online-class-details/`;

    if (fullData) {
      setLoadingDrawer(true);
      axiosInstance
        .get(detailsURL)
        .then((res) => {
          setLoadingDrawer(false);
          handleMscallResponse(res);
        })
        .catch((error) => {
          setLoadingDrawer(false);
          message.error(error.message);
        });
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
      history.push({
        pathname: `/erp-attendance-list/${fullData.online_class && fullData.id}`,
        state: { historicalData: historicalData },
      });
    }
    if (
      window.location.pathname === '/online-class/view-class' ||
      window.location.pathname === '/online-class/teacher-view-class'
    )
      history.push({
        pathname: `/aol-attendance-list/${fullData.online_class && fullData.id}`,
        state: { historicalData: historicalData },
      });
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

  const columns = [
    {
      title: (
        <span style={{ fontSize: '20px', fontWeight: 600 }} className='th-white '>
          <div
            className='row'
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              className='row mb-3'
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div className='pr-4'>
                <img
                  style={{ maxHeight: '50px', background: 'white' }}
                  src={
                    fullData?.join_url?.includes('edxstream')
                      ? edxtag
                      : fullData?.join_url?.includes('google')
                      ? GoogleIcon
                      : ZOOMICON
                  }
                />
              </div>
              <div className='pl-4 py-2' style={{ textAlign: 'end' }}>
                {noOfPeriods?.length} &nbsp;
                {noOfPeriods?.length > 1 ? 'Periods' : 'Period'}
              </div>
            </div>

            <div>
              {' '}
              {/* {fullData?.online_class?.title} */}
              {fullData?.online_class?.title.length > 25 ? (
                <Tooltip
                  autoAdjustOverflow='false'
                  placement='bottomLeft'
                  title={fullData?.online_class?.title}
                  overlayStyle={{ zIndex: '2001', maxWidth: '30%', minWidth: '20%' }}
                >
                  {`${fullData.online_class?.title.substring(0, 25)}...`}
                </Tooltip>
              ) : (
                fullData?.online_class?.title
              )}
            </div>
          </div>

          <div>
            <div>
              {' '}
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
            </div>
            <div>
              {(fullData &&
                fullData.join_time &&
                converTime(fullData.join_time.split(' ')[1])) ||
                ''}
            </div>
          </div>
        </span>
      ),
      dataIndex: 'title',
      render: (data, row) => (
        <Space>
          <JoinClass
            historicalData={historicalData}
            setLoading={setLoading}
            data={row}
            fullData={fullData}
            handleClose={handleClose}
          />
        </Space>
      ),
    },
  ];
  const noDataLocale = {
    emptyText: (
      <div className='d-flex justify-content-center mt-5 th-grey'>
        <Empty description={'No record found'} />
      </div>
    ),
  };

  return (
    <>
      {/* {loading && <Loader />} */}
      <div>
        <Table
          columns={columns}
          dataSource={noOfPeriods}
          pagination={false}
          loading={loadingDrawer}
          className='th-table'
          locale={noDataLocale}
          rowClassName={(record, index) =>
            index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
          }
          scroll={{
            y: '55vh',
          }}
        />
        <div>
          {window.location.pathname !== '/erp-online-class-student-view' ? (
            <div className='mt-3'>
              <Button
                type='primary'
                className='btn-block th-br-4 th-16'
                onClick={handleAttendance}
              >
                Attendance
              </Button>
            </div>
          ) : (
            <div className='mt-3'>
              <Button
                type='primary'
                className='btn-block th-br-4 th-16'
                onClick={handleClickOpen}
              >
                Resources
              </Button>
            </div>
          )}
        </div>
      </div>
      {openPopup && (
        <ResourceDialog
          historicalData={historicalData}
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
    </>
  );
};

export default withRouter(SideDrawer);
