import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  withStyles,
  useTheme,
  Box,
  Input,
  Typography,
} from '@material-ui/core';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { Autocomplete, Pagination } from '@material-ui/lab';
import { connect, useSelector } from 'react-redux';
import { Divider, TextField } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import axiosInstance from '../../../config/axios';
import endpoints from 'config/endpoints';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import './learning.scss';

const useStyles = makeStyles((theme) => ({
  root: theme.commonTableRoot,
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
  errorText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fe6b6b',
    marginBottom: '30px',
    display: 'inline-block',
  },
  cards: {
    minWidth: 275,
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
}))(Button); 

const LearningVideos = () => {
  const classes = useStyles({});
  const [openFeedback, setOpenFeedback] = useState(false);
  const [moduleId, setModuleId] = useState(null);
  const [learnList, setLearnList] = useState([]);
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails.personal_info.token;
  const moduleData = udaanDetails.role_permission.modules; 
  const limit =8;
  const [totalGenre, setTotalGenre] = useState(0);

  const [ courseId , setCourseId ] = useState('');
  const userId = udaanDetails.personal_info.user_id;
  const [certificateBtn, setCertificateBtn] = useState(true);
  const [bottomHRef, setBottomHRef] = useState('');
  const ratingStatus = sessionStorage.getItem('ratingStatus');
  const [pageNumber, setPageNumber] = useState(1);
  const [opendialogue, setOpendialogue] = useState(false);



 
  const handlePagination = (event, page) => {
    setPageNumber(page);
  };

  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        console.log(item.module, 'module Ids');
        if (item.module_name === 'Learning_Notes') {
          setModuleId(item.module);
        }
      });
    }
  }, []);

  const history = useHistory();

  const handleBack = () => {
      // history.push('/subjectTrain');
      history.goBack();
  };

  const getCardColor = (index) => {
    const colors = ['#54688c', '#f47a62', '#4a66da', '#75cba8'];
    const diffColors = index % 4;
    return colors[diffColors];
  };

  useEffect(() => {
      handleChapters()
}, [moduleId,pageNumber]);

  const handleChapters = () => {
      if(moduleId !== null){
    axios
      .get(endpoints.sureLearning.LearningVideos + `?page_size=${limit}&page=${pageNumber}`, {
        headers: {
          Authorization: `Bearer ${udaanToken}`,
          module: moduleId,
        },
      })
      .then((response) => {
          console.log(response.data.total_pages , "vid");
          setTotalGenre(response.data.total_pages)
        setLearnList(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  };

  const handleLearning = (learn) => {
    history.push({pathname: '/eachLearn',
    state: learn,
  })
}

  
  return (
    <Layout className='accessBlockerContainer'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName={ 'Learning Videos'
          }
          isAcademicYearVisible={true}
        />
        <Grid container spacing={2} style={{ marginTop: '5px', marginLeft: '15px' }}>
          <Grid item md={2} xs={12}>
            <Button
              variant='contained'
              size='medium'
              style={{ width: '100%' }}
              className='cancelButton labelColor'
              // onClick={history.push('/subjectTrain')}
              onClick={handleBack}
            >
              Back
            </Button>
          </Grid>
        </Grid>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
          }}
        >
          {learnList.map((eachChapter, index) => {
            return (
              <Card
                style={{
                  backgroundColor: getCardColor(index),
                  marginLeft: '20px',
                  marginTop: '20px',
                  maxWidth: '200px',
                }}
                className={classes.cards}
              >
                <CardContent>
                  <Typography
                    style={{
                      textAlign: 'center',
                      color: 'white',
                    }}
                  >
                    {' '}
                    {eachChapter.title}
                  </Typography>
                </CardContent>

                <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
                  <Typography
                    onClick={() => handleLearning(eachChapter)}
                    color='primary'
                    style={{ fontWeight: 'bold', color: 'Black', cursor: 'pointer' }}
                  >
                    Click Here
                  </Typography>
                  {/* <StyledButton  size='small'>Click here</StyledButton> */}
                </CardActions>
                <CardContent style={{ display: 'flex', justifyContent: 'center' }}>
                  <Typography style = {{color : 'white'}}>Added on : { moment(eachChapter.added_date).format('DD-MM-YYYY')}</Typography>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <Grid container justify='center'>
                  {/* {pageNumber > 1 && ( */}
                    <Pagination
                      onChange={handlePagination}
                      count={totalGenre}
                      color='primary'
                      page={pageNumber}
                    />
                   {/* )} */}
                </Grid>
      </div>
    </Layout>
  );
};

export default LearningVideos;
