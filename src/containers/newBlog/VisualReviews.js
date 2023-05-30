import React, { useState, useEffect, useRef } from 'react';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import {
  FileProtectOutlined,
  UserOutlined,
  PlayCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import {
  Button,
  Tag,
  Avatar,
  Select,
  Tooltip,
  Table,
  Drawer,
  Space,
  Input,
  message,
} from 'antd';
import endpoints from '../../config/endpoints';
import ReactPlayer from 'react-player';
import moment from 'moment';
import axios from 'axios';

const VisualReviews = (props) => {
  const [value, setValue] = React.useState();
  const { Option } = Select;
  const playerRef = useRef(null);
  const [totalSubmitted, setTotalSubmitted] = useState([]);
  //   const PhysicalsubActivityData = JSON.parse(localStorage.getItem('PhysicalsubActivityData')) || {};
  const subActivityData = JSON.parse(localStorage.getItem('VisualActivityId')) || {};
  const [dataId, setDataId] = useState();
  let datas = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [values, setValues] = useState();
  const [imageData, setImageData] = useState();
  const [maxWidth, setMaxWidth] = React.useState('70px');
  const [submit, setSubmit] = useState(false);
  const [ratingReview, setRatingReview] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isClicked, setIsClicked] = useState(false);
  const [buttonFlag, setButtonFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState([]);

  let array = [];
  const getRatingView = (data) => {
    setLoading(true);
    showMedia(data);
    axios
      .get(`${endpoints.newBlog.studentReviewss}?booking_detail_id=${data}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        response.data.map((obj) => {
          let temp = {};
          temp['id'] = obj.id;
          temp['name'] = obj.level.name;
          temp['remarks'] = JSON.parse(obj.remarks);
          temp['given_rating'] = obj.given_rating;
          temp['level'] = obj?.level?.rating;
          array.push(temp);
        });
        setRatingReview(array);
        setLoading(false);
      });
  };

  const getTotalSubmitted = () => {
    if (props) {
      setLoading(true);

      axios
        .get(
          `${endpoints.newBlog.studentSideApi}?user_id=null&activity_detail_id=${subActivityData?.id}&is_reviewed=True&is_submitted=True&update=True&grade_id=${props.selectedGrade}&branch_ids=${props.selectedBranch}&section_ids=${props.selectedSubject}`,
          {
            headers: {
              'X-DTS-HOST': X_DTS_HOST,
            },
          }
        )
        .then((response) => {
          if (response?.data?.status_code === 400) {
            message.error(response?.data?.message);
            setLoading(false);
            return;
          } else if (response?.data?.status_code === 200) {
            setTotalCount(response?.data?.count);
            setTotalPages(response?.data?.page_size);
            setCurrentPage(response?.data?.page);
            setLimit(Number(limit));
            // props.setFlag(false);
            // message.success(response?.data?.message)
            setTotalSubmitted(response?.data?.result);
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          message.error(error);
        });
    }
  };

  const assignPage = (data) => {
    if (data?.length !== 0) {
      setView(true);
      setData(data);
      setDataId(data?.id);

      getRatingView(data?.id);
    }
  };

  useEffect(() => {
    if (props.selectedBranch?.length === 0 || props.selectedGrade?.length === 0) {
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag, props.value]);

  useEffect(() => {
    if (props?.flag) {
      getTotalSubmitted();
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag, currentPage, props.value]);
  const [view, setView] = useState(false);
  const [data, setData] = useState();
  const handleCloseViewMore = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
    }
    setView(false);
    setFile();
  };

  let dummyArr = [];
  const filterRound = (data) => {
    if (dummyArr.indexOf(data) !== -1) {
      return '';
    } else {
      dummyArr.push(data);
      return data;
    }
  };

  const showMedia = (item) => {
    axios
      .get(`${endpoints.newBlog.showVisualMedia}${item}/`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        setFile(response.data.result);
      });
  };
  const columns = [
    {
      title: <span className='th-white th-fw-700'>SL No.</span>,
      // dataIndex: 'lp_count',
      align: 'center',
      width: '15%',
      render: (text, row, index) => <span className='th-black-1'>{index + 1}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Student's Name</span>,
      // dataIndex: 'title',
      align: 'center',
      render: (text, row) => <span className='th-black-1'>{row?.booked_user?.name}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>ERP ID</span>,
      // dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>{row?.booked_user?.username}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Submission Date</span>,
      dataIndex: 'creator',
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>
          {moment(row?.submitted_on).format('DD-MM-YYYY')}
        </span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Actions</span>,
      dataIndex: '',
      align: 'center',
      width: '25%',
      render: (text, row) => (
        <div className='th-black-1'>
          <Tag
            icon={<FileProtectOutlined className='th-14' />}
            color='geekblue'
            className='th-br-5 th-pointer py-1'
            onClick={() => assignPage(row)}
          >
            <span className='th-fw-500 th-14'> Check Review</span>
          </Tag>
        </div>
      ),
    },
  ];
  return (
    <>
      <div className='col-12 px-0'>
        <Table
          columns={columns}
          dataSource={totalSubmitted}
          className='th-table'
          rowClassName={(record, index) =>
            `${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
          }
          loading={loading}
          scroll={{ x: totalSubmitted?.length > 0 ? 'max-content' : null, y: 600 }}
        />
      </div>
      <Drawer
        title={<span className='th-fw-500'>Check Review</span>}
        placement='right'
        onClose={handleCloseViewMore}
        zIndex={1300}
        visible={view}
        width={file?.s3_path ? '70vw' : '35vw'}
        closable={false}
        className='th-resources-drawer'
        extra={
          <Space>
            <CloseOutlined onClick={handleCloseViewMore} />
          </Space>
        }
      >
        <div>
          <div className='row'>
            <div className={file?.s3_path ? 'col-md-8' : 'd-none'}>
              {file?.file_type === 'image/jpeg' || file?.file_type === 'image/png' ? (
                <img
                  src={file?.s3_path}
                  thumb={file?.s3_path}
                  alt={'image'}
                  width='100%'
                  height='95%'
                />
              ) : (
                <ReactPlayer
                  url={file?.s3_path}
                  thumb={file?.s3_path}
                  // key={index}
                  ref={playerRef}
                  width='100%'
                  height='100%'
                  playIcon={
                    <Tooltip title='play'>
                      <Button
                        style={{
                          background: 'transparent',
                          border: 'none',
                          height: '30vh',
                          width: '30vw',
                        }}
                        shape='circle'
                        icon={
                          <PlayCircleOutlined
                            style={{ color: 'white', fontSize: '70px' }}
                          />
                        }
                      />
                    </Tooltip>
                  }
                  alt={'video'}
                  controls={true}
                />
              )}
            </div>
            <div className={`${file?.s3_path ? 'col-md-4' : 'col-12'} px-0 th-bg-white`}>
              <div className='row'>
                <div className='col-12 px-1'>
                  <div>
                    <img
                      src='https://image3.mouthshut.com/images/imagesp/925725664s.png'
                      alt='image'
                      style={{
                        // width: '100%',
                        height: 130,
                        objectFit: 'fill',
                      }}
                    />
                  </div>
                  <div className='d-flex align-items-center pr-1'>
                    <Avatar
                      size={50}
                      aria-label='recipe'
                      icon={
                        <UserOutlined
                          color='#f3f3f3'
                          style={{ color: '#f3f3f3' }}
                          twoToneColor='white'
                        />
                      }
                    />
                    <div className='text-left ml-3'>
                      <div className=' th-fw-600 th-16'>{data?.booked_user?.name}</div>
                      <div className=' th-fw-500 th-14'>{data?.branch?.name}</div>
                      <div className=' th-fw-500 th-12'>{data?.grade?.name}</div>
                    </div>
                  </div>
                  <div
                    className='p-2 mt-3 th-br-5 th-bg-grey'
                    style={{ outline: '1px solid #d9d9d9' }}
                  >
                    <div>
                      Title :{' '}
                      <span className='th-fw-600'>{data?.activity_detail?.title}</span>
                    </div>
                    <div>
                      Instructions :{' '}
                      <span className='th-fw-400'>
                        {data?.activity_detail?.description}
                      </span>
                    </div>
                  </div>
                  <div className='mt-3'>
                    <div className='th-fw-500 th-16 mb-2'>Remarks</div>
                    <div
                      className='px-1 py-2 th-br-5'
                      style={{ outline: '1px solid #d9d9d9' }}
                    >
                      {ratingReview?.map((obj, index) => {
                        return (
                          <div className='row py-1 align-items-center'>
                            <div className='col-6 pl-1' key={index}>
                              {obj?.name}
                            </div>
                            <div className='col-6 pr-1'>
                              <Input
                                disabled
                                title={
                                  obj?.remarks.filter((item) => item.status == true)[0]
                                    .name
                                }
                                value={
                                  obj?.remarks.filter((item) => item.status == true)[0]
                                    .name
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default VisualReviews;
