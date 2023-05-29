import React, { useState, useRef, useEffect } from 'react';
import endpoints from '../../config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Rating from '@material-ui/lab/Rating';
import smallCloseIcon from 'v2/Assets/dashboardIcons/announcementListIcons/smallCloseIcon.svg';

import {
  Button as ButtonAnt,
  Input,
  Avatar,
  Select,
  Tag,
  Table as TableAnt,
  message,
  Modal,
  Spin,
  Upload,
  Button,
  Drawer,
  Space,
} from 'antd';
import {
  MonitorOutlined,
  ScheduleOutlined,
  UserOutlined,
  ArrowRightOutlined,
  CaretRightOutlined,
  DownOutlined,
  CheckOutlined,
  UploadOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { makeStyles, withStyles } from '@material-ui/core/styles';

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

const useStyles = makeStyles((theme) => ({
  button: {
    background: '#FFFFFF',
    color: '#2A7D4B',
    border: '1px solid #D2E4D9',
    borderRadius: '6px',
  },
  buttonColor1: {
    color: 'grey !important',
    backgroundColor: 'white',
  },
  root: {
    maxWidth: '95vw',
    width: '100%',
    // margin: '20px auto',
    // marginTop: theme.spacing(4),
    paddingLeft: '20px',
    boxShadow: 'none',
  },
  tableCell: {
    color: 'black !important',
    backgroundColor: '#ADD8E6 !important',
  },
  tableCells: {
    color: 'black !important',
    backgroundColor: '#F0FFFF !important',
  },

  dividerColor: {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  container: {
    maxHeight: '70vh',
    maxWidth: '94vw',
  },
  buttonColor2: {
    color: '#2A7D4B !important',
    backgroundColor: 'white',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
}));

const dummyData = [
  { id: 1, name: 'harsha', title: 'nadjabjn' },
  { id: 2, name: 'gjadjga', title: 'bajbjabdjabj' },
];

const PhysicalPendingReview = (props) => {
  const history = useHistory();
  const { Option } = Select;
  const [value, setValue] = useState();
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const ActivityId = JSON.parse(localStorage.getItem('ActivityId')) || {};
  const [inputList, setInputList] = useState([{ remarks: '', id: '', given_rating: '' }]);
  const [totalSubmitted, setTotalSubmitted] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const [isClicked, setIsClicked] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [view, setView] = useState(false);
  const [viewLevelDrawer, setviewLevelDrawer] = useState(false);
  const { user_id } = JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
  const [sourceData, setSourceData] = useState([]);
  const [targetData, setTargetData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [tableHeader, setTableHeader] = useState([]);
  const [overallData, setOverAllData] = useState([]);
  const [ratingReview, setRatingReview] = useState([]);
  const [ratingLevelReview, setRatinglevelReview] = useState([]);
  const [customRatingReview, setCustomRatingReview] = useState([]);
  const [overallRemarks, setOverAllRemarks] = useState('');
  const [data, setData] = useState();
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const [dataId, setDataId] = useState();
  const [isRoundAvailable, setIsRoundAvailable] = useState(false);
  const [file, setFile] = useState(null);
  const allowedFiles = ['.jpeg', '.jpg', '.png', '.mp4'];
  const fileRef = useRef();
  const [bookingID, setBookingID] = useState(null);

  const [firstLoad, setFirstLoad] = useState(false);

  const handleCloseViewMore = () => {
    setView(false);
    setRatingReview([]);
    setFile(null);
  };

  const handleCloseViewLevelMore = () => {
    setviewLevelDrawer(false);
    setRatinglevelReview([]);
    setFile(null);
  };

  const [values, setValues] = useState();
  const [loading, setLoading] = useState(false);
  const [publish, setPublish] = useState(false);
  const createPublish = () => {
    setPublish(true);
  };

  const uploadProps = {
    showUploadList: false,
    disabled: false,
    accept: allowedFiles.join(),
    multiple: false,
    onRemove: () => {
      setFile(null);
    },
    beforeUpload: (...file) => {
      setFile(null);
      const type = '.' + file[0]?.name.split('.')[file[0]?.name.split('.').length - 1];
      if (file[0]?.size > 31457280) {
        message.error('Selected file size should be less than 30MB');
        return false;
      }
      if (allowedFiles.includes(type)) {
        setFile(...file[1]);
      } else {
        message.error(' Please select the correct file type');
      }
      return false;
    },
    file,
  };

  const submitLevelReview = () => {
    let body = [];
    let checkSelected = ratingLevelReview.every((item) => item.checked);
    if (!checkSelected) {
      message.error('Please Select All Option');
      return;
    } else {
      ratingLevelReview.forEach((item) => {
        let record = { ...item };
        delete record.checked;
        body.push(record);
      });
    }

    setLoading(true);
    axios
      .post(`${endpoints.newBlog.physicalStudentReviewAPI}`, body, {
        headers: {
          'X-DTS-HOST': X_DTS_HOST,
        },
      })
      .then((res) => {
        message.success('Review Submitted Successfully');
        if (file) {
          uploadFile();
        }
        setviewLevelDrawer(false);
        setLoading(false);
        setRatinglevelReview([]);
        fileRef.current.value = '';
        setFile(null);
        erpAPI();
        return;
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const uploadFile = () => {
    if (file !== null) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('booking_id', bookingID);

      axios
        .post(`${endpoints.newBlog.uploadVisualFile}`, formData, {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((res) => {
          if (res.data.status_code === 200) {
            message.success(res.data.message);
            setFile(null);
          }
        })
        .catch((err) => {
          setFile(null);
        });
    } else {
      message.error('Please Upload File');
      setLoading(false);
      return;
    }
  };

  const validateOptionSubmit = () => {
    let isFormValid = true;
    if (ratingReview.length > 0) {
      ratingReview.forEach((item, index) => {

        if (item.name !== "Overall") {
          if (!item?.remarks) {
            if (isFormValid) {
              message.error('Please Enter All details');
              isFormValid = false;
            }
          }
        }
      });
    }
    let mandatory = ratingReview.filter((e) => e?.name === 'Overall');
      console.log("mandatory", mandatory);
      if (!mandatory[0].remarks && isFormValid) {
        message.error('Overall Remarks Is Compulsory');
        isFormValid = false;
      }

    return isFormValid;
  };

  const [submit, setSubmit] = useState(false);
  const submitReview = () => {
    if (validateOptionSubmit()) {
      setLoading(true);
      setView(false);
      

      let body = ratingReview;
      let overAllIndex = body.findIndex((each) => each?.name === 'Overall');
      body[overAllIndex].given_rating = calculateOverallRating();
      axios
        .post(`${endpoints.newBlog.physicalStudentReviewAPI}`, body, {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        })
        .then((response) => {
          // props.setValue(1)
          setView(false);
          erpAPI();
          message.success(' Review Submitted Successfully');
          setOverAllRemarks([]);
          setLoading(false);
          setCustomRatingReview({});
          setRatingReview([]);
          setTableHeader([]);
        })
        .catch((err) => {
          message.error(err);
          setLoading(false);
        });
    }
  };


  const handleInputCreativity = (event, index) => {
    let arr = [...ratingReview];
    arr[index].remarks = event.target.value;
    setRatingReview(arr);
  };

  const handleInputCreativityOne = (event, newValue, index) => {
    let arr = [...ratingReview];

    arr[index].given_rating = Number(event.target.value);
    setRatingReview(arr);
  };

  const expandMore = () => {
    setSubmit(false);
  };

  const functionFilter = (sourceData, targetData) => {
    setLoading(true);
    var finalData = [];
    sourceData.filter((item, i) => {
      targetData.forEach((ele) => {
        if (ele?.erp_id !== item?.erp_id) {
          finalData.push(item);
        }
      });
    });

    let dummyData = [];
    var res = sourceData.filter(
      (item) => !targetData.map((item2) => item2?.erp_id).includes(item?.erp_id)
    );
    if (finalData == 0) {
      setTotalSubmitted(sourceData);
      setLoading(false);
      return;
    } else {
      setTotalSubmitted(res);
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  const erpAPI = () => {
    setLoading(true);
    axios
      .get(
        `${endpoints.newBlog.erpDataStudentsAPI}?section_mapping_id=${props.setSubjectName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setSourceData(response?.data?.result);
        ActivityManagement(response?.data?.result);
        props.setFlag(false);
        message.success(response?.data?.message);
        setLoading(false);
      });
  };

  const ActivityManagement = (sourceData) => {
    setLoading(true);
    axios
      .get(
        `${endpoints.newBlog.physicalErpReview}?branch_id=${props.selectedBranch}&grade_id=${props.selectedGrade}&section_id=${props.selectedSubject}&activity_id=${ActivityId?.id}`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        setTargetData(response?.data?.result);
        functionFilter(sourceData, response?.data?.result);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getTotalSubmitted = () => {
    if (props) {
      setLoading(true);
      erpAPI();
      setLoading(false);
    }
  };

  let array = [];
  const showReview = (data) => {
    setBookingID(data?.booking_detail_id);
    if (data) {
      if (isRoundAvailable) {
        setLoading(true);
        axios
          .get(
            `${endpoints.newBlog.studentReviewss}?booking_detail_id=${data?.booking_detail_id
            }&response_is_change=${true}&is_round_available=${isRoundAvailable}`,
            {
              headers: {
                'X-DTS-HOST': X_DTS_HOST,
              },
            }
          )
          .then((response) => {
            // response.data.map((obj) => {
            //   let temp = {};
            //   temp['id'] = obj?.id;
            //   temp['name'] = obj?.level.name;
            //   temp['remarks'] = obj?.remarks;
            //   temp['given_rating'] = obj?.given_rating;
            //   temp['remarks'] = JSON.parse(obj?.level?.rating);
            //   temp['reviewer_id'] = user_id;
            //   array.push(temp);
            // });
            setRatingReview(response?.data);
            //setRatinglevelReview(array);
            setLoading(false);
            setView(true);
          })
          .catch((err) => {
            setLoading(false);
          });
      } else {
        setLoading(true);
        axios
          .get(
            `${endpoints.newBlog.studentReviewss}?booking_detail_id=${data?.booking_detail_id}`,
            {
              headers: {
                'X-DTS-HOST': X_DTS_HOST,
              },
            }
          )
          .then((response) => {
            response.data.map((obj) => {
              let temp = {};
              temp['id'] = obj?.id;
              temp['name'] = obj?.level.name;
              temp['remarks'] = obj?.remarks;
              temp['given_rating'] = obj?.given_rating;
              temp['remarks'] = JSON.parse(obj?.level?.rating);
              temp['reviewer_id'] = user_id;
              array.push(temp);
            });
            setRatinglevelReview(array);
            setLoading(false);
            setviewLevelDrawer(true);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    }
  };

  const addBookingApi = (data) => {
    setLoading(true);
    axios
      .get(
        `${endpoints.newBlog.bookingDetailsApi}?erp_id=${data?.erp_id
        }&activity_detail_id=${ActivityId?.id}&user_level=${13}`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
            Authorization: `${token}`,
          },
        }
      )
      .then((response) => {
        showReview(response?.data?.result);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

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
    addBookingApi(data);
    setData(data);
    setDataId(data?.erp_id);
  };

  const handleRemark = (value, id) => {
    const arr1 = ratingLevelReview?.map((obj) => {
      let newObj = obj?.remarks;
      if (obj.id === id) {
        newObj = obj.remarks.map((item) => {
          if (item.name === value.children) {
            return { ...item, status: true };
          } else {
            return { ...item, status: false };
          }
          return item;
        });
        return { ...obj, remarks: newObj, checked: true };
      }
      return obj;
    });
    setRatinglevelReview(arr1);
    // setRemarkedData()
    let newArr = [];
    arr1.map((obj) => {
      let newTemp = {};
      newTemp['given_rating'] = obj?.given_rating;
      newTemp['id'] = obj?.id;
      newTemp['name'] = obj?.name;
      newTemp['remarks'] = JSON.stringify(obj?.remarks);
      newTemp['reviewer_id'] = obj?.reviewer_id;
      newArr.push(newTemp);
    });
  };

  useEffect(() => {
    if (props.selectedBranch === undefined || props.selectedGrade === undefined) {
      setTotalSubmitted([]);
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag, props?.value]);

  useEffect(() => {
    if (props.flag) {
      getTotalSubmitted();
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag, currentPage, props?.value]);

  useEffect(() => {
    if (!firstLoad) {
      fetchisRoundAvailable();
    }
  });

  const classes = useStyles();
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
    });
    return (average / aver) * 5;
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
      width: '15%',
      render: (text, row, index) => <span className='th-black-1'>{index + 1}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Student's Name</span>,
      align: 'center',
      render: (text, row) => <span className='th-black-1'>{row?.student_name}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>ERP ID</span>,
      align: 'center',
      render: (text, row) => <span className='th-black-1'>{row?.erp_id}</span>,
    },
    // {
    //   title: <span className='th-white th-fw-700'>Attendance</span>,
    //   align: 'center',
    //   render: (text, row) => (
    //     <span className='th-black-1'>
    //       {row?.attendence_status === null ? (
    //         <Tag color='red'>Absent</Tag>
    //       ) : (
    //         <Tag color='green'>Present</Tag>
    //       )}
    //     </span>
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

  useEffect(() => {
    if (ratingReview?.length > 0) {
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

  // let roundData = Object.keys(arr[0]).filter(
  //   (item) => item.toLowerCase() !== 'overall'
  // );

  // setTableRound(roundData);
  // let valueData = Object.keys(arr[0])
  //   .filter((item) => item.toLowerCase() !== 'overall')
  //   .map((item) => arr[0][item]);
  // let columnsData = Object.keys(arr[0])
  //   .filter((item) => item.toLowerCase() !== 'overall')
  //   .map((item) => Object.keys(arr[0][item]))[0];

  // let overKey = Object.keys(arr[0]).filter((item) => item.toLowerCase() === 'overall');


  // let overValueAllData = Object.keys(arr[0])
  //   .filter((item) => item.toLowerCase() === 'overall')
  //   .map((item) => arr[0][item]);
  // setOverAllData([overKey]);
  // setReviewData(columnsData);
  // }
  const handleInputEvent = (event, round, value) => {
    console.log("handleInputEvent");
    console.log("event", event);
    console.log("round", round);
    console.log("value", value);
    const newReview = ratingReview.map((item) => {
      if (item.name == value?.name && item.level == round) {
        return { ...item, remarks: event.target.value };
      } else {
        return item;
      }
    });
    setRatingReview(newReview);
  };

  const handleOverAll = (event, round, index) => {
    console.log("handleOverAll");
    console.log("event", event);
    console.log("round", round);
    console.log("value", value);
    setOverAllRemarks(event.target.value);
    const newReview = ratingReview.map((item) => {
      if (item.name == round.name) {
        return { ...item, remarks: event.target.value };
      } else {
        return item;
      }
    });
    setRatingReview(newReview);
  };

  return (
    <>
      <div className='row th-bg-white th-br-5 m-3'>
        {loading ? (
          <div
            className='d-flex align-items-center justify-content-center w-100'
            style={{ height: '50vh' }}
          >
            <Spin tip='Loading' />
          </div>
        ) : (
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
        )}
      </div>

      <Drawer
        title={<span className='th-fw-500'>Submit Review</span>}
        placement='right'
        onClose={handleCloseViewLevelMore}
        zIndex={1300}
        visible={viewLevelDrawer}
        width={'35vw'}
        closable={false}
        className='th-resources-drawer'
        extra={
          <Space>
            <CloseOutlined onClick={handleCloseViewLevelMore} />
          </Space>
        }
      >
        <div>
          <div className='row'>
            <div className='col-12 px-0 th-bg-white '>
              <div className='row'>
                <div className='col-12 px-1'>
                  <div>
                    <img
                      src='https://image3.mouthshut.com/images/imagesp/925725664s.png'
                      alt='image'
                      style={{
                        // width: '100%',
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
                      <div className=' th-fw-600 th-16'>{data?.student_name}</div>
                      <div className=' th-fw-500 th-14'>{data?.erp_id}</div>
                    </div>
                  </div>
                  <div className='mt-3'>
                    <div className='th-fw-500 th-16 mb-2'>Review</div>
                    <div
                      className='px-1 py-2 th-br-5'
                      style={{ outline: '1px solid #D9D9D9' }}
                    >
                      {ratingLevelReview?.map((obj, index) => {
                        return (
                          <div className='row py-1 align-items-center'>
                            <div className='col-6 text-left' key={index}>
                              {obj?.name}
                            </div>
                            <div className='col-6'>
                              <Select
                                className='th-grey th-bg-grey th-br-4 th-select w-100 text-left'
                                bordered={true}
                                getPopupContainer={(trigger) => trigger.parentNode}
                                placement='bottomRight'
                                placeholder='Select Option'
                                suffixIcon={<DownOutlined className='th-black-1' />}
                                dropdownMatchSelectWidth={false}
                                onChange={(e, val) => handleRemark(val, obj?.id)}
                                filterOption={(input, options) => {
                                  return (
                                    options.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  );
                                }}
                                menuItemSelectedIcon={
                                  <CheckOutlined className='th-primary' />
                                }
                              >
                                {obj?.remarks?.map((each) => {
                                  return (
                                    <Option value={each?.name} key={each?.score}>
                                      {each?.name}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </div>
                          </div>
                        );
                      })}
                      <div className='row align-items-center'>
                        <div className='col-md-4 py-2 th-16'>
                          <Upload {...uploadProps} className='w-75'>
                            <Button icon={<UploadOutlined />}>
                              {file ? 'Change' : 'Upload'} File
                            </Button>
                          </Upload>
                        </div>
                        <div className='col-md-8 py-2 th-10'>
                          {!file ? (
                            'Upload .jpeg,.png,.mp4 file only'
                          ) : (
                            <div className='th-14'>
                              <div className='d-flex jusify-content-between pl-1 py-2  align-items-center'>
                                <div
                                  className='th-12 th-black-1 text-truncate th-width-90'
                                  title={file?.name}
                                >
                                  {file?.name}
                                </div>

                                <div className='th-pointer ml-2'>
                                  <img
                                    src={smallCloseIcon}
                                    onClick={() => setFile(null)}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
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
                        {' '}
                        <ButtonAnt
                          className='th-button-active th-br-6 text-truncate th-pointer'
                          onClick={() => submitLevelReview()}
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
              <div className=' th-fw-600 th-16'>{data?.student_name}</div>
              <div className=' th-fw-500 th-14'>{data?.erp_id}</div>
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

        {isRoundAvailable
          ?
          <>
            <div className='col-12 d-flex justify-content-center align-items-center, p-2'>
              <table className='w-100' style={{ background: '#eee' }}>
                <thead>
                  <tr style={{ background: '#4800c9', textAlign: 'center', color: 'white' }}>
                    <th> </th>
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
                        {tableHeader?.map((each, i) => (
                          <td style={{ padding: '5px' }}>
                            <Input
                              value={
                                ratingReview.filter(
                                  (el) => el?.name == each?.name && el.level == item
                                )[0]?.remarks
                              }
                              className='text-center'
                              placeholder={`Enter ${each?.name} for ${item}`}
                              onChange={(event) => handleInputEvent(event, item, each)}
                            />
                          </td>
                        ))}
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
                      <div className='col-6 px-0 d-flex align-items-center justify-content-start'>
                        <span
                          style={{
                            fontWeight: 500,
                            marginRight: '5px',
                            fontSize: '15px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          Overall {<CaretRightOutlined />}
                        </span>
                        <Input
                          value={overallRemarks}
                          placeholder={`Enter for OverAll`}
                          onChange={(event) => handleOverAll(event, item, index)}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className='col-12 px-0 d-flex justify-content-center align-items-center'>
              <div className='p-2'>
                <ButtonAnt
                  type='primary'
                  icon={<ScheduleOutlined />}
                  onClick={() => submitReview()}
                >
                  Submit Review
                </ButtonAnt>
              </div>
            </div>
          </>
          : <>
            <div
              className='px-1 py-2 th-br-5'
              style={{ outline: '1px solid #D9D9D9' }}
            >
              {ratingLevelReview?.map((obj, index) => {
                return (
                  <div className='row py-1 align-items-center'>
                    <div className='col-6 text-left' key={index}>
                      {obj?.name}
                    </div>
                    <div className='col-6'>
                      <Select
                        className='th-grey th-bg-grey th-br-4 th-select w-100 text-left'
                        bordered={true}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        placement='bottomRight'
                        placeholder='Select Option'
                        suffixIcon={<DownOutlined className='th-black-1' />}
                        dropdownMatchSelectWidth={false}
                        onChange={(e, val) => handleRemark(val, obj?.id)}
                        filterOption={(input, options) => {
                          return (
                            options.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          );
                        }}
                        menuItemSelectedIcon={
                          <CheckOutlined className='th-primary' />
                        }
                      >
                        {obj?.remarks?.map((each) => {
                          return (
                            <Option value={each?.name} key={each?.score}>
                              {each?.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className='col-12 px-0 d-flex justify-content-right align-items-center'>
              <div className='row align-items-center'>
                <div className='col-md-4 py-12 th-16'>
                  <Upload {...uploadProps} className='w-75'>
                    <Button icon={<UploadOutlined />}>
                      {file ? 'Change' : 'Upload'} File
                    </Button>
                  </Upload>
                </div>
                <div className='col-md-8 py-2 th-10'>
                  {!file ? (
                    'Upload .jpeg,.png,.mp4 file only'
                  ) : (
                    <div className='th-14'>
                      <div className='d-flex jusify-content-between pl-1 py-2  align-items-center'>
                        <div
                          className='th-12 th-black-1 text-truncate th-width-90'
                          title={file?.name}
                        >
                          {file?.name}
                        </div>

                        <div className='th-pointer ml-2'>
                          <img
                            src={smallCloseIcon}
                            onClick={() => setFile(null)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='col-12 px-0 d-flex justify-content-center align-items-center'>
              <div className='p-2'>
                <ButtonAnt
                  type='primary'
                  icon={<ScheduleOutlined />}
                  onClick={() => submitLevelReview()}
                >
                  Submit Review
                </ButtonAnt>
              </div>
            </div>


          </>}
      </Modal>
    </>
  );
};

export default PhysicalPendingReview;
