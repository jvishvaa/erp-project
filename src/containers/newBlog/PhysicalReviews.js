import React, { useState, useEffect } from 'react';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { Avatar, Select, Tag, Table as TableAnt, message, Tooltip, Button, Drawer, Space, Modal, Input } from 'antd';
import { UserOutlined, FileSearchOutlined,ArrowRightOutlined, CloseOutlined, CaretRightOutlined, PlayCircleOutlined,} from '@ant-design/icons';
import endpoints from '../../config/endpoints';
import ReactPlayer from 'react-player';

import axios from 'axios';
import './images.css';
const DEFAULT_RATING = 0;

function createData(slno, name, grade, submissiondate, overallscore, actions) {
  return { slno, name, grade, submissiondate, overallscore, actions };
}

const PhysicalReviewed = (props) => {
  const { Option } = Select;
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
  const [reviewData, setReviewData] = useState([]);
  const [tableHeader, setTableHeader] = useState([]);
  const [overallData, setOverAllData] = useState([]);
  const [customRatingReview, setCustomRatingReview] = useState([]);
  const [overallRemarks, setOverAllRemarks] = useState('');
  const [isRoundAvailable, setIsRoundAvailable] = useState(false);
  const [firstLoad, setFirstLoad]= useState(false);

  let array = [];
  const getRatingView = (data) => {
    setLoading(true);
    axios
      .get(
        `${
          endpoints.newBlog.studentReviewss
        }?booking_detail_id=${data}&response_is_change=${true}&is_round_available=${isRoundAvailable}`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        // response.data.map((obj, index) => {
        //   let temp = {};
        //   temp['id'] = obj.id;
        //   temp['name'] = obj.level.name;
        //   temp['remarks'] = obj.remarks;
        //   temp['given_rating'] = obj.given_rating;
        //   temp['level'] = obj?.level?.rating;
        //   array.push(temp);
        // });
        setRatingReview(response.data);
        setLoading(false);
      });
  };

  const getDrawerRatingView = (data) => {
    setLoading(true);
    showMedia(data);
    axios
      .get(`${endpoints.newBlog.studentReviewss}?booking_detail_id=${data}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((response) => {
        response.data.map((obj, index) => {
          
          let temp = {};
          temp['id'] = obj.id;
          temp['name'] = obj.level.name;
          temp['remarks'] = JSON.parse(obj.remarks);
          temp['given_rating'] = obj.given_rating;
          temp['level'] = obj?.level?.rating;
          array.push(temp);
          
        });
        setDrawerRatingReview(array);
        setLoading(false);
      });
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
        setButtonFlag(true);
        getTotalSubmitted();
        setLoading(false);
        message.success('Activity Shortlisted Successfully');
        return;
      });
  };

  const getTotalSubmitted = () => {
    if (props) {
      setLoading(true);
      axios
        .get(
          `${endpoints.newBlog.studentSideApi}?&user_id=null&activity_detail_id=${ActivityId?.id}&is_reviewed=True&is_submitted=True&grade_id=${props.selectedGrade}&branch_ids=${props.selectedBranch}&section_ids=${props.selectedSubject}`,
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
          setTotalSubmitted(response?.data?.result);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          message.error(err?.data?.message);
          return;
        });
    }
  };

  useEffect(() => {
    if(!firstLoad){
      fetchisRoundAvailable();
    }
  });

  const fetchisRoundAvailable = () => {
    axios 
      .get(`${endpoints.newBlog.getRoundShowHide}?activity_detail_id=${ActivityId?.id}`, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((result) => {
        setIsRoundAvailable(result?.data?.is_round_available);
        setFirstLoad(true);
      });
  };

  const assignPage = (data) => {
    if (data?.length !== 0) {
      if(isRoundAvailable){
      setView(true);
      setData(data);
      setDataId(data?.id);

      getRatingView(data?.id);
      } else {
        setDrawerView(true);
      setDrawerData(data);
      setDrawerDataId(data?.id);

      getDrawerRatingView(data?.id);
      }
    }
  };

  useEffect(() => {
    if (props.selectedBranch?.length === 0 || props.selectedGrade?.length === 0) {
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag]);

  useEffect(() => {
    if (props?.flag) {
      getTotalSubmitted();
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag, currentPage]);
  const [view, setView] = useState(false);
  const [data, setData] = useState();
  const [drawerview, setDrawerView] = useState(false);
  const [drawerdata, setDrawerData] = useState();
  const [drawerdataId, setDrawerDataId] = useState();
  const [drawerratingReview, setDrawerRatingReview] = useState([]);
  const [file, setFile] = useState([]);
  const handleCloseViewMore = () => {
    setView(false);
    setDrawerView(false);
  };

  const handlePagination = (event, page) => {
    setIsClicked(true);
    setCurrentPage(page);
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

  const columns = [
    {
      title: <span className='th-white th-fw-700'>SL No.</span>,
      align: 'center',
      // width: '15%',
      render: (text, row, index) => <span className='th-black-1'>{index + 1}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Student's Name</span>,
      align: 'center',
      render: (text, row) => <span className='th-black-1'>{row?.booked_user?.name}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Executed Date</span>,
      align: 'center',
      render: (text, row) => (
        <span className='th-black-1'>{row?.submitted_on?.substring(0, 10)}</span>
      ),
    },
    // {
    //   title: <span className='th-white th-fw-700'>Reviewed By</span>,
    //   align: 'center',
    //   render: (text, row) => <span className='th-black-1'>{row?.reviewer}</span>,
    // },

    // {
    //   title: <span className='th-white th-fw-700'>Overall Remarks</span>,
    //   align: 'center',
    //   render: (text, row) => (
    //     <span className='th-black-1'>{row?.user_reviews?.remarks}</span>
    //   ),
    // },
    {
      title: <span className='th-white th-fw-700'>Actions</span>,
      dataIndex: '',
      align: 'center',
      width: '25%',
      render: (text, row) => (
        <div className='th-black-1'>
          <Tag
            icon={<FileSearchOutlined className='th-14' />}
            color='purple'
            className='th-br-5 th-pointer py-1'
            onClick={() => assignPage(row)}
          >
            <span className='th-fw-500 th-14'> Check Review</span>
          </Tag>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (ratingReview.length > 0) {
      transformTable(ratingReview);
    }
  }, [ratingReview]);

  let rounds;
  function transformTable(arr) {
    let headersData = arr
      .filter((item) => item?.name !== 'Overall')
      .map((item) => item)
      .reduce((acc, curr) => {
        let obj = acc.find((item) => item?.name === curr?.name);
        if (obj) {
          return acc;
        } else {
          return acc.concat([curr]);
        }
      }, []);

    let overValueAllData = arr
      .filter((item) => item?.name?.toLowerCase() === 'overall')
      .map((item) => item);
    setOverAllData(overValueAllData);
    setTableHeader(headersData);

    rounds = arr
      .filter((item) => item.name !== 'Overall')
      .reduce((initial, data) => {
        let key = data.level;
        if (!initial[key]) {
          initial[key] = [];
        }
        initial[key].push(data);
        return initial;
      }, {});
    setCustomRatingReview(rounds);
  }

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
          scroll={{ x: totalSubmitted.length > 0 ? 'max-content' : null, y: 600 }}
          pagination={false}
        />
      </div>
      <Drawer
        title={<span className='th-fw-500'>Check Review</span>}
        placement='right'
        onClose={handleCloseViewMore}
        zIndex={1300}
        visible={drawerview}
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
                      <div className=' th-fw-600 th-16'>{drawerdata?.booked_user?.name}</div>
                      <div className=' th-fw-500 th-14'>{drawerdata?.branch?.name}</div>
                      <div className=' th-fw-500 th-12'>{drawerdata?.grade?.name}</div>
                    </div>
                  </div>
                  <div
                    className='p-2 mt-3 th-br-5 th-bg-grey'
                    style={{ outline: '1px solid #d9d9d9' }}
                  >
                    <div>
                      Title :{' '}
                      <span className='th-fw-600'>{drawerdata?.activity_detail?.title}</span>
                    </div>
                    <div>
                      Instructions :{' '}
                      <span className='th-fw-400'>
                        {drawerdata?.activity_detail?.description}
                      </span>
                    </div>
                  </div>
                  <div className='mt-3'>
                    <div className='th-fw-500 th-16 mb-2'>Remarks</div>
                    <div
                      className='px-1 py-2 th-br-5'
                      style={{ outline: '1px solid #d9d9d9' }}
                    >
                      {drawerratingReview?.map((obj, index) => {
                        return (
                          <div className='row py-1 align-items-center'>
                            <div className='col-6 pl-1' key={index}>
                              {obj?.name}
                            </div>  
                            <div className='col-6 pr-1'>
                              <Input
                                disabled
                                title={obj?.remarks.filter((item) => item.status == true)[0]
                                  .name}
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
      <Modal
        centered
        visible={view}
        onCancel={handleCloseViewMore}
        footer={false}
        width={1000}
        className='th-upload-modal'
        title={`Submit Review`}
      >
        <div className='col-12 p-2 d-flex align-items-center justify-content-between'>
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
              <div className=' th-fw-600 th-16'>{data?.booked_user?.name}</div>
              <div className=' th-fw-500 th-14'>{data?.booked_user?.username}</div>
            </div>
          </div>

          <div className='pr-1'>
            <img
              src='https://image3.mouthshut.com/images/imagesp/925725664s.png'
              alt='image'
              style={{
                height: 60,
                width: 150,
                objectFit: 'fill',
              }}
            />
          </div>
        </div>
        <div className='col-12 d-flex justify-content-center align-items-center, p-2'>
          <table className='w-100' style={{ background: '#eee' }}>
            <thead>
              <tr style={{ background: '#4800c9', textAlign: 'center', color: 'white' }}>
                <th> Rounds </th>
                {tableHeader?.map((item, i) => (
                  <th>{item?.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(customRatingReview)?.length > 0 &&
                Object.keys(customRatingReview).map((item, index) => (
                  <tr className='th-html-table'>
                    <td style={{ fontWeight: 500, padding: '2px', textAlign: 'center' }}>
                      {item}
                    </td>
                    {tableHeader?.map((each, i) => {
                      let remarks = customRatingReview[item].filter(
                        (round) => round.name === each.name
                      )[0].remarks;
                      return (
                        <td style={{ padding: '5px' }}>
                          <div className='text-center'>{remarks}</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className='col-12 px-0'>
          <div className='p-2 d-flex justify-content-start'>
            {overallData.length > 0 &&
              overallData.map((item, index) => {
                return (
                  <div className='col-6 pl-4 p-2 d-flex align-items-center justify-content-start'>
                    <span style={{ fontWeight: 500, marginRight: '5px', fontSize:'15px' }}>Overall {<CaretRightOutlined />}</span>
                    <div className='text-center'style={{fontSize:'15px', fontWeight:600, color:'blue'}}>
                      {/* <Tag color='green'> */}
                      {item?.remarks}
                      {/* </Tag> */}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PhysicalReviewed;
