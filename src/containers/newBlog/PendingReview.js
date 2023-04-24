import React, { useState, useEffect } from 'react';
import endpoints from '../../config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Rating from '@material-ui/lab/Rating';
import { useSelector } from 'react-redux';
import {
  Button as ButtonAnt,
  Input,
  Avatar,
  Select,
  Tag,
  Table as TableAnt,
  Drawer,
  Space,
  message,
} from 'antd';

import { MonitorOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';

import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';

const DEFAULT_RATING = 0;
const StyledRating = withStyles((theme) => ({
  iconFilled: {
    color: 'yellow',
  },
  root: {
    '& .MuiSvgIcon-root': {
      color: 'currentColor',
    },
  },
  iconHover: {
    color: 'yellow',
  },
}))(Rating);

const PendingReview = (props) => {
  // debugger
  console.log(props, 'lp');
  const history = useHistory();
  const { Option } = Select;
  const [value, setValue] = useState();
  // const { setAlert } = useContext(AlertNotificationContext);
  const ActivityId = JSON.parse(localStorage.getItem('ActivityId')) || {};
  console.log(ActivityId, 'ActivityId');
  const [inputList, setInputList] = useState([{ remarks: '', id: '', given_rating: '' }]);
  const [totalSubmitted, setTotalSubmitted] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const [isClicked, setIsClicked] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [view, setView] = useState(false);
  const { user_id } = JSON.parse(localStorage.getItem('ActivityManagementSession'));
  const blogActivityId = localStorage.getItem('BlogActivityId')
    ? JSON.parse(localStorage.getItem('BlogActivityId'))
    : {};

  const handleCloseViewMore = () => {
    setView(false);
  };
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );

  const [values, setValues] = useState();
  const [loading, setLoading] = useState(false);
  console.log(values, 'values');
  const [publish, setPublish] = useState(false);
  const createPublish = () => {
    setPublish(true);
  };
  const [submit, setSubmit] = useState(false);
  const submitReview = () => {
    setLoading(true);
    let mandatory = ratingReview.filter((e) => e?.name === 'Overall');
    if (!mandatory[0].remarks) {
      message.error('Overall Remarks Is Compulsory');
      setLoading(false);
      return;
    } else {
      let body = ratingReview;
      let overAllIndex = body.findIndex((each) => each?.name === 'Overall');
      body[overAllIndex].given_rating = calculateOverallRating();
      setLoading(true);
      axios
        .post(`${endpoints.newBlog.pendingReview}`, body, {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((response) => {
          props.setValue(1);
          console.log(response);
          setView(false);
          setLoading(false);
          message.success(' Review Submitted Successfully');
        });
    }
  };

  const [dataId, setDataId] = useState();

  const confirmassign = () => {
    let body = {
      booking_detail: {
        is_bookmarked: true,
        is_reassigned: false,
      },
    };
    setLoading(true);
    axios
      .put(`${endpoints.newBlog.activityReview}${dataId}/`, body, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        setLoading(false);
        message.success('Activity Successfully Shortlisted');
      });
  };

  const handleInputCreativity = (event, index) => {
    console.log(index, 'text');

    let arr = [...ratingReview];
    arr[index].remarks = event.target.value;
    setRatingReview(arr);
  };
  const handleInputCreativityOne = (event, newValue, index) => {
    console.log(index, newValue, 'event');
    let arr = [...ratingReview];

    arr[index].given_rating = Number(event.target.value);
    setRatingReview(arr);
    calculateOverallRating();
  };

  const expandMore = () => {
    setSubmit(false);
  };

  const [maxWidth, setMaxWidth] = React.useState('lg');

  const getTotalSubmitted = () => {
    const gradeIds = props?.selectedGrade;
    setLoading(true);
    axios
      .get(
        `${
          endpoints.newBlog.studentSideApi
        }?section_ids=null&&user_id=null&&activity_detail_id=${
          ActivityId?.id
        }&branch_ids=${
          props == '' ? null : props.selectedBranch?.id
          // }&grade_id=${gradeIds}&is_reviewed=False&page=${currentPage}&page_size=${limit}`,
        }&grade_id=${gradeIds}&is_reviewed=False&page=${currentPage}`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        props.setFlag(false);
        setTotalCount(response?.data?.count);
        setTotalPages(response?.data?.page_size);
        setCurrentPage(response?.data?.page);
        setLimit(Number(limit));
        message.success(response?.data?.message);
        setTotalSubmitted(response?.data?.result);
        setLoading(false);
      });

    // }
  };

  const [ratingReview, setRatingReview] = useState([]);
  let array = [];
  const getRatingView = (data) => {
    setLoading(true);
    axios
      .get(`${endpoints.newBlog.studentReviewss}?booking_detail_id=${data}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        console.log(response, 'responses');
        response.data.map((obj, index) => {
          let temp = {};
          temp['id'] = obj.id;
          temp['name'] = obj.level.name;
          temp['rating'] = Number(obj.level.rating);
          temp['remarks'] = obj.remarks;
          temp['given_rating'] = obj.given_rating;
          temp['reviewer_id'] = user_id;
          array.push(temp);
        });
        setRatingReview(array);
        setLoading(false);
      });
  };
  const [data, setData] = useState();

  const assignPage = (data) => {
    setView(true);
    setData(data);
    getRatingView(data?.id);
    setDataId(data?.id);
  };

  useEffect(() => {
    if (props.selectedBranch?.length === 0 || props.selectedGrade?.length === 0) {
      setTotalSubmitted([]);
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag]);

  useEffect(() => {
    if (props.flag) {
      getTotalSubmitted();
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag, currentPage]);

  const ReviewPage = () => {
    history.push('/blog/addreview');
  };
  const calculateOverallRating = () => {
    let average = 0;
    let ave = 0;
    let aver;
    ratingReview.map((parameter) => {
      average += parameter.given_rating;
      ave += Number(parameter.rating);
      aver = ave - Number('5');
      console.log(average, 'average', aver, 'ave');
    });
    return (average / aver) * 5;
  };

  const handlePagination = (event, page) => {
    setIsClicked(true);
    setCurrentPage(page);
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
    // {
    //   title: <span className='th-white th-fw-700'>Attendance</span>,
    //   align: 'center',
    //   render: (text, row) => (
    //     <span className='th-black-1'>{row?.attendence_status === null ?  <Tag color="red">Absent</Tag> :  <Tag color="green">Present</Tag>}</span>
    //   ),
    // },
    {
      title: <span className='th-white th-fw-700'>Submission Date</span>,
      // dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>{row?.submitted_on?.substring(0, 10)}</span>
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
            icon={<MonitorOutlined className='th-14' />}
            color='geekblue'
            className='th-br-5 th-pointer py-1'
            onClick={() => assignPage(row)}
          >
            <span className='th-fw-500 th-14'> Add Review</span>
          </Tag>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className='col-12 px-0'>
        <TableAnt
          columns={columns}
          dataSource={totalSubmitted}
          className='th-table'
          rowClassName={(record, index) =>
            `${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
          }
          loading={loading}
          pagination={false}
          scroll={{ x: totalSubmitted.length > 0 ? 'max-content' : null, y: 600 }}
        />
      </div>
      <Drawer
        title={<span className='th-fw-500'>Submit Review</span>}
        placement='right'
        onClose={handleCloseViewMore}
        zIndex={1300}
        visible={view}
        width={'70vw'}
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
            <div className='col-12 px-0 th-bg-white '>
              <div className='row'>
                <div className='col-8 px-1'>
                  <div
                    style={{
                      background: 'white',
                      width: '502px',
                      marginLeft: '34px',
                      height: 'auto',
                      marginTop: '12px',
                      marginBottom: '29px',
                    }}
                  >
                    <div style={{ paddingTop: '12px' }}>
                      <div
                        style={{
                          background: `url(${data?.template?.template_path})`,
                          backgroundSize: 'contain',
                          position: 'relative',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          backgroundColor: 'rgba(244 245 247 / 25%)',
                          height: '683px',
                        }}
                      >
                        <div className='certificate-text-center certificate-input-box'>
                          <textarea
                            className='certificate-box'
                            style={{ width: '338px', height: '366px' }}
                            value={data?.submitted_work?.html_text}
                            placeholder='type text here...'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-4 px-1'>
                  <div>
                    <img
                      src='https://image3.mouthshut.com/images/imagesp/925725664s.png'
                      alt='image'
                      style={{
                        height: 100,
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
                          color='#F3F3F3'
                          style={{ color: '#F3F3F3' }}
                          twoToneColor='white'
                        />
                      }
                    />
                    <div className='text-left ml-3'>
                      <div className=' th-fw-600 th-16'> {data?.booked_user?.name}</div>
                      <div className=' th-fw-500 th-14'>{data?.branch?.name}</div>
                      <div className=' th-fw-500 th-14'>{data?.grade?.name}</div>
                    </div>
                  </div>
                  <div className='col-12 px-0'>
                    <div
                      className='th-bg-grey py-3 px-2 th-br-8'
                      style={{ outline: '1px solid #d9d9d9' }}
                    >
                      <div className=' th-16 th-black-2'>
                        Title :{' '}
                        <span className='th-16 th-fw-500 th-black-1'>
                          {data?.activity_detail?.title}
                        </span>
                      </div>
                      <div
                        className='mt-2'
                        style={{ overflowY: 'auto', maxHeight: '25vh' }}
                      >
                        <span className='th-16 th-black-2'>Description :&nbsp;</span>
                        <span className='th-16 th-fw-400 th-black-1'>
                          {data?.activity_detail?.description}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='mt-3'>
                    <div className='th-fw-500 th-16 mb-2'>Review</div>
                    <div
                      className='px-1 py-2 th-br-5'
                      style={{ outline: '1px solid #D9D9D9' }}
                    >
                      {ratingReview.map((obj, index) => {
                        return (
                          <div className='col-12 px-1'>
                            {obj?.name === 'Overall' ? (
                              <div
                                key={index}
                                className='th-black d-flex'
                                style={{ justifyContent: 'space-between' }}
                              >
                                {' '}
                                <b>{obj?.name}</b>
                                <StyledRating
                                  name={`rating`}
                                  size='small'
                                  value={calculateOverallRating()}
                                  max={obj?.rating}
                                  precision={0.1}
                                  readOnly
                                />
                              </div>
                            ) : (
                              <div
                                key={index}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                {obj?.name}
                                <StyledRating
                                  name={`rating${index}`}
                                  size='small'
                                  value={obj?.given_rating}
                                  max={obj?.rating}
                                  onChange={(event, newValue) =>
                                    handleInputCreativityOne(event, newValue, index)
                                  }
                                />
                              </div>
                            )}
                            {obj?.name == 'Overall' ? (
                              <div>
                                <Input
                                  value={obj?.remarks}
                                  onChange={(event) =>
                                    handleInputCreativity(event, index)
                                  }
                                  placeholder='Mandatory'
                                />
                              </div>
                            ) : (
                              <div>
                                <Input
                                  value={obj?.remarks}
                                  placeholder='Optional'
                                  onChange={(event) =>
                                    handleInputCreativity(event, index)
                                  }
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          marginRight: '10px',
                          marginLeft: '6px',
                          marginBottom: '15px',
                          marginTop: '32px',
                        }}
                      >
                        <ButtonAnt
                          className='th-button-active th-br-6 text-truncate th-pointer'
                          onClick={() => submitReview()}
                        >
                          Submit Review
                        </ButtonAnt>
                      </div>
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

export default PendingReview;
