import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from 'react';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';
// import { Button } from '@material-ui/core';
import endpoints from '../../config/endpoints';
import Loader from 'components/loader/loader';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RatingScale from './HoverRating';
import ReactHtmlParser from 'react-html-parser';
import Rating from '@material-ui/lab/Rating';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
// import {
//   TablePagination,
//   Grid,
//   Drawer,
//   Divider,
//   TextField,
//   Dialog,
// } from '@material-ui/core';

import {
  Button as ButtonAnt,
  Input,
  Avatar,
  Select,
  Tag,
  Table as TableAnt,
  Drawer,
  Space,
  message
} from 'antd';
import {
  MonitorOutlined,
  CloseOutlined,
  UserOutlined,
  DownOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import axiosInstance from 'config/axios';

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

const dummyData1 = [
  { user_id: 9709, name: 'Vinay_04', erp_id: '20217770127_OLV', level: 13 },
  { user_id: 9707, name: 'Vinay_03', erp_id: '2200366_AYI', level: 13 },
  { user_id: 970, name: 'Vinay_2', erp_id: '2200365_AYI', level: 13 },
];

const PhysicalPendingReview = (props) => {
  const history = useHistory();
  const { Option } = Select;
  const [value, setValue] = useState();
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  // const { setAlert } = useContext(AlertNotificationContext);
  const ActivityId = JSON.parse(localStorage.getItem('ActivityId')) || {};
  const [inputList, setInputList] = useState([{ remarks: '', id: '', given_rating: '' }]);
  const [totalSubmitted, setTotalSubmitted] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const [isClicked, setIsClicked] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [view, setView] = useState(false);
  const { user_id } = JSON.parse(localStorage.getItem('ActivityManagementSession'));
  const [sourceData, setSourceData] = useState([]);
  const [targetData, setTargetData] = useState([]);

  const handleCloseViewMore = () => {
    setView(false);
  };

  const [values, setValues] = useState();
  const [loading, setLoading] = useState(false);
  const [publish, setPublish] = useState(false);
  const createPublish = () => {
    setPublish(true);
  };
  const [submit, setSubmit] = useState(false);
  const submitReview = () => {
    setView(false);
    // props.setValue(1)
    // setSubmit(true);
    let mandatory = ratingReview.filter((e) => e?.name === 'Overall');
    if (!mandatory[0].remarks) {
      message.error('Overall Remarks Is Compulsory')
      return;
    }
    let body = ratingReview;
    let overAllIndex = body.findIndex((each) => each?.name === 'Overall');
    body[overAllIndex].given_rating = calculateOverallRating();
    setLoading(true);
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
        message.success(' Review Submitted Successfully')
        setLoading(false);
      });
  };

  const [dataId, setDataId] = useState();

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

  const [maxWidth, setMaxWidth] = React.useState('lg');

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
    // console.log(A.filter(a => !B.map(b=>b.id).includes(a.id)))
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
        message.success(response?.data?.message)
        setLoading(false);
      });
  };

  const ActivityManagement = (sourceData) => {
    setLoading(true);
    axios
      // .get(`${endpoints.newBlog.physicalErpReview}?branch_id=${1}&grade_id=${2}&section_id=${1}&activity_id=${1784}`, {
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
        // functionFilter(sourceData,dummyData1)
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

  const [ratingReview, setRatingReview] = useState([]);
  const [data, setData] = useState();
  let array = [];
  const showReview = (data) => {
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
          response.data.map((obj, index) => {
            let temp = {};
            temp['id'] = obj?.id;
            temp['name'] = obj?.level.name;
            temp['remarks'] = obj?.remarks;
            temp['given_rating'] = obj?.given_rating;
            temp['level'] = obj?.level?.rating;
            temp['reviewer_id'] = user_id;
            array.push(temp);
          });
          setRatingReview(array);
          setLoading(false);
          setView(true);
        })
        .catch((err) => {
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

  const assignPage = (data) => {
    addBookingApi(data);
    setData(data);
    setDataId(data?.erp_id);
  };

  useEffect(() => {
    if (props.selectedBranch === undefined || props.selectedGrade === undefined) {
      setTotalSubmitted([]);
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag]);

  useEffect(() => {
    if (props.flag) {
      getTotalSubmitted();
    }
  }, [props.selectedBranch, props.selectedGrade, props.flag, currentPage]);

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
      console.log(average, 'average', aver, 'ave');
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
          pagination={false}
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
                          <div
                            key={index}
                            style={{
                              paddingLeft: '15px',
                              paddingRight: '15px',
                              paddingTop: '5px',
                            }}
                          >
                            {obj?.name === 'Overall' ? (
                              ''
                            ) : (
                              <div
                                key={index}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  marginBottom: '10px',
                                }}
                              >
                                {' '}
                                {obj?.name}
                                <b style={{ color: '#53bedd', fontSize: '12px' }}>
                                  {/* <Tag color='magenta'>  */}
                                  {filterRound(obj?.level)}
                                  {/* </Tag> */}
                                </b>
                              </div>
                            )}
                            {obj?.name == 'Overall' ? (
                              ''
                            ) : (
                              <div>
                                <Input
                                  style={{ background: 'white' }}
                                  placeholder={obj?.name}
                                  onChange={(event) =>
                                    handleInputCreativity(event, index)
                                  }
                                  value={obj?.remarks}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {ratingReview?.map((obj, index) => {
                        return (
                          <div
                            key={index}
                            style={{
                              paddingLeft: '15px',
                              paddingRight: '15px',
                              paddingTop: '5px',
                            }}
                          >
                            {obj?.name == 'Overall' ? (
                              <div>
                                {obj?.name}*
                                <Input
                                  placeholder={obj?.name}
                                  onChange={(event) =>
                                    handleInputCreativity(event, index)
                                  }
                                  value={obj?.remarks}
                                />
                              </div>
                            ) : (
                              ''
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

      {/* {loading && <Loader />}
      <Paper className={`${classes.root} common-table`} id='singleStudent'>
        <TableContainer
          className={`table table-shadow view_users_table ${classes.container}`}
        >
          <Table stickyHeader aria-label='sticky table'>
            <TableHead className={`${classes.columnHeader} table-header-row`}>
              <TableRow>
                <TableCell className={classes.tableCell} style={{ whiteSpace: 'nowrap' }}>
                  S No.
                </TableCell>
                <TableCell className={classes.tableCell}>Student Name</TableCell>
                <TableCell className={classes.tableCell}>ERP ID</TableCell>

                <TableCell className={classes.tableCell}>Actions</TableCell>
              </TableRow>
            </TableHead>
            {console.log(totalSubmitted, 'kl')}
            {totalSubmitted?.map((response, index) => (
              <TableBody>
                <TableRow hover role='checkbox' tabIndex={-1}>
                  <TableCell className={classes.tableCells}>{index + 1}</TableCell>
                  <TableCell className={classes.tableCells}>
                    {response?.student_name}
                  </TableCell>
                  <TableCell className={classes.tableCells}>{response?.erp_id}</TableCell>
                  <TableCell className={classes.tableCells}>
                    <ButtonAnt
                      type='primary'
                      style={{ backgroundColor: '#4caf50', border: '1px solid #4caf50' }}
                      icon={<MonitorOutlined />}
                      onClick={() => assignPage(response)}
                      size={'medium'}
                    >
                      Add Review
                    </ButtonAnt>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
        </TableContainer>
      </Paper>
      <Drawer
        anchor='right'
        maxWidth={maxWidth}
        open={view}
        onClose={handleCloseViewMore}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <div style={{ width: '100%', padding: '10px' }}>
          <div
            style={{
              fontSize: '24px',
              marginLeft: '6px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <strong>Preview</strong>
            <strong
              onClick={handleCloseViewMore}
              style={{ cursor: 'pointer', marginRight: '10px' }}
            >
              <CloseCircleOutlined />
            </strong>
          </div>
          <Divider />

          <Grid container direction='row' justifyContent='center'>
            <Grid item>
              <div
                style={{
                  background: 'white',
                  height: 'auto',
                }}
              >
                <div
                  style={{
                    background: 'white',
                    width: '554px',
                    marginLeft: '13px',
                    marginTop: '5px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <img
                      src='https://image3.mouthshut.com/images/imagesp/925725664s.png'
                      width='130'
                      alt='image'
                    />
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      padding: '0.5rem 1rem',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ padding: '5px' }}>
                      <Avatar
                        size={40}
                        aria-label='recipe'
                        icon={
                          <UserOutlined
                            color='#f3f3f3'
                            style={{ color: '#f3f3f3' }}
                            twoToneColor='white'
                          />
                        }
                      ></Avatar>
                    </div>
                    <div style={{ padding: '0 0.5rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '16px' }}>
                        {data?.student_name}
                      </div>
                      <div style={{ fontWeight: 500, fontSize: '14px' }}>
                        {data?.erp_id}
                      </div>
                    </div>
                  </div>
                </div>
                <Divider />
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
                    <Grid item>
                      {submit == false ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '16px',
                            fontWeight: 600,
                            padding: '0.5rem 1rem',
                          }}
                        >
                          Review
                        </div>
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '18px',
                            fontWeight: 600,
                            color: 'blue',
                            padding: '0.5rem 1rem',
                          }}
                        >
                          Edit Review
                        </div>
                      )}
                      {submit == false && (
                        <div
                          style={{
                            border: '1px solid gray',
                            borderRadius: '10px',
                            background: '#f4f5f9',
                            height: 'auto',
                            padding: '0.5rem',
                          }}
                        >
                          {ratingReview?.map((obj, index) => {
                            return (
                              <div
                                key={index}
                                style={{
                                  paddingLeft: '15px',
                                  paddingRight: '15px',
                                  paddingTop: '5px',
                                }}
                              >
                                {obj?.name === 'Overall' ? (
                                  ''
                                ) : (
                                  <div
                                    key={index}
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      marginBottom: '10px',
                                    }}
                                  >
                                    {' '}
                                    {obj?.name}
                                    <b style={{ color: '#53bedd', fontSize: '12px' }}>
                                      {filterRound(obj?.level)}
                                    </b>
                                  </div>
                                )}
                                {obj?.name == 'Overall' ? (
                                  ''
                                ) : (
                                  <div>
                                    <Input
                                      style={{ background: 'white' }}
                                      placeholder={obj?.name}
                                      onChange={(event) =>
                                        handleInputCreativity(event, index)
                                      }
                                      value={obj?.remarks}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {ratingReview?.map((obj, index) => {
                            return (
                              <div
                                key={index}
                                style={{
                                  paddingLeft: '15px',
                                  paddingRight: '15px',
                                  paddingTop: '5px',
                                }}
                              >
                                {obj?.name == 'Overall' ? (
                                  <div>
                                    {obj?.name}*
                                    <Input
                                      placeholder={obj?.name}
                                      onChange={(event) =>
                                        handleInputCreativity(event, index)
                                      }
                                      value={obj?.remarks}
                                    />
                                  </div>
                                ) : (
                                  ''
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
                            {' '}
                            <ButtonAnt
                              type='primary'
                              size='large'
                              className={classes.buttonColor}
                              onClick={() => submitReview()}
                            >
                              Submit Review
                            </ButtonAnt>
                          </div>
                        </div>
                      )}

                      {submit == true && (
                        <div
                          style={{
                            border: '1px solid #707070',
                            width: '318px',
                            height: 'auto',
                            marginLeft: '8px',
                            marginRight: '4px',
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                            <ExpandMoreIcon onClick={expandMore} />
                          </div>
                          <div
                            style={{
                              paddingLeft: '15px',
                              paddingRight: '15px',
                              paddingTop: '5px',
                            }}
                          >
                            <div
                              style={{ display: 'flex', justifyContent: 'space-between' }}
                            >
                              Overall
                              <RatingScale
                                name='simple-controlled'
                                defaultValue={DEFAULT_RATING}
                                onChange={(event, value) => {
                                  setValue((prev) => ({ ...prev, rating: value }));
                                }}
                              />
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                paddingBottom: '9px',
                              }}
                            >
                              Review Submitted
                            </div>
                          </div>
                        </div>
                      )}
                    </Grid>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  paddingTop: '9px',
                }}
              >
                {' '}
                &nbsp;
              </div>
            </Grid>
          </Grid>
        </div>
      </Drawer> */}
    </>
  );
};

export default PhysicalPendingReview;
