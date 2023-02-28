import React, { useState, useRef, useEffect, useContext } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
// import { Button, Grid, Drawer, TextField, Divider, withStyles } from '@material-ui/core';
import StarsIcon from '@material-ui/icons/Stars';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
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
} from 'antd';
import {
  MonitorOutlined,
  CloseOutlined,
  UserOutlined,
  DownOutlined,
  CheckOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import RatingScale from './RatingScale';
import ReactHtmlParser from 'react-html-parser';
import { TablePagination } from '@material-ui/core';
import endpoints from '../../config/endpoints';
import Loader from 'components/loader/loader';

import axios from 'axios';
import './images.css';
const DEFAULT_RATING = 0;
// const StyledRating = withStyles((theme) => ({
//   iconFilled: {
//     color: '#E1C71D',
//   },
//   root: {
//     '& .MuiSvgIcon-root': {
//       color: 'currentColor',
//     },
//   },
//   iconHover: {
//     color: 'yellow',
//   },
// }))(Rating);

function createData(slno, name, grade, submissiondate, overallscore, actions) {
  return { slno, name, grade, submissiondate, overallscore, actions };
}

const PhysicalReviewed = (props) => {
  const { Option } = Select;
  const [value, setValue] = React.useState();
  const [totalSubmitted, setTotalSubmitted] = useState([]);
  const PhysicalActivityId = JSON.parse(localStorage.getItem('PhysicalActivityId')) || {};
  const ActivityId = JSON.parse(localStorage.getItem('ActivityId')) || {};
  // const classes = useStyles();
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
        setButtonFlag(true);
        getTotalSubmitted();
        setLoading(false);
        message.success('Activity Shortlisted Successfully')
        return
      });
  };

  const getTotalSubmitted = () => {
    if (props) {
      setLoading(true);
      // const branchIds = props.selectedBranch.map((obj) => obj.id);
      // const gradeIds = props?.selectedGrade?.id

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
          // message.success(response?.data?.message)
        })
        .catch((err) => {
          setLoading(false);
          message.error(err?.data?.message)
          return
        });
    }
  };

  const assignPage = (data) => {
    if (data?.length !== 0) {
      setView(true);
      //   setImageData(JSON?.parse(data?.template?.html_file))
      setData(data);
      setDataId(data?.id);

      getRatingView(data?.id);
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
  const handleCloseViewMore = () => {
    setView(false);
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
      title: <span className='th-white th-fw-700'>Submission Date</span>,
      align: 'center',
      render: (text, row) => <span className='th-black-1'>{row?.submitted_on?.substring(0, 10)}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Reviewed By</span>,
      align: 'center',
      render: (text, row) => <span className='th-black-1'>{row?.reviewer}</span>,
    },
    
    {
      title: <span className='th-white th-fw-700'>Overall Score</span>,
      align: 'center',
      render: (text, row) => <span className='th-black-1'>{row?.user_reviews?.remarks}</span>,
    },
    {
      title: <span className='th-white th-fw-700'>Actions</span>,
      dataIndex: '',
      align: 'center',
      width: '25%',
      render: (text, row) => (
        <div className='th-black-1'>
          <Tag
            icon={<FileSearchOutlined  className='th-14' />}
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
                      <div className=' th-fw-600 th-16'>{data?.booked_user?.name}</div>
                      <div className=' th-fw-500 th-14'>{data?.booked_user?.username}</div>
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
                                  {filterRound(obj?.level)}
                                </b>
                              </div>
                            )}
                            {obj?.name == 'Overall' ? (
                              ''
                            ) : (
                              <div>
                                <Input placeholder={obj?.name} value={obj?.remarks} />
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
                                <Input placeholder={obj?.name} value={obj?.remarks} />
                              </div>
                            ) : (
                              ''
                            )}
                          </div>
                        );
                      })}
                      {/* <div
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
                        >
                          Submit Review
                        </ButtonAnt>
                      </div> */}
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
                <TableCell className={classes.tableCell}>Submission Date</TableCell>
                <TableCell className={classes.tableCell}>Reviewed By</TableCell>
                <TableCell className={classes.tableCell}>Overall Score</TableCell>
                <TableCell className={classes.tableCell}></TableCell>

                <TableCell className={classes.tableCell} style={{ width: '261px' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            {totalSubmitted?.map((response, index) => (
              <TableBody>
                <TableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                >
                  <TableCell className={classes.tableCells}>{index + 1}</TableCell>
                  <TableCell className={classes.tableCells}>
                    {' '}
                    {response?.booked_user?.name}
                    {response?.name}
                  </TableCell>
                  <TableCell className={classes.tableCells}>
                    {' '}
                    {response?.booked_user?.username}
                  </TableCell>
                  <TableCell className={classes.tableCells}>
                    {response?.submitted_on?.substring(0, 10)}
                  </TableCell>
                  <TableCell className={classes.tableCells}>{response?.reviewer}</TableCell>
                  <TableCell className={classes.tableCells}>
                    {response?.user_reviews?.remarks}
                  </TableCell>
                  <TableCell className={classes.tableCells}>
                    {response?.is_bookmarked == true ? (
                      <BookmarksIcon style={{ color: 'gray' }} />
                    ) : (
                      ''
                    )}
                  </TableCell>

                  <TableCell className={classes.tableCells}>
                    <ButtonAnt
                      type="primary"
                      icon={<FileProtectOutlined />}
                      onClick={() => assignPage(response)}
                      size={'medium'}>
                      Check Review
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
          <div style={{ fontSize: '24px', marginLeft: '6px', display: 'flex', justifyContent: 'space-between' }}>
            <strong>Preview</strong>
            <strong onClick={handleCloseViewMore} style={{ cursor: 'pointer', marginRight: '10px' }} >
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
                  <div style={{ display: 'flex', width: '100%', padding: '0.5rem 1rem', alignItems: 'center' }}>
                    <div style={{ padding: '5px' }}>
                      <Avatar size={50} aria-label="recipe" icon={<UserOutlined color='#f3f3f3' style={{ color: '#f3f3f3' }} twoToneColor="white" />}>
                      </Avatar>
                    </div>
                    <div style={{ padding: '0 0.5rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '16px' }}>
                        {data?.booked_user?.name}
                      </div>
                      <div style={{ fontWeight: 500, fontSize: '14px' }}>
                        {data?.branch?.name}
                      </div>
                      <div style={{ fontWeight: 500, fontSize: '12px' }}>
                        {data?.grade?.name}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    background: '#f9f9f9',
                    margin: 'auto',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px',
                    height: 'auto',
                    border: '1px solid #dbdbdb',
                    width: '36vw',
                    maxHeight: '20vh',
                    overflowY: 'auto'

                  }}
                >
                  <div
                    style={{ display: 'flex', justifyContent: 'flex-start', fontWeight: 'bold', paddingLeft: '10px', marginTop: '10px' }}
                  >
                    <span style={{ fontWeight: 'normal', fontSize: '16px', }}>
                      Title: {data?.activity_detail?.title}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      fontWeight: 'bold',
                      paddingLeft: '10px',
                      paddingBottom: '10px'
                    }}
                  >
                    <span style={{ fontWeight: 'normal', color: 'gray', fontSize: '12px' }}>
                      Description: {data?.activity_detail?.description}
                    </span>
                  </div>
                </div>
                <Divider style={{ margin: '1.5rem 0.5rem' }} />
                <div
                  style={{
                    background: 'white',
                    width: '502px',
                    marginLeft: '34px',
                    height: 'auto',
                    margin: 'auto',
                  }}
                >
                  <div style={{ paddingTop: '12px' }}>

                    <Grid item>
                      {submit == false && (
                        <div
                          style={{
                            border: '1px solid #707070',
                            borderRadius: '10px',
                            height: 'auto',
                            padding: '0.5rem'
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
                                  ""
                                ) : (
                                  <div
                                    key={index}
                                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}
                                  >
                                    {' '}
                                    {obj?.name}<b style={{ color: '#53bedd', fontSize: '12px' }}>{filterRound(obj?.level)}</b>
                                  </div>
                                )}
                                {obj?.name == 'Overall' ? (
                                  ""
                                ) : (
                                  <div>
                                    <Input
                                      placeholder={obj?.name}
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
                                {obj?.name == "Overall" ? (
                                  <div>
                                    {obj?.name}*
                                    <Input placeholder={obj?.name}
                                      value={obj?.remarks}
                                    />
                                  </div>

                                ) : (
                                  ""
                                )}
                              </div>

                            )
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
                          </div>
                          <div
                            style={{
                              paddingLeft: '15px',
                              paddingRight: '15px',
                              paddingTop: '5px',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              Overall
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
            </Grid>
          </Grid>
        </div>
      </Drawer> */}
    </>
  );
};

export default PhysicalReviewed;
