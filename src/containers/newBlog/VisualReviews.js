import React, { useState, useRef, useEffect, useContext } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, Grid, TextField, Divider, withStyles } from '@material-ui/core';
import StarsIcon from '@material-ui/icons/Stars';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

import {
  FileProtectOutlined,
  CloseCircleOutlined,
  UserOutlined,
  DownOutlined,
  CheckOutlined,
  PlayCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import {
  Button as ButtonAnt,
  Tag,
  Avatar,
  Select,
  Tooltip,
  Table as TableAnt,
  Drawer,
  Space,
  Input,
} from 'antd';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import RatingScale from './RatingScale';
import ReactHtmlParser from 'react-html-parser';
import { TablePagination } from '@material-ui/core';
import endpoints from '../../config/endpoints';
import Loader from 'components/loader/loader';
import ReactPlayer from 'react-player';
import moment from 'moment';
import axios from 'axios';
import './images.css';
const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: '90vw',
    width: '99%',
    // margin: '20px auto',
    // marginTop: theme.spacing(4),
    paddingLeft: '20px',
    boxShadow: 'none',
  },
  tableCell: {
    color: 'black !important',
    backgroundColor: '#ADD8E6 !important',
  },
  buttonColor1: {
    color: '#FF6161 !important',
    backgroundColor: 'white',
  },
  buttonColor9: {
    color: '#bdbdbd !important',
    backgroundColor: 'white',
  },
  buttonColor2: {
    color: '#2A7D4B !important',
    backgroundColor: 'white',
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
    maxWidth: '95vw',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  buttonDiv: {},
}));

const VisualReviews = (props) => {
  const [value, setValue] = React.useState();
  const { Option } = Select;
  const [totalSubmitted, setTotalSubmitted] = useState([]);
  //   const PhysicalActivityId = JSON.parse(localStorage.getItem('PhysicalActivityId')) || {};
  const ActivityId = JSON.parse(localStorage.getItem('VisualActivityId')) || {};
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
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
          `${endpoints.newBlog.studentSideApi}?&user_id=null&activity_detail_id=${ActivityId?.id}&is_reviewed=True&is_submitted=True&update=True&grade_id=${props.selectedGrade}&branch_ids=${props.selectedBranch}&section_ids=${props.selectedSubject}`,
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
          // props.setFlag(false);
          setAlert('success', response?.data?.message);
          setTotalSubmitted(response?.data?.result);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
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
    setView(false);
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
      {/* {loading && <Loader />} */}
      {/* <Paper className={`${classes.root} common-table`} id='singleStudent'>
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

                <TableCell className={classes.tableCell} style={{ width: '261px' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            {totalSubmitted &&
              totalSubmitted?.map((response, index) => (
                <TableBody>
                  <TableRow
                    hover
                    role='checkbox'
                    tabIndex={-1}
                    // key={`user_table_index${i}`}
                  >
                    <TableCell className={classes.tableCells}>{index + 1}</TableCell>
                    <TableCell className={classes.tableCells}>
                      {' '}
                      {response?.booked_user?.name}
                    </TableCell>
                    <TableCell className={classes.tableCells}>
                      {' '}
                      {response?.booked_user?.username}
                    </TableCell>
                    <TableCell className={classes.tableCells}>
                      {' '}
                      {response?.submitted_on?.substring(0, 10)}
                    </TableCell>
                    <TableCell className={classes.tableCells}>
                      <ButtonAnt
                        type='primary'
                        icon={<FileProtectOutlined />}
                        onClick={() => assignPage(response)}
                        size={'medium'}
                      >
                        Check Review
                      </ButtonAnt>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))}
          </Table>
          {/* <TablePagination
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
      </Paper> */}
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
                  width='100%'
                  height='100%'
                  playIcon={
                    <Tooltip title='play'>
                      <ButtonAnt
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
