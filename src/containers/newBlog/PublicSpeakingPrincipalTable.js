import React, { useState, useEffect } from 'react';
import {
  Button as ButtonAnt,
  Table,
  Modal,
  message,
  Select,
  Avatar,
  Comment,
  Spin,
  Tag,
} from 'antd';
import { EyeOutlined, TeamOutlined, UserOutlined, RedoOutlined } from '@ant-design/icons';
import endpoints from '../../config/endpoints';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import axios from 'axios';
import moment from 'moment';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';

const PublicSpeakingPrincipalTable = (props) => {
  let userERP = JSON.parse(localStorage.getItem('userDetails')) || {};
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};
  const { Option } = Select;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openBigModal, setOpenBigModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingBig, setLoadingBig] = useState(false);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const { user_id } = JSON.parse(localStorage.getItem('userDetails')) || {};
  let dataes = JSON?.parse(localStorage?.getItem('userDetails')) || {};
  const [totalSubmitted, setTotalSubmitted] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentListData, setStudentListData] = useState([]);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [bmi, setBmi] = useState('');
  const [bmiDetails, setBmiDetails] = useState([]);
  const [editData, setEditData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [selectedStudentDetails, setSelectedStudentsDetails] = useState([]);
  const [bmiRemarks, setBmiRemarks] = useState('');
  const [visibleVideo, setVisibleVideo] = useState(false);
  const [mediaFiles, setMediaFiles] = useState(null);
  const [permissionState, setPermissionState] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(false);
  const [chatDetails, setChatDetails] = useState([]);
  const [totalCountAssigned, setTotalCountAssigned] = useState(0);
  const [currentPageAssigned, setCurrentPageAssigned] = useState(1);
  const [limitAssigned, setLimitAssigned] = useState(10);
  const [totalPagesAssigned, setTotalPagesAssigned] = useState(0);
  const [totalSubmittedCount, setTotalSubmittedCount] = useState(0);
  const [pageDetails, setPageDetails] = useState({
    total: null,
    current: 1,
  });

  const columns = [
    {
      title: <span className='th-white th-fw-700 '> Sl No.</span>,
      dataIndex: 'student_name',
      key: 'student_name',
      align: 'center',
      width: '10%',
      render: (text, row, index) => {
        return <span>{index + 1 + (currentPageAssigned - 1) * 10}</span>;
      },
    },
    {
      title: <span className='th-white th-fw-700 '> Activity Name</span>,
      dataIndex: 'student_name',
      key: 'student_name',
      align: 'center',
      render: (text, row) => {
        return <span>{row?.name}</span>;
      },
    },
    {
      title: <span className='th-white th-fw-700 '>Activity Description</span>,
      dataIndex: 'weight',
      key: 'weight',
      align: 'center',
      render: (text, row) => <span>{row?.description}</span>,
    },
    {
      title: <span className='th-white th-fw-700 '>Teacher</span>,
      dataIndex: 'weight',
      key: 'weight',
      align: 'center',
      render: (text, row) => <span>{row?.teacher_name}</span>,
    },
    {
      title: <span className='th-white th-fw-700 '>Submission Date</span>,
      dataIndex: 'gender',
      key: 'gender',
      align: 'center',
      render: (text, row) => {
        return <span>{moment(row?.scheduled_time).format('MMMM Do YYYY')}</span>;
      },
    },
    {
      title: <span className='th-white th-fw-700 '>Videos Uploaded</span>,
      dataIndex: 'weight',
      key: 'weight',
      align: 'center',
      width: '10%',
      render: (text, row) => <Tag color='volcano'>{row?.student_submitted_count}</Tag>,
    },
    {
      title: <span className='th-white th-fw-700 '>Action</span>,
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (text, row) => (
        <>
          <span style={{ margin: '0.5rem 1rem' }}>
            <ButtonAnt
              type='primary'
              icon={<TeamOutlined />}
              size={'medium'}
              onClick={() => showBigModal(row)}
            >
              Student List
            </ButtonAnt>
          </span>
        </>
      ),
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showBigModal = (data) => {
    if (data) {
      setOpenBigModal(true);
      StudentCheckFun(data);
      setRowData(data);
    }
  };

  useEffect(() => {
    StudentCheckFun(rowData);
  }, [pageDetails?.current]);

  const columnMarks = [
    {
      title: <span className='th-white pl-sm-0 pl-4 th-fw-600 '>Criteria</span>,
      align: 'left',
      width: '50%',
      render: (text, row) => {
        return row.criterion;
      },
    },
    {
      title: <span className='th-white th-fw-600'>Remarks</span>,
      align: 'center',
      width: '50%',
      render: (text, row) => row?.levels?.filter((item) => item.status == true)[0].name,
    },
  ];

  const columnsBigTable = [
    {
      title: <span className='th-white th-fw-700 '>Sl No.</span>,
      dataIndex: 'height',
      key: 'height',
      align: 'center',
      render: (text, row, index) => (
        <span>{(pageDetails.current - 1) * 10 + index + 1}.</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700 '>Student Name</span>,
      dataIndex: 'height',
      key: 'height',
      align: 'center',
      render: (text, row) => <span>{row?.user_name}</span>,
    },
    {
      title: <span className='th-white th-fw-700 '>ERP ID</span>,
      dataIndex: 'weight',
      key: 'weight',
      align: 'center',
      render: (text, row) => <span>{row?.user_erp_id}</span>,
    },
    {
      title: <span className='th-white th-fw-700 '>Action</span>,
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (text, row) => (
        <>
          <Tag
            icon={<EyeOutlined />}
            style={{ cursor: 'pointer' }}
            color='processing'
            onClick={() => handleShowStudent(row)}
          >
            View Activity
          </Tag>
        </>
      ),
    },
  ];

  console.log({ props, totalSubmitted });
  const erpAPI = () => {
    setLoadingBig(true);
    axios
      .get(
        `${endpoints.newBlog.getIndividualActivity}?branch=${
          props?.selectedBranch
        }&grade=${props?.selectedGrade}&section=${
          props?.selectedSubject
        }&offset=${0}&finished=${'True'}&start_date=${props?.startDate}&end_date=${
          props?.endDate
        }&page=${currentPageAssigned}&page_size=${limitAssigned}&user_id=${
          props?.activityUserId
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        if (response?.data?.status_code == 200) {
          setTotalCountAssigned(response?.data?.result?.count);
          setTotalPagesAssigned(response?.data?.result?.page_size);
          // setCurrentPageAssigned(response?.data?.result?.page);
          setTotalSubmitted(response?.data?.result?.activities);
          setTotalSubmittedCount(response?.data?.result?.overall_submitted_count);
          props.setFlag(false);
          setLoadingBig(false);
        } else {
          message.error(response?.data?.message);
          setLoadingBig(false);
        }
      });
  };

  useEffect(() => {
    if (
      props.selectedBranch === undefined ||
      props.selectedGrade === undefined ||
      props.selectedGrade == '' ||
      props.selectedSubject?.length === 0 ||
      props.selectedSubject === undefined
    ) {
      setTotalSubmitted([]);
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag, props.selectedSubject]);

  useEffect(() => {
    if (props.flag) {
      getTotalSubmitted();
    }
  }, [
    props.selectedBranch,
    props.selectedGrade,
    props.flag,
    props.startDate,
    props.endDate,
  ]);

  const StudentCheckFun = (data) => {
    setSelectedStudentsDetails([]);
    if (data) {
      setSelectedStudentsDetails(data);
      setLoading(true);
      axios
        .get(
          `${endpoints.newBlog.getStudentPublicView}?activity_id=${data?.id}&page=${pageDetails?.current}`,
          {
            headers: {
              Authorization: `${token}`,
              'X-DTS-HOST': X_DTS_HOST,
            },
          }
        )
        .then((response) => {
          if (response?.data?.status_code == 200) {
            setStudentListData(response?.data?.result);
            setPageDetails({ ...pageDetails, total: response.data?.count });
            // setOpenBigModal(true);
            setLoading(false);
          } else {
            setLoading(false);
            setOpenBigModal(false);
            return;
          }
        });
    }
  };

  const getTotalSubmitted = () => {
    if (props) {
      handlePaginationAssign(1);
      erpAPI();
    }
  };

  useEffect(() => {
    erpAPI();
  }, [currentPageAssigned]);

  const handleShowStudent = (data) => {
    if (data) {
      setLoading(true);

      let rating = JSON.parse(data?.grading?.grade_scheme_markings);
      setSelectedActivity(rating);
      setPermissionState(data?.state);

      axios
        .get(`${endpoints.newBlog.studentPSContentApi}?asset_id=${data?.asset?.id}`, {
          headers: {
            // Authorization: `${token}`,
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((response) => {
          if (response?.data?.status_code == 200) {
            getWhatsAppDetails({
              erp_id: response?.data?.result?.user?.username,
              created_at__date__gte: response?.data?.result?.created_at__date__gte,
              created_at__date__lte: response?.data?.result?.created_at__date__lte,
              activity_id: response?.data?.result?.activity,
            });
            setLoading(false);
            // message.success(response?.data?.message);
            setMediaFiles(response?.data?.result);
            setVisibleVideo(true);
            return;
          } else {
            setVisibleVideo(false);
            setLoading(false);
            return;
          }
        })
        .catch((err) => {
          setLoading(false);
          message.error(err);
        });
    }
  };

  const getWhatsAppDetails = (params = {}) => {
    axios
      .get(`${endpoints.newBlog.whatsAppChatGetApi}`, {
        params: { ...params },
        headers: {
          HOST: X_DTS_HOST,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setChatDetails(response?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePaginationAssign = (page) => {
    setCurrentPageAssigned(page);
  };

  return (
    <>
      <div className='row'>
        <div className='col-12'>
          <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
            {totalSubmitted?.length > 0 ? (
              <Tag color='blue'>
                Total Videos Uploaded : {totalSubmittedCount} (
                {moment(props.startDate).format('MMMM Do')} -{' '}
                {moment(props.endDate).format('MMMM Do')})
              </Tag>
            ) : null}
          </p>
        </div>
        <div className='col-12'>
          {/* {loadingBig ? (
            <div className='d-flex justify-content-center py-5'>
              <Spin size='medium' tip='Loading...' />{' '}
            </div>
          ) : null} */}
          {totalSubmitted?.length > 0 ? (
            <Table
              className='th-table'
              rowClassName={(record, index) =>
                `'th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
              }
              pagination={{
                total: totalCountAssigned,
                current: Number(currentPageAssigned),
                pageSize: limitAssigned,
                showSizeChanger: false,
                onChange: (e) => {
                  handlePaginationAssign(e);
                },
              }}
              loading={loadingBig}
              columns={columns}
              dataSource={totalSubmitted}
              scroll={{ y: '50vh' }}
            />
          ) : (
            <div
              className='row justify-content-center mt-5'
              style={{ minHeight: '50vh' }}
            >
              <img src={NoDataIcon} />
            </div>
          )}
        </div>
      </div>
      <Modal
        title={`Students Details`}
        visible={openBigModal}
        className='th-upload-modal'
        centered
        open={openBigModal}
        onOk={() => {
          setOpenBigModal(false);
          setPageDetails({ ...pageDetails, current: 1 });
          setStudentListData([]);
        }}
        onCancel={() => {
          setOpenBigModal(false);
          setPageDetails({ ...pageDetails, current: 1 });
          setStudentListData([]);
        }}
        width={1000}
        zIndex={1000}
        footer={null}
      >
        <div className='row'>
          <div
            className='col-12 px-3'
            style={{ display: 'flex', borderRadius: '10px', padding: '0.5rem 1rem' }}
          >
            <div className='col-4'>
              Total Students Submitted Count :{' '}
              {selectedStudentDetails?.student_submitted_count}
            </div>
          </div>
          <div className='row d-flex px-3 justify-content-end'>
            <div className='col-md-5 px-0 col-12 d-flex justify-content-end'>
              <Modal
                title='View Activity'
                className='th-upload-modal'
                centered
                visible={visibleVideo}
                open={visibleVideo}
                zIndex={1300}
                destroyOnClose={true}
                footer={false}
                onCancel={() => setVisibleVideo(false)}
                // width={
                //   window.innerWidth < 600
                //     ? '95vw'
                //     : mediaFiles?.signed_URL
                //     ? permissionState === 'graded'
                //       ? '70vw'
                //       : '40vw'
                //     : '60vw'
                // }
                width={'80vw'}
              >
                <div>
                  <div className='row p-3'>
                    {/* <div
                      className={
                        mediaFiles?.signed_URL
                          ? permissionState === 'graded'
                            ? 'col-md-7'
                            : 'col-md-12'
                          : 'd-none'
                      }
                    > */}
                    <div className='col-md-7'>
                      <video
                        src={mediaFiles?.signed_URL}
                        controls
                        preload='auto'
                        className='th-br-5'
                        alt={'image'}
                        style={{
                          maxHeight: '650px',
                          width: '100%',
                          objectFit: 'fill',
                        }}
                      />
                    </div>
                    <div
                      className={`${
                        mediaFiles?.signed_URL ? 'col-md-5' : 'col-12'
                      } px-0 th-bg-white`}
                    >
                      <div className='row'>
                        {permissionState === 'graded' ? (
                          <div className='col-12 px-1'>
                            <div className='mt-3'>
                              <div className='th-fw-500 th-16 mb-2'>Remarks</div>
                              <div
                                className='px-1 py-2 th-br-5'
                                style={{ outline: '1px solid #d9d9d9' }}
                              >
                                <Table
                                  className='th-table'
                                  columns={columnMarks}
                                  loading={loading}
                                  dataSource={selectedActivity}
                                  pagination={false}
                                  rowClassName={(record, index) =>
                                    index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                                  }
                                  scroll={{ y: 400 }}
                                />
                              </div>
                            </div>
                          </div>
                        ) : null}

                        <div className='col-12 px-1'>
                          <div className='row mt-2 align-item-center'>
                            <div className='col-6 px-0'>
                              <span className='th-18 th-fw-600'>
                                Comments
                                {chatDetails?.length > 0
                                  ? `(${chatDetails?.length})`
                                  : null}
                              </span>
                            </div>
                            <div className='col-6 text-right'>
                              <span
                                className='th-pointer'
                                onClick={() =>
                                  getWhatsAppDetails({
                                    erp_id: mediaFiles?.user?.username,
                                    created_at__date__gte:
                                      mediaFiles?.created_at__date__gte,
                                    created_at__date__lte:
                                      mediaFiles?.created_at__date__lte,
                                    activity_id: mediaFiles?.activity,
                                  })
                                }
                              >
                                <RedoOutlined />
                              </span>
                            </div>

                            <div
                              className='row'
                              style={{
                                display: 'block',
                                overflow: 'auto',
                                maxHeight: permissionState === 'graded' ? '25vh' : '65vh',
                              }}
                            >
                              {chatDetails.length > 0 ? (
                                <>
                                  {chatDetails.map((item, index) => {
                                    if (item?.is_reply == true) {
                                      return (
                                        <Comment
                                          author={
                                            <div className='th-fw-500 th-16'>
                                              {item?.name}
                                            </div>
                                          }
                                          avatar={
                                            <Avatar size={40} icon={<UserOutlined />} />
                                          }
                                          content={<p>{item?.message}</p>}
                                          datetime={
                                            <>
                                              <div
                                                title={moment(item?.sent_at).format(
                                                  'MMM Do,YYYY'
                                                )}
                                              >
                                                {moment(item?.sent_at).format(
                                                  'MMM Do,YYYY'
                                                )}
                                              </div>
                                            </>
                                          }
                                        />
                                      );
                                    }
                                  })}
                                </>
                              ) : (
                                <div className='th-16 th-fw-400 d-flex align-items-center justify-content-center '>
                                  No Comments Submitted
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* ) : null} */}
                  </div>
                </div>
              </Modal>
            </div>
          </div>
          <div className='col-12 pb-2'>
            <Table
              className='th-table'
              rowClassName={(record, index) =>
                `'th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
              }
              pagination={{
                total: pageDetails.total,
                current: pageDetails.current,
                pageSize: 10,
                showSizeChanger: false,
                onChange: (page) => {
                  setPageDetails({ ...pageDetails, current: page });
                },
                limit: 20,
              }}
              loading={loading}
              columns={columnsBigTable}
              dataSource={studentListData}
              scroll={{ y: 300 }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PublicSpeakingPrincipalTable;
