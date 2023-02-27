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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';
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

import {
  MonitorOutlined,
  CloseOutlined,
  UserOutlined,
  DownOutlined,
  CheckOutlined,
} from '@ant-design/icons';

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
                  {/* <div className='row text px-1 text-left mt-2'>
                    <div className='col-12 px-0'>
                      <span style={{ fontWeight: 'normal', fontSize: '16px' }}>
                        Title: {data?.activity_detail?.title}
                      </span>
                    </div>
                    <div className='col-12 px-0'>
                      <span
                        className='text-left'
                        style={{ fontWeight: 'normal', color: 'gray', fontSize: '12px', height:'15vh', border:'1px solid grey', borderRadius:'10px' }}
                      >
                        Description: {data?.activity_detail?.description}
                      </span>
                    </div>
                  </div> */}
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
                <TableCell className={classes.tableCell}>Actions</TableCell>
              </TableRow>
            </TableHead>
            {totalSubmitted &&
              totalSubmitted?.map((response, index) => (
                <TableBody>
                  <TableRow hover role='checkbox' tabIndex={-1}>
                    <TableCell className={classes.tableCells}>{index + 1}</TableCell>
                    <TableCell className={classes.tableCells}>
                      {response?.booked_user?.name}
                    </TableCell>
                    <TableCell className={classes.tableCells}>
                      {response?.booked_user?.username}
                    </TableCell>
                    <TableCell className={classes.tableCells}>
                      {response?.submitted_on?.substring(0, 10)}
                    </TableCell>
                    <TableCell className={classes.tableCells}>
                      <Button
                        variant='outlined'
                        size='small'
                        onClick={() => assignPage(response)}
                        className={classes.buttonColor2}
                      >
                        Add Review
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))}
          </Table>
          <TablePagination
            component='div'
            count={totalCount}
            rowsPerPage={limit}
            page={Number(currentPage) - 1}
            onChangePage={(e, page) => {
              handlePagination(e, page + 1);
            }}
            rowsPerPageOptions={false}
            className='table-pagination'
            classes={{
              spacer: classes.tablePaginationSpacer,
              toolbar: classes.tablePaginationToolbar,
            }}
          />
        </TableContainer>
      </Paper>
      // <Drawer
      //   anchor='right'
      //   maxWidth={maxWidth}
      //   open={view}
      //   onClose={handleCloseViewMore}
      //   aria-labelledby='alert-dialog-title'
      //   aria-describedby='alert-dialog-description'
      // >
      //   <div style={{ width: '100%', padding: '5px' }}>
      //     <div
      //       style={{
      //         fontSize: '24px',
      //         marginLeft: '6px',
      //         display: 'flex',
      //         justifyContent: 'space-between',
      //       }}
      //     >
      //       <strong>Preview</strong>
      //       <strong
      //         onClick={handleCloseViewMore}
      //         style={{ cursor: 'pointer', marginRight: '10px' }}
      //       >
      //         {' '}
      //         <CloseCircleOutlined />
      //       </strong>
      //     </div>
      //     <Divider />

      //     <Grid container direction='row' justifyContent='center'>
      //       <Grid item>
      //         <div
      //           style={{
      //             border: '1px solid #813032',
      //             width: '583px',
      //             background: 'white',
      //             height: 'auto',
      //           }}
      //         >
      //           <div
      //             style={{
      //               background: 'white',
      //               width: '554px',
      //               marginLeft: '13px',
      //               marginTop: '5px',
      //             }}
      //           >
      //             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      //               <img
      //                 src='https://image3.mouthshut.com/images/imagesp/925725664s.png'
      //                 width='130'
      //                 alt='image'
      //               />
      //             </div>
      //           </div>
      //           <div
      //             style={{
      //               background: 'white',
      //               width: '502px',
      //               marginLeft: '34px',
      //               height: 'auto',
      //               marginTop: '12px',
      //               marginBottom: '29px',
      //             }}
      //           >
      //             <div style={{ paddingTop: '12px' }}>
      //               <div
      //                 style={{
      //                   background: `url(${data?.template?.template_path})`,
      //                   backgroundSize: 'contain',
      //                   position: 'relative',
      //                   backgroundRepeat: 'no-repeat',
      //                   backgroundPosition: 'center',
      //                   backgroundColor: 'rgba(244 245 247 / 25%)',
      //                   height: '683px',
      //                 }}
      //               >
      //                 <div className='certificate-text-center certificate-input-box'>
      //                   <textarea
      //                     className='certificate-box'
      //                     style={{ width: '338px', height: '366px' }}
      //                     value={data?.submitted_work?.html_text}
      //                     placeholder='type text here...'
      //                   />
      //                 </div>
      //               </div>
      //             </div>
      //           </div>
      //         </div>
      //         <div
      //           style={{
      //             display: 'flex',
      //             flexDirection: 'row-reverse',
      //             paddingTop: '9px',
      //           }}
      //         ></div>
      //       </Grid>
      //       <Grid item>
      //         <div>
      //           <div style={{ display: 'flex', width: '100%', padding: '0.5rem 1rem' }}>
      //             <div style={{ padding: '5px' }}>
      //               <Avatar
      //                 size={40}
      //                 aria-label='recipe'
      //                 icon={
      //                   <UserOutlined
      //                     color='#f3f3f3'
      //                     style={{ color: '#f3f3f3' }}
      //                     twoToneColor='white'
      //                   />
      //                 }
      //               ></Avatar>
      //             </div>
      //             <div style={{ padding: '0 0.5rem' }}>
      //               <div style={{ fontWeight: 600, fontSize: '16px' }}>
      //                 {data?.booked_user?.name}
      //               </div>
      //               <div style={{ fontWeight: 500, fontSize: '14px' }}>
      //                 {data?.branch?.name}
      //               </div>
      //               <div style={{ fontWeight: 500, fontSize: '12px' }}>
      //                 {data?.grade?.name}
      //               </div>
      //             </div>
      //           </div>
      //         </div>
      //         <div
      //           style={{
      //             background: '#f9f9f9',
      //             margin: '0.5rem 1rem',
      //             padding: '0.5rem 1rem',
      //             borderRadius: '5px',
      //             marginTop: '10px',
      //             height: 'auto',
      //             border: '1px solid #dbdbdb',
      //             width: '21vw',
      //             overflowY: 'auto',
      //             maxHeight: '16vh',
      //           }}
      //         >
      //           <div
      //             style={{
      //               display: 'flex',
      //               justifyContent: 'flex-start',
      //               fontWeight: 'bold',
      //               paddingLeft: '10px',
      //               marginTop: '10px',
      //             }}
      //           >
      //             <span style={{ fontWeight: 'normal', fontSize: '16px' }}>
      //               Title: {data?.activity_detail?.title}
      //             </span>
      //           </div>
      //           <div
      //             style={{
      //               display: 'flex',
      //               justifyContent: 'flex-start',
      //               fontWeight: 'bold',
      //               paddingLeft: '10px',
      //               paddingBottom: '10px',
      //             }}
      //           >
      //             <span style={{ fontWeight: 'normal', color: 'gray', fontSize: '12px' }}>
      //               Description: {data?.activity_detail?.description}
      //             </span>
      //           </div>
      //         </div>
      //         <Divider />
      //         {submit == false ? (
      //           <div style={{ padding: '10px' }}>Add Review</div>
      //         ) : (
      //           <div style={{ padding: '10px' }}>Edit Review</div>
      //         )}
      //         {submit == false && (
      //           <div
      //             style={{
      //               border: '1px solid grey',
      //               width: '295px',
      //               height: 'auto',
      //               marginLeft: '11px',
      //               marginRight: '10px',
      //               borderRadius: '5px',
      //               background: '#f4f5f9',
      //             }}
      //           >
      //             {ratingReview?.map((obj, index) => {
      //               return (
      //                 <div
      //                   key={index}
      //                   style={{
      //                     paddingLeft: '15px',
      //                     paddingRight: '15px',
      //                     paddingTop: '5px',
      //                   }}
      //                 >
      //                   {obj?.name === 'Overall' ? (
      //                     <div
      //                       key={index}
      //                       style={{ display: 'flex', justifyContent: 'space-between' }}
      //                     >
      //                       {obj.name}*
      //                       <StyledRating
      //                         name={`rating`}
      //                         size='small'
      //                         value={calculateOverallRating()}
      //                         max={obj?.rating}
      //                         precision={0.1}
      //                         readOnly
      //                       />
      //                     </div>
      //                   ) : (
      //                     <div
      //                       key={index}
      //                       style={{ display: 'flex', justifyContent: 'space-between' }}
      //                     >
      //                       {' '}
      //                       {obj?.name}
      //                       <StyledRating
      //                         name={`rating${index}`}
      //                         size='small'
      //                         value={obj?.given_rating}
      //                         max={obj?.rating}
      //                         onChange={(event, newValue) =>
      //                           handleInputCreativityOne(event, newValue, index)
      //                         }
      //                       />
      //                     </div>
      //                   )}
      //                   {obj?.name == 'Overall' ? (
      //                     <div>
      //                       <TextField
      //                         id='outlined-basic'
      //                         size='small'
      //                         variant='outlined'
      //                         value={obj?.remarks}
      //                         style={{ width: '264px', background: 'white' }}
      //                         onChange={(event) => handleInputCreativity(event, index)}
      //                         label='Mandatory'
      //                       />
      //                     </div>
      //                   ) : (
      //                     <div>
      //                       <TextField
      //                         id='outlined-basic'
      //                         size='small'
      //                         variant='outlined'
      //                         value={obj?.remarks}
      //                         style={{ width: '264px', background: 'white' }}
      //                         onChange={(event) => handleInputCreativity(event, index)}
      //                         label='Optional'
      //                       />
      //                     </div>
      //                   )}
      //                 </div>
      //               );
      //             })}
      //             <div
      //               style={{
      //                 display: 'flex',
      //                 flexDirection: 'column',
      //                 marginRight: '10px',
      //                 marginLeft: '6px',
      //                 marginBottom: '15px',
      //                 marginTop: '32px',
      //               }}
      //             >
      //               {' '}
      //               <Button
      //                 variant='contained'
      //                 color='primary'
      //                 size='medium'
      //                 className={classes.buttonColor}
      //                 onClick={() => submitReview()}
      //               >
      //                 Submit Review
      //               </Button>
      //             </div>
      //           </div>
      //         )}

      //         {submit == true && (
      //           <div
      //             style={{
      //               border: '1px solid #707070',
      //               width: '318px',
      //               height: 'auto',
      //               marginLeft: '8px',
      //               marginRight: '4px',
      //             }}
      //           >
      //             <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
      //               <ExpandMoreIcon onClick={expandMore} />
      //             </div>
      //             <div
      //               style={{
      //                 paddingLeft: '15px',
      //                 paddingRight: '15px',
      //                 paddingTop: '5px',
      //               }}
      //             >
      //               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      //                 {' '}
      //                 Overall
      //                 <RatingScale
      //                   name='simple-controlled'
      //                   defaultValue={DEFAULT_RATING}
      //                   onChange={(event, value) => {
      //                     setValue((prev) => ({ ...prev, rating: value }));
      //                   }}
      //                 />
      //               </div>
      //               <div
      //                 style={{
      //                   display: 'flex',
      //                   justifyContent: 'center',
      //                   paddingBottom: '9px',
      //                 }}
      //               >
      //                 Review Submitted
      //               </div>
      //             </div>
      //           </div>
      //         )}
      //       </Grid>
      //     </Grid>
      //   </div>
      // </Drawer> */}
    </>
  );
};

export default PendingReview;
