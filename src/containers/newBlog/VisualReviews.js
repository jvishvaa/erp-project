import React, { useState, useRef, useEffect, useContext } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, Grid, Drawer, TextField, Divider, withStyles } from '@material-ui/core';
import StarsIcon from '@material-ui/icons/Stars';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

import { FileProtectOutlined, CloseCircleOutlined, UserOutlined, DownOutlined, CheckOutlined,PlayCircleOutlined } from "@ant-design/icons";
import { Button as ButtonAnt, Input, Avatar, Select, Tooltip } from "antd";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import RatingScale from './RatingScale';
import ReactHtmlParser from 'react-html-parser';
import { TablePagination } from '@material-ui/core';
import endpoints from '../../config/endpoints';
import Loader from 'components/loader/loader';
import ReactPlayer from 'react-player';

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
  const { Option } = Select
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
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isClicked, setIsClicked] = useState(false);
  const [buttonFlag, setButtonFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file,setFile] =useState([])

  let array = [];
  const getRatingView = (data) => {
    setLoading(true)
    showMedia(data)
    axios
      .get(
        `${endpoints.newBlog.studentReviewss}?booking_detail_id=${data}`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
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
        setLoading(false)
      });
  };


  const getTotalSubmitted = () => {
    if (props) {
      setLoading(true)

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
          setTotalCount(response?.data?.count)
          setTotalPages(response?.data?.page_size)
          setCurrentPage(response?.data?.page)
          setLimit(Number(limit))
          props.setFlag(false)
          setAlert('success', response?.data?.message)
          setTotalSubmitted(response?.data?.result);
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })

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

  }, [props.selectedBranch, props.selectedGrade, props.flag])

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


  let dummyArr = []
  const filterRound = (data) => {
    if (dummyArr.indexOf(data) !== -1) {
      return ""
    } else {
      dummyArr.push(data)
      return data
    }
  }

  const showMedia = (item) =>{

    axios.get(`${endpoints.newBlog.showVisualMedia}${item}/`,{
      headers:{
        'X-DTS-HOST': X_DTS_HOST,
      },
    })
    .then((response) =>{
      setFile(response.data.result)
    })

  }

  return (
    <>
      {loading && <Loader />}
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

                <TableCell className={classes.tableCell} style={{ width: '261px' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            {totalSubmitted && totalSubmitted?.map((response, index) => (
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
          /> */}
        </TableContainer>
      </Paper>

      <Drawer
        anchor='right'
        // maxWidth={maxWidth}
        style={{width:'100px'}}
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
          <div className='row' style={{display:'flex',width:'70vw',height:'90vh',padding:'0.5rem'}}>
          <div className='col-8'>
            {(file?.file_type === "image/jpeg") || (file?.file_type === "image/png") ? (
               <img src={file?.s3_path} alt={"image"} thumb={file?.s3_path}  width="100%" height="95%"/>

            ):(
              <ReactPlayer
              url={file?.s3_path}
              thumb={file?.s3_path}
              // key={index}
              width="100%"
              height="100%"
              playIcon={<Tooltip title="play">
                <ButtonAnt style={{ background: 'transparent', border: 'none', height: '30vh', width: '30vw' }} shape="circle" icon={<PlayCircleOutlined style={{ color: 'white', fontSize: '70px' }} />} />
              </Tooltip>}
              alt={"video"}
              controls={true}
            />
            )}
          </div>
          <div className='col-4'>

          <Grid container direction='row' justifyContent='center'>
            <Grid item>
              <div
                style={{
                  // border: '1px solid #813032',
                  // width: '583px',
                  background: 'white',
                  height: 'auto',
                }}
              >
                <div
                  style={{
                    background: 'white',
                    // width: '350px',
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
                    // marginTop: '10px',
                    height: 'auto',
                    border: '1px solid #dbdbdb',
                    // width: '36vw',
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
                    // width: '502px',
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
                              <div className='row' style={{ display: 'flex' }}>
                                <div className='col-6' key={index}>
                                  <div
                                    key={index}
                                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}
                                  >
                                    {obj?.name}
                                  </div>
                                </div>
                                <div className='col-6'>
                                  <Select
                                    className='th-grey th-bg-grey th-br-4 th-select w-100 text-left'
                                    bordered={true}
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    value={obj?.remarks.filter((item) => item.status == true)[0].name}
                                    placement='bottomRight'
                                    disabled
                                    placeholder='Select Option'
                                    suffixIcon={<DownOutlined className='th-black-1' />}
                                    dropdownMatchSelectWidth={false}
                                    filterOption={(input, options) => {
                                      return (
                                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                      );
                                    }}

                                    menuItemSelectedIcon={<CheckOutlined className='th-primary' />}
                                  >
                                    {obj?.remarks?.map((each) => {
                                      return (
                                        <Option value={each?.name} key={each?.score}>
                                          {each?.name}
                                        </Option>
                                      )
                                    })}



                                  </Select>
                                </div>
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

          </div>

        </div>
      </Drawer>
    </>
  );
};

export default VisualReviews;
