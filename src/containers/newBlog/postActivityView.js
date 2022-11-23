import Layout from 'containers/Layout'
import React,{useState, useRef, useEffect} from 'react';
import { Avatar, Breadcrumb, Button, Spin, Divider,Modal} from 'antd';
import './blog.css';
import { CardActionArea,Card, CardHeader, Grid, CardMedia, makeStyles, CardActions,Drawer} from '@material-ui/core';
import NoDataIcon from 'v2/Assets/dashboardIcons/teacherDashboardIcons/NoDataIcon.svg';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import IconButton from '@material-ui/core/IconButton';
import { FormOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import endpoints from 'config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import moment from 'moment';
import CancelIcon from '@material-ui/icons/Cancel';
import { useHistory } from 'react-router-dom';


const drawerWidth = 350;



const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      width: 300,
    },
    indeterminateColor: {
      color: '#f50057',
    },
    selectAllText: {
      fontWeight: 500,
    },
    selectedAll: {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
      },
    },
    root: {
      maxWidth: '90vw',
      width: '95%',
      margin: '20px auto',
      marginTop: theme.spacing(4),
      boxShadow: 'none',
    },
    media: {
      height: 240,
      objectFit: 'cover',
      width: '45%'
    },
    customFileUpload: {
      border: '1px solid black',
      padding: '6px 12px',
  
      cursor: 'pointer',
    },
    container: {
      maxHeight: '70vh',
      maxWidth: '90vw',
    },
    dividerColor: {
      backgroundColor: `${theme.palette.primary.main} !important`,
    },
    buttonColor: {
      color: `${theme.palette.secondary.main} !important`,
      backgroundColor: 'white',
    },
    buttonColor1: {
      color: `${theme.palette.primary.main} !important`,
      backgroundColor: 'white',
    },
    columnHeader: {
      color: `${theme.palette.secondary.main} !important`,
      fontWeight: 600,
      fontSize: '1rem',
      backgroundColor: `#ffffff !important`,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    tableCell: {
      color: theme.palette.secondary.main,
    },
    vl: {
      borderLeft: `3px solid ${theme.palette.primary.main}`,
      height: '45px',
    },
    tickSize: {
      transform: "scale(2.0)",
    },
  }));

const PostActivityView = () => {
    const history = useHistory();
    const [maxWidth, setMaxWidth] = React.useState('lg');
    const classes = useStyles();
    const [view, setView] = useState(false);
    const [listCount, setListCount] = useState('');
    const user_id = JSON.parse(localStorage.getItem('ActivityManagement')) || {};
    // const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [blogWallList, setBlogWallList] = useState([]);
    const [postList,setPostList] = useState([]);
    const [previewData, setPreviewData] = useState('');
    const [imageData, setImageData] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [open, setOpen] = useState(false);

    console.log(user_id,'OP1')
  


    const getViewCard = (data) => {
        setLoading(true)
        axios
        .get(`${endpoints.newBlog.postActivityViewMoreAPI}${data}/`, {
            headers:{
                'X-DTS-HOST': X_DTS_HOST,
            },
        })
        .then((response) => {
            console.log(response?.data?.result)
            setLoading(false)

        })

    }

    const handleCloseViewMore = () => {
        setView(false);
      };

      const handleClose = () => {
        setView(false);
    
      }


    const viewMore = (data) => {
        setView(true);
        // setImageData(JSON.parse(data?.html_file))
        setPreviewData(data)
        getViewCard(data?.id)
      };

      const handleGoBack = () =>{
        history.goBack()
      }


      useEffect(() =>{
        fetchPostActivity()
      },[])

    const fetchPostActivity = () =>{
        setLoading(false);
        axios
            .get(`${endpoints.newBlog.postActivityListAPI}`, {
               headers:{
                'X-DTS-HOST': X_DTS_HOST,
               }
            })
            .then((response) => {
                if(response.status === 200){
                    // debugger;
                    console.log(response)
                    setPostList(response?.data?.result)
                    setListCount(response?.data?.result?.length)
                    setLoading(false)
                }
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
            })
    }
    const showModal = () => {
        history.push(
            `/create-post-activity`
          );
        // console.log('clicked')
        // // debugger;
        // setOpen(true)
        // setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleCloseDialoge = () => {
        setOpen(false);
      };
      const handleSumClose = () => {
        setOpen(false);
      };
    
        
  return (
    <React.Fragment>
        <Layout>
            <div className='row th-16 py-3 px-2'>
            <div className='col-md-8' style={{ zIndex: 2, display:'flex',alignItems:'center' }}>
          <div>
          <IconButton aria-label="back" onClick={handleGoBack}>
           <KeyboardBackspaceIcon style={{fontSize:'20px', color:'black'}}/>
          </IconButton>
          </div>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                Create Post Activities
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
            <div className='col-md-4' style={{display:'flex', justifyContent:'end'}}>
                {console.log(open,'JJ')}
            <Button type="primary"  icon={<FormOutlined />} size={'medium'} onClick={showModal}>
                Create Post Activity
            </Button>
            </div>



          
          <div className='row' style={{marginTop: '20px'}}>
            <div className='col-12'>
            <Divider orientation="left" orientationMargin="0">
               Post Activities List
            </Divider>
            </div>
            <div className='col-12'>

            </div>
            <div className='col-12 px-4'>
                <div className='row md-2 mb-md-0 mt-5'>
                {loading ? (
                    <div className='d-flex justify-content-center align-items-center h-50'>
                        <Spin tip='Loading...' size='large' />
                    </div>
        ) :
          listCount > 0 ?
           (

            <Grid container spacing={4} >
              <Grid
                className='col-12 mt-3 pt-2'
                style={{ height: '90vh', overflowY: 'scroll', display: 'flex', flexWrap: 'wrap' }}
              >

                {/* <Grid item xs={12} md={12} style={{display:'flex', flexWrap:'wrap'}}> */}
                {postList.map((item) => {
                  return (
                    <Grid item xs={12} md={3}>
                      <Card 
                      // className={classes.root}
                      className='card-design'

                      // style={{ width: '20vw', border: '1px solid black', borderRadius: '15px', margin: '10px' }}
                      >
                        <CardActionArea>
                          <CardHeader
                            avatar={
                              <Avatar aria-label="recipe" icon={<UserOutlined color='#f3f3f3' style={{ color: '#f3f3f3' }} twoToneColor="white" />}>

                              </Avatar>
                            }
                            title={item?.name}
                            subheader={item?.description}
                          // subheader={item?.grade?.name}
                          />
                          <div style={{display:'flex'}}>
                          <div style={{ fontSize: '10px', color: 'blue', marginLeft: '72px', marginTop: '-15px' }}>
                            {item?.view_level}
                          </div>
                          <div style={{ fontSize: '12px', marginLeft: '72px', marginTop: '-15px', color:'blue' }}>
                            {moment(item?.created_at).format("MMM Do YY")}
                          </div>

                          </div>
                        </CardActionArea>
                        <CardActionArea style={{ padding: '11px', display: 'flex' }}>
                          <CardMedia
                            className={classes.media}
                            image={item?.template_path}
                            style={{ border: '1px solid lightgray', borderRadius: '6px' }}
                            // alt="Dummy Image"
                            title="Blog View"
                          />
                        </CardActionArea>
                        <CardActions disableSpacing style={{ display: 'flex', justifyContent: 'center', padding:'0.5rem 1rem' }}>

                          {/* <StyledRating
                            fontSize="small"
                            style={{ fontSize: 18, width:'10vw',display:'flex', flexWrap:'wrap'}}
                            precision={0.1}
                            defaultValue={item?.given_rating}
                            max={parseInt(item?.rating)}
                            readOnly
                          /> */}
                          <Button type="primary" style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => viewMore(item)}>
                            View More
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>

                  )

                })}

              </Grid>

            </Grid>
          ) : (
              <div className='d-flex justify-content-center mt-5'>
                <img src={NoDataIcon} />
              </div>
            )
            }
       <Drawer
          anchor='right'
          maxWidth={maxWidth}
          open={view}
          onClose={handleCloseViewMore}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <div style={{ width: '100%', marginTop: '72px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', }}>
              <div style={{ fontSize: '24px', marginLeft: '15px' }}>
                <strong>Preview</strong>
              </div>
              <div style={{ fontSize: '24px', cursor: 'pointer' }}>
                <strong onClick={handleClose}> <CancelIcon /> </strong>
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
                      style={{ display: 'flex', justifyContent: 'flex-start', fontWeight: 'bold', paddingLeft: '10px' }}
                    >
                      <span style={{ fontWeight: 'normal', fontSize: '18px', color: 'blue' }}>
                        Title: {previewData?.name}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        fontWeight: 'bold',
                        paddingLeft: '10px'
                      }}
                    >
                      <span style={{ fontWeight: 'normal', color: 'gray', fontSize: '12px' }}>
                        Description: {previewData?.description}
                      </span>
                    </div>
                  </div>
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
                    <div style={{ padding: '5px' }}>
                      <div
                        style={{
                          background: `url(${previewData?.template_path})`,
                          backgroundSize: "contain",
                          position: "relative",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                          backgroundColor: "rgba(244 245 247 / 25%)",
                          height: "683px",
                        }}

                      >
                        {/* <div className="certificate-text-center certificate-input-box" style={{ top: `calc(279px + ${imageData[0]?.x_cordinate.concat('px')})`, left: `calc(232px + ${imageData[0]?.y_cordinate.concat('px')})` }}>
                          <textarea className="certificate-box" style={{
                            width: `${imageData[0]?.width}px`,
                            height: `${imageData[0]?.height}px`, top: `${imageData[0]?.x_cordinate}px`, left: `${imageData[0]?.y_cordinate}px`
                          }} value={previewData?.content} placeholder="type text here..." />
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </Drawer>

                </div>
            </div>

          </div>

            </div>

        </Layout>
    </React.Fragment>
  )
};

export default PostActivityView