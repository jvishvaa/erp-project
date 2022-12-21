import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import RatingScale from './RatingScale';
import Loader from 'components/loader/loader';

// import Rating from '@material-ui/lab/Rating';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './styles.scss';

import {
  IconButton,
  Divider,
  TextField,
  Button,
  makeStyles,
  Grid,
  Paper,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  Table,
  Drawer,
} from '@material-ui/core';
import {
  Table as TableAnt,
  Breadcrumb as Breadcrumb
} from 'antd';

import Layout from 'containers/Layout';

import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import './images.css';

import './styles.scss';

import endpoints from '../../config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import moment from 'moment';
import { Rating } from '@material-ui/lab';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';


const DEFAULT_RATING = 0;

const StyledRating = withStyles(() => ({
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

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '90vw',
    width: '95%',
    margin: '20px auto',
    marginTop: theme.spacing(4),
    boxShadow: 'none',
  },
  searchTable: {
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  dividerColor: {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  card: {
    maxWidth: '100%',
  },
  media: {
    height: 240,
    objectFit: 'cover',
    width:'45%'
  },
  container: {
    maxHeight: '70vh',
    maxWidth: '90vw',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },

  customTabRoot: {
    color: 'red',
    backgroundColor: 'green',
  },
  customTabIndicator: {
    backgroundColor: 'orange',
  },
  cardcontent: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0,
    },
  },

  tableCell: {
    color: 'black !important',
    backgroundColor: '#ADD8E6 !important',
  },
  tableCells: {
    color: 'black !important',
    backgroundColor: '#F0FFFF !important',
  },
  vl: {
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    height: '45px',
  },
  buttonColor: {
    color: `${theme.palette.primary.main} !important`,
    // backgroundColor: 'white',
  },
  tabStyle: {
    color: 'white !important',
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  tabStatic: {
    position: 'static',
    paddingLeft: '19px',
    paddingRight: '39px',
    paddingTop: '36px',
  },
  buttonColor1: {
    color: 'grey !important',
    backgroundColor: 'white',
  },
  buttonColor2: {
    color: `${theme.palette.primary.main} !important`,
    backgroundColor: 'white',
  },
  selected1: {
    background: `${theme.palette.primary.main} !important`,
    color: 'white !important',
    borderRadius: '4px',
  },
  selected2: {
    background: `${theme.palette.primary.main} !important`,
    color: 'white !important',
    borderRadius: '4px',
  },
  tabsFont: {
    '& .MuiTab-wrapper': {
      color: 'white',
      fontWeight: 'bold',
    },
  },
  tabsFont1: {
    '& .MuiTab-wrapper': {
      color: 'black',
      fontWeight: 'bold',
    },
  },
  rating: {
    '& .MuiRating-sizeLarge': {
      fontSize: '5px !important',
    },
  },
  dialogue: {
    width:'750px !important',

  }
}));



const columns = [
  {
    title: <span className='th-white pl-sm-0 pl-4 th-fw-600 '>Criteria</span>,
    width: '75%',
    align: 'left',
    render: (text, row) => {
      return(
        row.criterion
      )

    } 
  },
  {
    title: <span className='th-white th-fw-600'>Remarks</span>,
    // dataIndex: 'attendance',
    width: '25%',
    align: 'center',
    // key: 'total',
    // id: 2,
    render: (text, row) => (
        row?.levels?.filter((item) => item.status == true )[0].name      
    )
  },
];

const PublicSpeakingWall = () => {
  const classes = useStyles();
  const history = useHistory();
  const User_id = JSON.parse(localStorage.getItem('ActivityManagementSession'))?.user_id;
  let data = JSON.parse(localStorage.getItem('userDetails')) || {};
  const token = data?.token;
  const [moduleId, setModuleId] = useState();
  const [month, setMonth] = useState('1');
  const [status, setStatus] = useState('');
  const [mobileViewFlag, setMobileViewFlag] = useState(window.innerWidth < 700);

  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState('');
  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [selectedGradeIds, setSelectedGradeIds] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [drawers, setDrawers] = useState(false);
  const [value, setValue] = useState(0);
  const [values, setValues] = useState();
  const [publish, setPublish] = useState(false);
  const [ratingReview, setRatingReview] = useState([]);
  const [readMore, setReadMore] = useState(true)
  const [flag,setFlag] = useState(false)
  const [currentDate,setCurrentDate] =useState('')
  const [userData , setUserData] = useState()
  const [loading,setLoading] = useState(false);
  const [page,setPage] = useState(1)
  const [totalPage,setTotalPage] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [totalPublicSpeaking, setTotalPublicSpeaking] = useState([]);
  const [videoDetails,setVideoDetails] = useState([]);
  const [videoData,setVideoData] = useState('')
  const [marksData,setMarksData] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [totalPublish, setTotalPublish] = useState([]);


  // useEffect(() => {
  //   setValues({
  //     rating: DEFAULT_RATING,
  //   });
  // }, []);

  const [maxWidth, setMaxWidth] = React.useState('lg');

  function handleTab(event, newValue) {
    setValue(newValue);
  }
  const [submit, setSubmit] = useState(false);


  let array = [];
  const getRatingView = (data) => {
    setLoading(true)
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
          temp['id'] = obj?.id;
          temp['name'] = obj?.level.name;
          temp['remarks'] = obj?.remarks;
          temp['given_rating'] = obj?.given_rating;
          temp['level'] = obj?.level?.rating;
          array.push(temp);
        });
        setRatingReview(array);
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  };
  const expandMore = () => {
    setSubmit(false);
  };
  const getActivitySession = () => {
    setLoading(true)
    axios
      .post(
        `${endpoints.newBlog.activitySessionLogin}`,
        {},
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
            Authorization: `${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response, 'session');
        localStorage.setItem(
          'ActivityManagementSession',
          JSON.stringify(response?.data?.result)
        );
        setLoading(false)
      });
  };

  const ActvityLocalStorage = () => {
    setLoading(true)
    axios
      .post(
        `${endpoints.newBlog.activityWebLogin}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        localStorage.setItem(
          'ActivityManagement',
          JSON.stringify(response?.data?.result)
        );
        setUserData(response?.data?.result)
        getActivitySession();
        setLoading(false);
      });
  };
  const [assinged, setAssigned] = useState([]);

  useEffect(() =>{
    // getAssinged()
    getTotalPublicSpeaking()
  },[page])

  const getAssinged = async () => {
    setLoading(true)

    axios
      .get(
        `${endpoints.newBlog.Assign}?section_ids=null&user_id=${User_id}&is_draft=false&page_size=${12}&page=${page}`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        var today = new Date().toISOString();
        const output = today?.slice(0,19);
        setCurrentDate(output)
        setAssigned(response?.data?.result);
        setPage(response?.data?.page)
        setTotalPage(response?.data?.total)
        setLoading(false)
        
      });
  };

  useEffect(() => {
    // ActvityLocalStorage();
  }, []);
  const [totalSubmitted, setTotalSubmitted] = useState([]);
  const [totalReview, setTotalReview] = useState([]);



  const getTotalPublicSpeaking = async () => {
    setLoading(true)
    axios
      .get(
        `${endpoints.newBlog.studentPublicSpeakingApi}?user_id=${User_id}`,
        {
          headers: {
            'X-DTS-HOST': X_DTS_HOST,
          },
        }
      )
      .then((response) => {
        console.log(response, 'response');
        setTotalPublicSpeaking(response?.data?.result)
        setLoading(false);
      });
  };
  


  useEffect(() => {
    if(userData)
  getAssinged();
  }, [value,userData]);
  const [view, setView] = useState(false);
  const [previewData, setPreviewData] = useState();
  const [imageData,setImageData] = useState('')
  const handleCloseViewMore = () => {
    setView(false);
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
    arr[index].given_rating = event.target.value;
    setRatingReview(arr);
  };


  const handleClose =() => {
    setView(false);
  }

  const handleClickOpen = (e) => {
    if(e?.asset?.state == "processed"){  
      let data = JSON.parse(e?.grading?.grade_scheme_markings)
      setMarksData(data)
          axios
            .get(
              `${endpoints.newBlog.studentPSContentApi}?asset_id=${e?.asset?.id}`,
              {
                headers: {
                  'X-DTS-HOST': X_DTS_HOST,
                },
              }
            )
            .then((response) => {
              console.log(response, 'response 1');
              setVideoDetails(response?.data?.result)
              setVideoData(response?.data?.result?.signed_URL)
              setLoading(false);
              setOpen(true);
            });
            return
    }else if(e?.asset == null){
      setAlert('error', 'Student Not Yet Submitted !')
      return

    }else {
      setAlert('error', 'Student Not Yet Submitted')
      return

    }


   
  };

  const handleGoBack = () =>{
    history.goBack()
  }


  const handleCloseDialog = () => {
    setOpen(false);
  };




  return (

    <div>
      {loading && <Loader/>}
    <Layout>
       <div className='layout-container-div ebookscroll' style={{
        // background: 'white',
        height: '90vh',
        overflowX: 'hidden',
        overflowY: 'scroll',
      }}>
      <Grid
        container
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: '22px',
          paddingRight: '15px',
          paddingBottom: '15px',
        }}
      >
        <Grid item xs={4} md={4} style={{display:'flex', alignItems:'center'}}>
          {/* <Breadcrumbs
            separator={<NavigateNextIcon fontSize='small' style={{color:'black'}} />}
            aria-label='breadcrumb'
          >
            <Typography color='textPrimary' style={{fontSize: '22px', fontWeight:'bolder'}}>My Activities</Typography>
          </Breadcrumbs> */}
          <div>
          <IconButton aria-label="back" onClick={handleGoBack}>
           <KeyboardBackspaceIcon style={{fontSize:'20px', color:'black'}}/>
          </IconButton>
          </div>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/blog/wall/redirect' className='th-grey th-16'>
                My Blogs
              </Breadcrumb.Item>
              <Breadcrumb.Item href='' className='th-grey th-16'>
                Public Speaking
              </Breadcrumb.Item>
            </Breadcrumb>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item md={12} xs={12} className={classes.tabStatic}>
          <Tabs
            onChange={handleTab}
            textColor='primary'
            indicatorColor='primary'
            // className={ classes.tabsFont}
            value={value}
          >
            <Tab
              label='Public Speaking'
              classes={{
                selected: classes.selected2,
              }}
              className={value === 0 ? classes.tabsFont : classes.tabsFont1}
              onClick ={getTotalPublicSpeaking}
            />

          </Tabs>
          <Divider className={classes.dividerColor} />
        </Grid>
      </Grid>
      {value == 0  && (
        <>
         <Paper className={`${classes.root} common-table`} id='singleStudent'>
         <TableContainer
           className={`table table-shadow view_users_table ${classes.container}`}
         >
           <Table stickyHeader aria-label='sticky table'>
             <TableHead className={`${classes.columnHeader} table-header-row`}>
               <TableRow>
                 <TableCell
                   className={classes.tableCell}
                   style={{ whiteSpace: 'nowrap' }}
                 >
                   S No.
                 </TableCell>
                 <TableCell className={classes.tableCell}>Title</TableCell>
                 <TableCell className={classes.tableCell}>Submitted On</TableCell>
                 <TableCell style={{ width: '252px' }} className={classes.tableCell}>
                   Action
                 </TableCell>
               </TableRow>
             </TableHead>
             {totalPublicSpeaking?.map((response, index) => (
               <TableBody>
                 <TableRow
                   hover
                   role='checkbox'
                   tabIndex={-1}
                   // key={`user_table_index${i}`}
                 >
                   <TableCell className={classes.tableCells}>{index + 1}</TableCell>
                   <TableCell className={classes.tableCells}>{response?.group?.activity?.name}</TableCell>
                   <TableCell className={classes.tableCells}>
                     {`${moment(response?.scheduled_time).format('DD-MM-YYYY')}`}
                   </TableCell>
                   {/* <TableCell className={classes.tableCells}>
                     {response?.creator?.name}
                   </TableCell> */}
                   <TableCell className={classes.tableCells}>
                     <Button
                       variant='outlined'
                       size='small'
                       className={classes.buttonColor2}
                      onClick={() => handleClickOpen(response)}
                     >
                       View More
                     </Button>{' '}
                     &nbsp;&nbsp;
                     {/* <Button
                       variant='outlined'
                       size='small'
                       className={classes.buttonColor2}
                      //  onClick={() => handlePreview(response)}
                     >
                       Preview
                     </Button> */}
                     &nbsp;&nbsp;
                     {/* <Button
                       variant='outlined'
                       size='small'
                       // style={{whiteSpace: 'nowrap'}}

                       className={classes.buttonColor2}
                       onClick={viewed}
                     >
                       View{' '}
                     </Button>{' '} */}
                   </TableCell>
                 </TableRow>
               </TableBody>
             ))}
           </Table>
           {/* <TablePagination
             component='div'
             count={totalCountAssigned}
             rowsPerPage={limitAssigned}
             page={Number(currentPageAssigned) - 1}
             onChangePage={(e, page) => {
             handlePaginationAssign(e, page + 1);
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
        {videoData ? (
          <Drawer
          anchor='right'
          maxWidth={maxWidth}
          open={open}
          onClose={handleCloseDialog}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <div style={{ width: '100%', marginTop: '20px' }}>
            <div style={{display:'flex', justifyContent:'space-between',}}>
            <div style={{ fontSize: '24px', marginLeft:'15px' }}>
              <strong>Preview</strong>
            </div>
            <div style={{ fontSize: '24px', cursor:'pointer' }}>
              <strong onClick={handleCloseDialog}>
                <CancelRoundedIcon  style={{ fontSize: 30 , marginRight:'10px'}}/>
              </strong>
            </div>
  
            </div>
            <Divider />
  
            <Grid container direction='row' justifyContent='center'>
              <Grid item>
                <div
                  style={{
                    border: '1px solid #813032',
                    width: '583px',
                    background: 'white',
                    height: 'auto',
                    borderRadius:'10px',
                    margin:'5px'
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
                    <div>
                      <img
                        src='https://image3.mouthshut.com/images/imagesp/925725664s.png'
                        width='130'
                        alt='image'
                      />
                      
                    </div>
                  </div>
  
                  <div
                    style={{
                      background: 'white',
                      width: '502px',
                      marginLeft: '34px',
                      marginTop: '16px',
                      height: 'auto',
                    }}
                  >
                    <div
                      style={{paddingTop: '7px', fontWeight: 'bold', display:'flex', justifyContent:'center'}}
                    >
                      {/* <span style={{ fontWeight: 'normal', fontSize:'20px' }}>
                       
                      Uploaded Video
                      </span> */}
                    </div>
                    <div
                      style={{
                        paddingLeft: '30px',
                        paddingTop: '10px',
                        paddingBottom: '5px',
                        fontWeight: 'bold',
                      }}
                    >
                      <span style={{ fontWeight: 'normal' }}>
                        {/* Description: {previewData?.activity_detail?.description} */}
                      </span>
                    </div>
                  </div>
                  {/* {console.log(previewData,"DP")} */}
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
                    <div style={{padding: '5px'}}>
                    <div
          style={{
            // background: `url(${previewData?.template?.template_path})`,
            backgroundSize: "contain",
            position: "relative",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundColor: "rgba(244 245 247 / 25%)",
      height: "683px",
          }}
  
        >
                         <video width="500" height="600" controls >
                      <source src={`${videoData}`} type="video/mp4"/>
                      Your browser does not support HTML video.
                      {/* <track
                      src={videoDetails?.signed_URL}
                      kind="captions"
                      srcLang="en"
                      label="english_captions"
                    /> */}
                  </video>
             
        </div>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item>
                <div style={{margin:'10px', background:'#E3F2FD', borderRadius:'10px', padding:'5px'}}>
                  <div style={{display:'flex', justifyContent:'center'}}>
                  <span style={{fontSize:'20px',marginBottom: '15px'}}> Student Marks </span>
                  </div>
                  <div>
                  <div className='col-12' style={{padding:'10px'}}>
                      <TableAnt
                        className='th-table'
                        columns={columns}
                        // rowKey={(record) => record?.erp_id}
                        loading={loading}
                        dataSource={marksData}
                        pagination={false}
                        rowClassName={(record, index) =>
                          index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'
                        }
                        scroll={{ x: 'max-content' }}
                      />
                    </div>
                  </div>

                </div>
              </Grid>
            </Grid>
          </div>
        </Drawer>

        ): ''}
        </>
      )}
      <Drawer
        anchor='right'
        maxWidth={maxWidth}
        open={view}
        onClose={handleCloseViewMore}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <div style={{ width: '100%', marginTop: '72px' }}>
          <div style={{display:'flex', justifyContent:'space-between',}}>
          <div style={{ fontSize: '24px' }}>
            <strong>Preview</strong>
          </div>
          <div style={{ fontSize: '24px', cursor:'pointer' }}>
            <strong onClick={handleClose}>X</strong>
          </div>

          </div>
          <Divider />

          <Grid container direction='row' justifyContent='center'>
            <Grid item>
              <div
                style={{
                  border: '1px solid #813032',
                  width: '583px',
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
                  <div>
                    <img
                      src='https://image3.mouthshut.com/images/imagesp/925725664s.png'
                      width='130'
                      alt='image'
                    />
                    
                  </div>
                </div>

                <div
                  style={{
                    background: 'white',
                    width: '502px',
                    marginLeft: '34px',
                    marginTop: '16px',
                    height: 'auto',
                  }}
                >
                  <div
                    style={{ paddingLeft: '30px', paddingTop: '7px', fontWeight: 'bold' }}
                  >
                    <span style={{ fontWeight: 'normal' }}>
                      Title: {previewData?.activity_detail?.title}
                    </span>
                  </div>
                  <div
                    style={{
                      paddingLeft: '30px',
                      paddingTop: '10px',
                      paddingBottom: '5px',
                      fontWeight: 'bold',
                    }}
                  >
                    <span style={{ fontWeight: 'normal' }}>
                      Description: {previewData?.activity_detail?.description}
                    </span>
                  </div>
                </div>
                {console.log(previewData,"DP")}
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
                  <div style={{padding: '5px'}}>
                  <div
        style={{
          background: `url(${previewData?.template?.template_path})`,
          backgroundSize: "contain",
          position: "relative",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "rgba(244 245 247 / 25%)",
    height: "683px",
        }}

      >
        <div className="certificate-text-center certificate-input-box" style={{top:`calc(279px + ${imageData[0]?.x_cordinate.concat('px')})`, left:`calc(232px + ${imageData[0]?.y_cordinate.concat('px')})`}}>
          <textarea className="certificate-box" style={{width:`${imageData[0]?.width}px`,
    height:`${imageData[0]?.height}px`,top:`${imageData[0]?.x_cordinate}px`, left: `${imageData[0]?.y_cordinate}px`}} value={previewData?.submitted_work?.html_text} placeholder="type text here..." />
         
        </div>
      </div>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item>
              {submit == false ? (
                <div style={{ paddingLeft: '10px' }}>Review</div>
              ) : (
                <div style={{ paddingLeft: '8px' }}>Edit Review</div>
              )}
              {submit == false && (
                <div
                  style={{
                    border: '1px solid #707070',
                    width: '295px',
                    height: 'auto',
                    marginLeft: '11px',
                    marginRight: '10px',
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
                        <div
                          key={index}
                          style={{ display: 'flex', justifyContent: 'space-between' }}
                        >
                          {' '}
                          {obj?.name}
                          <StyledRating
                            name={`rating${index}`}
                            size='small'
                            readOnly
                            // rating={obj?.given_rating}
                            defaultValue={obj?.given_rating}
                            precision={0.1}
                            max={parseInt(obj?.level)}
                            onChange={(event, newValue) =>
                              handleInputCreativityOne(event, newValue, index)
                            }
                          />
                        </div>
                        {/* {obj} */}
                        <div>
                          <TextField
                            id='outlined-basic'
                            size='small'
                            disabled
                            variant='outlined'
                            value={obj?.remarks}
                            style={{ width: '264px' }}
                            onChange={(event) => handleInputCreativity(event, index)}
                          />
                        </div>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {' '}
                      Overall
                      <RatingScale
                        name='simple-controlled'
                        defaultValue={DEFAULT_RATING}
                        onChange={(event, value) => {
                          setValues((prev) => ({ ...prev, rating: value }));
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
          </Grid>
        </div>
      </Drawer>
      </div>
    </Layout>

    </div>
  );
};
export default PublicSpeakingWall;
