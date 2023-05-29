import React, { useState, useRef, useEffect, useContext } from 'react';
import endpoints from '../../config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import smallCloseIcon from 'v2/Assets/dashboardIcons/announcementListIcons/smallCloseIcon.svg';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
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
  Upload,
  Button,
} from 'antd';
import {
  MonitorOutlined,
  CloseOutlined,
  UserOutlined,
  DownOutlined,
  CheckOutlined,
  UploadOutlined,
} from '@ant-design/icons';

import { makeStyles } from '@material-ui/core/styles';

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

const VisualPendingReview = (props) => {
  const history = useHistory();
  const [value, setValue] = useState();
  const { Option } = Select;
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  // const { setAlert } = useContext(AlertNotificationContext);
  const subActivityData = localStorage?.getItem('VisualActivityId')
    ? JSON.parse(localStorage.getItem('VisualActivityId'))
    : '';
  const [inputList, setInputList] = useState([{ remarks: '', id: '', given_rating: '' }]);
  const [totalSubmitted, setTotalSubmitted] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const [isClicked, setIsClicked] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [view, setView] = useState(false);
  const { user_id } = JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
  const [sourceData, setSourceData] = useState([]);
  const [targetData, setTargetData] = useState([]);
  const [ratingReview, setRatingReview] = useState([]);
  const [remarksOption, setRemarksOption] = useState([]);
  const [remarkedData, setRemarkedData] = useState([]);
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [bookingID, setBookingID] = useState(null);

  const handleCloseViewMore = () => {
    setView(false);
    setRatingReview([]);
    setFile(null);
  };

  const [values, setValues] = useState();
  const [loading, setLoading] = useState(false);
  const [publish, setPublish] = useState(false);
  const [submit, setSubmit] = useState(false);

  const allowedFiles = ['.jpeg', '.jpg', '.png', '.mp4'];

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
  const submitReview = () => {
    let body = [];
    let checkSelected = ratingReview.every((item) => item.checked);
    if (!checkSelected) {
      message.error('Please Select All Option');
      return;
    } else {
      ratingReview.forEach((item) => {
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
        if (file) {
          uploadFile();
        }
        setView(false);
        setLoading(false);
        setRatingReview([]);
        fileRef.current.value = '';
        setFile(null);
        erpAPI();
        message.success('Review Submitted Successfully');
        return;
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const [dataId, setDataId] = useState();

  const [maxWidth, setMaxWidth] = React.useState('lg');

  const functionFilter = (sourceData, targetData) => {
    setLoading(true);
    var finalData = [];
    sourceData.filter((item) => {
      targetData.forEach((ele) => {
        if (ele?.erp_id !== item?.erp_id) {
          finalData.push(item);
        }
      });
    });

    var res = sourceData.filter(
      (item) => !targetData.map((item2) => item2?.erp_id).includes(item?.erp_id)
    );
    if (finalData == 0) {
      setTotalSubmitted(sourceData);
    } else {
      setTotalSubmitted(res);
    }
    setLoading(false);
  };

  const erpAPI = () => {
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
        message.success(response?.data?.message);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const ActivityManagement = (sourceData) => {
    axios
      .get(
        `${endpoints.newBlog.physicalErpReview}?branch_id=${props.selectedBranch}&grade_id=${props.selectedGrade}&section_id=${props.selectedSubject}&activity_id=${subActivityData?.id}`,
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
      .catch(() => {
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

  const [data, setData] = useState();
  let array = [];
  const showReview = (data) => {
    setBookingID(data?.booking_detail_id);
    if (data) {
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

          setRatingReview(array);
          setLoading(false);
          setView(true);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  const addBookingApi = (data) => {
    setLoading(true);
    axios
      .get(
        `${endpoints.newBlog.bookingDetailsApi}?erp_id=${
          data?.erp_id
        }&activity_detail_id=${subActivityData?.id}&user_level=${13}`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
            Authorization: `${token}`,
          },
        }
      )
      .then((response) => {
        if (response?.data?.status_code === 200) {
          showReview(response?.data?.result);
          setLoading(false);
        } else if (response?.data?.status_code === 500) {
          message.error(response?.data?.message);
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const assignPage = (data) => {
    addBookingApi(data);
    setData(data);
    setDataId(data?.erp_id);
  };

  useEffect(() => {
    if (props.selectedBranch === undefined || props.selectedGrade === undefined) {
      setTotalSubmitted([]);
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag, props?.value]);

  useEffect(() => {
    if (props.flag) {
      //console.log("props.setSubjectName  ",props.setSubjectName);
      //console.log("props?.value ",props?.value);
      getTotalSubmitted();
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag, currentPage, props?.value]);

  let dummyArr = [];

  const handleRemark = (value, id) => {
    const arr1 = ratingReview?.map((obj) => {
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
    setRatingReview(arr1);
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

  const handleFileChange = (event) => {
    const { files } = event.target;
    const fil = files[0] || '';
    if (
      fil.name.lastIndexOf('.mp4') > 0 ||
      fil.name.lastIndexOf('.jpeg') > 0 ||
      fil.name.lastIndexOf('.jpg') > 0
    ) {
      setFile(fil);
      return;
    } else {
      message.error('Only Video & Image File is acceptable');
      setLoading(false);
      setFile(null);
      return;
      fileRef.current.value = null;
    }
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
  const columns = [
    // {
    //   title: <span className='th-white th-fw-700'>SL No.</span>,
    //   align: 'center',
    //   width: '15%',
    //   render: (text, row, index) => <span className='th-black-1'>{index + 1}</span>,
    // },
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
          scroll={{ x: totalSubmitted.length > 0 ? 'max-content' : null, y: 600 }}
        />
      </div>
      <Drawer
        title={<span className='th-fw-500'>Submit Review</span>}
        placement='right'
        onClose={handleCloseViewMore}
        zIndex={1300}
        visible={view}
        width={'35vw'}
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
                      {ratingReview?.map((obj, index) => {
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

export default VisualPendingReview;
