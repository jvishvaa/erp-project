import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  Button,
  Grid,
  makeStyles,
  ListItemText,
  ListItem,
  List,
  Paper,
  CardMedia,
  withStyles,
  useTheme,
  // Dialog,
  Box,
  Input,
  Typography,
} from '@material-ui/core';
import Dialog from '../../components/dialog/dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../Layout';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import { Autocomplete, Pagination } from '@material-ui/lab';
import { connect, useSelector } from 'react-redux';
import { Divider, TextField } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

import axiosInstance from '../../../../config/axios';
import endpoints from 'config/endpoints';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import unfiltered from '../../../../assets/images/unfiltered.svg';
import {  SvgIcon } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import '../induction-training.scss';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(12),
  },
  paperStyled: {
    minHeight: '80vh',
    height: '100%',
    padding: '50px',
    marginTop: '15px',
  },
  guidelinesText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
  },
  // closeButton: {
  //   position: 'absolute',
  //   right: theme.spacing(1),
  //   top: theme.spacing(1),
  //   color: theme.palette.grey[500],
  // },
  errorText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fe6b6b',
    marginBottom: '30px',
    display: 'inline-block',
  },

  table: {
    minWidth: 650,
  },
  downloadExcel: {
    float: 'right',
    fontSize: '16px',
    // textDecoration: 'none',
    // backgroundColor: '#fe6b6b',
    // color: '#ffffff',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  cardsContainer: {
    width: '95%',
    margin: '0 auto',
  },
  tablePaginationCaption: {
    fontWeight: '600 !important',
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  guidelineval: {
    color: theme.palette.primary.main,
    fontWeight: '600',
  },
  guideline: {
    color: theme.palette.secondary.main,
    fontSize: '16px',
    padding: '10px',
  },
}));

const StyledButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
    padding: '8px 15px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}))(Button);

const StyledClearButton = withStyles((theme) => ({
  root: {
    backgroundColor: '#E2E2E2',
    color: '#8C8C8C',
    padding: '8px 15px',
    marginLeft: '30px',
    '&:hover': {
      backgroundColor: '#E2E2E2 !important',
    },
  },
  root: theme.commonTableRoot,
}))(Button);

const DialogTitle = withStyles(useStyles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disablTypography className={classes.root} {...other}>
      <Grid container direction='row'>
        <Grid item md={7}>
          <strong>{JSON.parse(sessionStorage.getItem('content_type'))}</strong>
        </Grid>
        <Grid item md={4}></Grid>
        <Grid item md={1}>
          {onClose ? (
            <IconButton
              aria-label='close'
              // className={classes.closeButton}
              onClick={props.handleClose}
            >
              <CloseIcon style={{ padding: '-500px' }} />
            </IconButton>
          ) : null}
        </Grid>
      </Grid>
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const AllchapterContent = () => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [moduleId, setModuleId] = useState('');
  const [content, setContent] = useState([]);
  const [complete,setComplete] = useState(sessionStorage.getItem('complete') === 'true'?true:false);
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails?.personal_info?.token;
  const moduleData = udaanDetails?.role_permission?.modules;
  const classes = useStyles({});
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
const course ="induction_training";
const courseType ="is_induction_training";
  const handleDocument = (item, id) => {
    if (content && content.length) {
      content.forEach((con , index) => {
        if(con.id === item.id && index > 0){
          console.log(index - 1 , "index");
          let int = index-1;
          console.log(content[int] , "prev typ");
          console.log(int , "prev");
          if(content[index-1].is_completed){
            if(item?.course_wise_videos[0]?.is_download === true){
            console.log(item ,"open")
            history.push({ pathname: '/inductionUnit', state: item ,courseType : courseType,course:course,itemId:item.id});
            console.log(item.id, 'Assessmentidd');
            sessionStorage.setItem('Download', JSON.stringify(item.course_wise_videos));
            sessionStorage.setItem('induction_training', 'induction_training');
            sessionStorage.setItem('is_induction_training', 'is_induction_training');
            sessionStorage.setItem('chapter-content-type', 'Download');
            } else {
            history.push({ pathname: '/inductionUnit', state: item ,courseType : courseType,course:course,itemId:item.id});
            console.log(item.id, 'Assessmentidd');
            sessionStorage.setItem('Doc', JSON.stringify(item.course_wise_videos));
            sessionStorage.setItem('induction_training', 'induction_training');
            sessionStorage.setItem('is_induction_training', 'is_induction_training');
            sessionStorage.setItem('chapter-content-type', 'Assessment');
            }
          }else{
            setAlert('warning','please complete previous steps')
          }
        } 
        if(con.id === item.id && index < 1 ) {
          console.log('first');
          history.push({ pathname: '/inductionUnit', state: item ,courseType : courseType,course:course,itemId:item.id});
            console.log(item.id, 'Assessmentidd');
            sessionStorage.setItem('Doc', JSON.stringify(item.course_wise_videos));
            sessionStorage.setItem('induction_training', 'induction_training');
            sessionStorage.setItem('is_induction_training', 'is_induction_training');
            sessionStorage.setItem('chapter-content-type', 'Assessment');
        }
       
      })}
   
  };
  const handleQuiz = (item) => {
    if (content && content.length) {
      content.forEach((con , index) => {
        if(con.id === item.id && index > 0){
          console.log(index - 1 , "index");
          let int = index-1;
          console.log(content[int] , "prev typ");
          console.log(int , "prev");
          if(content[index-1].is_completed){
            console.log("open")
               // history.push('/teacherquiz');
    history.push({ pathname: '/quiz', state: item ,courseType : "is_induction_training",course:"induction_training"});
    //  history.push('/coursesquiz');
    sessionStorage.setItem(
      'Quiz',
      JSON.stringify(item.course_wise_videos[0].chapter_wise_mcq)
    );
    console.log(
      item.course_wise_videos[0].chapter_wise_mcq[0].type_question.question_type_name,
      'Qui'
    );
          }else{
            setAlert('warning','please complete previous steps')
          }
        } 

        if(con.id === item.id && index < 1 ) {
          console.log('first');
          console.log("open")
          // history.push('/teacherquiz');
history.push({ pathname: '/quiz', state: item ,courseType : "is_induction_training",course:"induction_training"});
//  history.push('/coursesquiz');
sessionStorage.setItem(
 'Quiz',
 JSON.stringify(item.course_wise_videos[0].chapter_wise_mcq)
);
console.log(
 item.course_wise_videos[0].chapter_wise_mcq[0].type_question.question_type_name,
 'Qui'
);
        }
    //     else if (index === 0) {
    // history.push({ pathname: '/quiz', state: item ,courseType : "is_induction_training",course:"induction_training"});
    // sessionStorage.setItem(
    //   'Quiz',
    //   JSON.stringify(item.course_wise_videos[0].chapter_wise_mcq)
    // );
    // console.log(
    //   item.course_wise_videos[0].chapter_wise_mcq[0].type_question.question_type_name,
    //   'Qui'
    // );
    //     }
      })}
 
  };
  const handleVedio = (item) => {
    if (content && content.length) {
      content.forEach((con , index) => {
        if(con.id === item.id && index > 0){
          console.log(index - 1 , "index");
          let int = index-1;
          console.log(content[int] , "prev typ");
          console.log(int , "prev");
          if(content[index-1].is_completed){
            console.log("open")
               // history.push('/allchapterContentUnit');
    history.push({ pathname: '/inductionUnit', state: item ,courseType : courseType,course:course,itemId:item.id});
    console.log(item.id, 'Assessmentidd');
    sessionStorage.setItem('induction_training', 'induction_training');
    sessionStorage.setItem('is_induction_training', 'is_induction_training');
    sessionStorage.setItem('Vid', JSON.stringify(item.course_wise_videos));
    sessionStorage.setItem('chapter-content-type', 'Video');
          }else{
            setAlert('warning','please complete previous steps')
          }
        } 
        if (con.id === item.id && index < 1) {
             // history.push('/allchapterContentUnit');
    history.push({ pathname: '/inductionUnit', state: item ,courseType : courseType,course:course,itemId:item.id});
    console.log(item.id, 'Assessmentidd');
    sessionStorage.setItem('induction_training', 'induction_training');
    sessionStorage.setItem('is_induction_training', 'is_induction_training');
    sessionStorage.setItem('Vid', JSON.stringify(item.course_wise_videos));
    sessionStorage.setItem('chapter-content-type', 'Video');
        }
      })}
 
  };

  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        console.log(item.module, 'module Ids');
        if (item.module_name === 'Subject_Training') {
          setModuleId(item.module);
        }
      });
    }
    if(sessionStorage?.reload){
      console.log("his");
      window.location.reload();
      sessionStorage.removeItem('reload')
    }
  }, []);
  useEffect(() => {
    if (moduleId !== '') {
      if (history?.location?.state?.course_id) {
        getAllLesson(history?.location?.state);
       
      }
    }
  }, [moduleId]);

 

  const getAllLesson = (id) => {
    axios
        .get(
          `${endpoints.sureLearning.filterSubject}?content_id=${history?.location?.state?.id}&course_instance_id=${history?.location?.state?.course_id}&induction_training=true`,
          {
            headers: {
              Authorization: `Bearer ${udaanToken}`,
              module: moduleId,
            },
          }
        )
        .then((response) => {
          console.log(response.data, 'successcou');
          // setState(response.data.course_wise_videos)
          setContent(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  const getCardColor = (index) => {
    const colors = ['#54688c', '#f47a62', '#4a66da', '#75cba8'];
    const diffColors = index % 4;
    return colors[diffColors];
  };
  const handleUnitButton = () => {
    history.push('/allchapterContentUnit');
    sessionStorage.setItem('chapter-content-type', 'Assessment');
  };
  const handleUnitButtonForVideo = () => {
    history.push('/allchapterContentUnit');
    sessionStorage.setItem('chapter-content-type', 'Video');
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleScore = () => {
    setOpen(true);
  };
  const handleViewMore = (item) => {
    console.log(item.course_wise_videos[0].marks_scored, 'copy');
    setOpen(true);
  };

  const handleClickOpen = (item) => {
    sessionStorage.setItem(
      'content_type',
      JSON.stringify(item.course_wise_videos[0].content_type)
    );
    console.log(item.course_wise_videos[0].content_type, 'jjj');
    setOpen(true);
    console.log(open);
  };
  
 
  const handleBack = () => {
    // history.push('/allchaptersInduction');
    history.goBack();
  };
const BreadCrumb= sessionStorage.getItem('BreadCrumb')
  return (
    <Layout className='accessBlockerContainer'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName={BreadCrumb}
          isAcademicYearVisible={true}
        />
        <Grid container spacing={2} style={{ marginTop: '5px', marginLeft: '15px' }}>
          <Grid item md={3} xs={12}>
            <Button
              variant='contained'
              size='medium'
              style={{ width: '50%' }}
              className='cancelButton labelColor'
              onClick={handleBack}
            >
              Back
            </Button>
          </Grid>
          {/* <Grid item md={9} xs={12} /> */}
          {/* <Grid container spacing={4}> */}
          <div style={{ display: 'flex' }} id='contentCard'>
            {content[0]?.course_wise_videos ?
            <>
            {content[0]?.course_wise_videos &&
              content?.map((item, index) => {
                if(item?.course_wise_videos){
                console.log(item , "itemmm");
                if (
                  item?.course_wise_videos[0].content_type === 'File' ||
                  item?.course_wise_videos[0].content_type == 'Assignment'||
                  item?.course_wise_videos[0].content_type == 'Text'
                ) {
                  return (
                    <Card
                      style={{
                        backgroundColor: getCardColor(index),
                        marginLeft: '20px',
                        marginTop: '20px',
                        cursor: 'pointer',
                      }}
                      className={classes.cards}
                      id='iconCard'
                    >
                      <CardMedia component='img' image={item.file} />
                      <div style={{ flexDirection: 'column' }}>
                      <Typography
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: '17px',
                          }}
                          id='titleContent'
                        >
                        Step {index + 1 } </Typography>
                        {console.log(content[index - 1] , "prev" )}
                        <Typography
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: '16px',
                          }}
                          id='titleContent'
                        >
                          {' '}
                          {item.title}{' '}
                        </Typography>
                      </div>
                      <Typography
                        onClick={() => handleDocument(item)}
                        color='primary'
                        style={{
                          fontWeight: 'bold',
                          display: 'flex',
                          justifyContent: 'center',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '15px',
                        }}
                      >
                        Go To {item.title}{' '}
                      </Typography>
                      <Typography style={{ display: 'flex', justifyContent: 'center' }}>
                        {item.is_completed === true ? 'Completed' : 'Not Completed'}
                      </Typography>
                    </Card>
                  );
                }

                if (item?.course_wise_videos[0].content_type === 'McqTest') {
                  return (
                    <Card
                      style={{
                        backgroundColor: getCardColor(index),
                        marginLeft: '20px',
                        marginTop: '20px',
                        cursor: 'pointer',
                      }}
                      className={classes.cards}
                      id='iconCard'
                    >
                      <CardMedia component='img' image={item.file} />
                      <div style={{ flexDirection: 'column' }}>
                      <Typography
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: '17px',
                          }}
                          id='titleContent'
                        >
                        Step {index + 1 } </Typography>
                        <Typography
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: '16px',
                          }}
                          id='titleContent'
                        >
                          {' '}
                          {item.title}{' '}
                        </Typography>
                      </div>
                      {item.course_wise_videos[0].quiz_status === true  ? (
                        <Typography
                          onClick={() => handleClickOpen(item)}
                          color='primary'
                          style={{
                            fontWeight: 'bold',
                            display: 'flex',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '15px',
                          }}
                        >
                          View Score {item.title}
                        </Typography>
                      ) : (
                        <Typography
                          onClick={() => handleQuiz(item)}
                          color='primary'
                          style={{
                            fontWeight: 'bold',
                            display: 'flex',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '15px',
                          }}
                        >
                          Go To {item.title}
                        </Typography>
                      )}
                      <Dialog open={open} handleClose={handleClose} item={item} />
                      {/* <Dialog
                        onClose={handleClose}
                        aria-labelledby='customized-dialog-title'
                        open={open}
                        fullWidth
                        maxWidth='md'
                      >
                        <DialogTitle
                          id='customized-dialog-title'
                          onClose={handleClose}
                          handleClose={handleClose}
                        ></DialogTitle>
                        <DialogContent dividers>
                          <Typography id='customized-dialog' style={{display: 'flex', justifyContent: 'center'}}>
                            Test On :
                            <strong style={{color: 'blue'}}>{item.course_wise_videos[0].question_paper}</strong>
                          </Typography >
                          <Typography id='customized-dialog'style={{display: 'flex', justifyContent: 'center'}}>
                            Marks Scored:
                            <strong  style={{color: 'blue'}}>{item.course_wise_videos[0].marks_scored}%</strong>{' '}
                          </Typography>
                        </DialogContent>
                      </Dialog> */}
                      <Typography style={{ display: 'flex', justifyContent: 'center' }}>
                        {item.course_wise_videos[0].quiz_status === true  ? 'Completed' : 'Not Completed'}
                      </Typography>
                    </Card>
                  );
                }
                if (item?.course_wise_videos[0].content_type == 'Video') {
                  return (
                    <Card
                      style={{
                        backgroundColor: getCardColor(index),
                        marginLeft: '20px',
                        marginTop: '20px',
                        cursor: 'pointer',
                      }}
                      className={classes.cards}
                      id='iconCard'
                    >
                      <CardMedia component='img' image={item.file} />
                      <div style={{ flexDirection: 'column' }}>
                      <Typography
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: '17px',
                          }}
                          id='titleContent'
                        >
                        Step {index + 1 } </Typography>
                        <Typography
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: '16px',
                          }}
                        >
                          {' '}
                          {item.title}{' '}
                        </Typography>
                      </div>

                      <Typography
                        onClick={() => handleVedio(item)}
                        color='primary'
                        style={{
                          fontWeight: 'bold',
                          display: 'flex',
                          justifyContent: 'center',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '15px',
                        }}
                      >
                        Go To{item.title}
                      </Typography>
                      <Typography style={{ display: 'flex', justifyContent: 'center' }}>
                        {item.is_completed === true ? 'Completed' : 'Not Completed'}
                      </Typography>
                    </Card>
                  );
                }
              } 
              })}
              </> :  <div className="noDataIMG" style={{width: '100%'}} >
                <SvgIcon
                  component={() => (
                    <img style={{ paddingLeft: '380px' }} src={unfiltered} />
                  )}
                />
                <p style={{ paddingLeft: '440px' }}>NO DATA FOUND </p>
              </div> }
          </div>
        </Grid>
      </div>
    </Layout>
  );
};

export default AllchapterContent;
