import React, { useState, useEffect, useContext } from 'react';
import { withStyles } from '@material-ui/core';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import {
  UserOutlined,
  MonitorOutlined,
  CloseOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Avatar, Tag, Table as TableAnt, Input, Drawer, Space, message } from 'antd';
import Rating from '@material-ui/lab/Rating';
import endpoints from '../../config/endpoints';
import axios from 'axios';
import './images.css';
const DEFAULT_RATING = 0;
const StyledRating = withStyles((theme) => ({
  iconFilled: {
    color: '#E1C71D',
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

const Reviewed = (props) => {
  const [value, setValue] = React.useState();
  const [totalSubmitted, setTotalSubmitted] = useState([]);
  const ActivityId = JSON.parse(localStorage.getItem('ActivityId')) || {};
  const [dataId, setDataId] = useState();
  let datas = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = datas?.token;
  const user_level = datas?.user_level;

  const [values, setValues] = useState();
  const [imageData, setImageData] = useState();
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const [submit, setSubmit] = useState(false);
  const [ratingReview, setRatingReview] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isClicked, setIsClicked] = useState(false);
  const [buttonFlag, setButtonFlag] = useState(false);
  const [loading, setLoading] = useState(false);

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
          temp['remarks'] = obj.remarks;
          temp['given_rating'] = obj.given_rating;
          temp['level'] = obj?.level?.rating;
          array.push(temp);
        });
        setRatingReview(array);
        setLoading(false);
      });
  };

  const confirmassign = (response) => {
    setLoading(true);
    let body = {
      booking_detail: {
        is_bookmarked: true,
        is_reassigned: false,
      },
    };

    axios
      .put(`${endpoints.newBlog.activityReview}${response?.id}/`, body, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        message.success('Activity Successfully Shortlisted');
        setButtonFlag(true);
        getTotalSubmitted();

        console.log(response);
        setLoading(false);
      });
  };

  const getTotalSubmitted = () => {
    if (props) {
      setLoading(true);

      axios
        .get(
          `${
            endpoints.newBlog.studentSideApi
          }?section_ids=null&&user_id=null&branch_ids=${
            props?.selectedBranch?.id == '' ? null : props?.selectedBranch?.id
          }&grade_id=${props?.selectedGrade}&activity_detail_id=${
            ActivityId?.id
          }&is_reviewed=True&page=${currentPage}&page_size${limit}`,
          {
            headers: {
              'X-DTS-HOST': X_DTS_HOST,
            },
          }
        )
        .then((response) => {
          setTotalCount(response?.data?.count);
          setTotalPages(response?.data?.page_size);
          setCurrentPage(response?.data?.page);
          setLimit(Number(limit));
          props.setFlag(false);
          // setAlert('success', response?.data?.message);
          setTotalSubmitted(response?.data?.result);
          setLoading(false);
        });
    }
  };

  const assignPage = (data) => {
    if (data?.length !== 0) {
      setView(true);
      setImageData(JSON?.parse(data?.template?.html_file));
      setData(data);
      setDataId(data?.id);

      getRatingView(data?.id);
    }
  };

  useEffect(() => {
    if (props.selectedBranch?.length === 0 || props.selectedGrade?.length === 0) {
      setTotalSubmitted([]);
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag]);

  useEffect(() => {
    if (props?.flag && currentPage) {
      getTotalSubmitted();
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag, currentPage]);
  const [view, setView] = useState(false);
  const [data, setData] = useState();
  const handleCloseViewMore = () => {
    setView(false);
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
      // width: '15%',
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
      // dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>{row?.submitted_on?.substring(0, 10)}</span>
      ),
    },
    {
      title: <span className='th-white th-fw-700'>Reviewed By</span>,
      // dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => <span className='th-black-1'>{row?.reviewer}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Overall Score</span>,
      // dataIndex: 'created_at',
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>
          <StyledRating
            // name={`rating${index}`}
            size='small'
            readOnly
            defaultValue={row?.user_reviews?.given_rating}
            max={parseInt(row?.user_reviews?.level?.rating)}
          />
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
            icon={<UserAddOutlined className='th-14' />}
            color='green'
            className='th-br-5 th-pointer py-1'
            onClick={() => confirmassign(row)}
            disabled={row?.is_bookmarked}
          >
            <span className='th-fw-500 th-14'> Shortlist</span>
          </Tag>
          <Tag
            icon={<MonitorOutlined className='th-14' />}
            color='geekblue'
            className='th-br-5 th-pointer py-1'
            onClick={() => assignPage(row)}
          >
            <span className='th-fw-500 th-14'>Check Review</span>
          </Tag>
        </div>
      ),
    },
  ];

  let schoolDetails = JSON.parse(localStorage.getItem('schoolDetails'));
  const { school_logo } = schoolDetails;

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
        title={<span className='th-fw-500'>Preview</span>}
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
                      src={school_logo}
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
                                  defaultValue={obj?.given_rating}
                                  precision={0.1}
                                  max={parseInt(obj?.level)}
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
                                  defaultValue={obj?.given_rating}
                                  precision={0.1}
                                  max={parseInt(obj?.level)}
                                  readOnly
                                />
                              </div>
                            )}
                            {obj?.name == 'Overall' ? (
                              <div>
                                <Input value={obj?.remarks} placeholder='Mandatory' />
                              </div>
                            ) : (
                              <div>
                                <Input value={obj?.remarks} placeholder='Optional' />
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
                      ></div>
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

export default Reviewed;
