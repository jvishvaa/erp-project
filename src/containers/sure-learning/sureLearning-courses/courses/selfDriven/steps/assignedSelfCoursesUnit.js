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
  CardContent,
  CardMedia,
  CardActions,
  Card,
  Typography,
} from '@material-ui/core';
import CommonBreadcrumbs from '../../../../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../../../Layout';
import TablePagination from '@material-ui/core/TablePagination';
import AccessAlarmsIcon from '@material-ui/icons/AccessAlarms';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ButtonBackgroundImage from '../../../../../../assets/images/button.svg';
import { useHistory } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';
import endpoints from 'config/endpoints';
import axios from 'axios';
import { AlertNotificationContext } from '../../../../../../context-api/alert-context/alert-state';
import AllCoursesAssignedByCoordinator from '../../selfDriven/steps/allCoursesAssignedByCoordinator'
import VideoModule from '../../../../components/VideoModule/videoViewer';
import DocumentViewer from '../../../../components/DocumentViewer/document-viewer'
import './allCoursesAssignedByCoordinator.scss';

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

const AssignedSelfCoursesUnit = () => {
  const classes = useStyles({});

  const history = useHistory();

const document = JSON.parse(sessionStorage.getItem('Doc'))
const Vid = JSON.parse(sessionStorage.getItem('Vid'))
const downloadAble = JSON.parse(sessionStorage.getItem('Download'))


  const handleBack = () => {
    // history.push('/allCoursesAssignedByCoordinatorContent');
    history.goBack();
  };

  return (
    <Layout className='accessBlockerContainer'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName="Sure Learning"
          childComponentName="Self Driven Courses"
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
          {/* <Grid item md={2} xs={12}>
            <Button
              size='media'
              color='primary'
              style={{ color: 'white', width: '100%' }}
              // onClick={history.push('/subjectTrain')}
              onClick={handleBack}
            >
              Next Step
            </Button>
          </Grid>  */}
          
          <Grid item md={10} xs={12}/>

          {sessionStorage.getItem('chapter-content-type') === 'Video' ? 
          <Grid item md={12} xs={12}>
              <VideoModule file = {Vid[0].file} />
          </Grid>
          :null}
          {sessionStorage.getItem('chapter-content-type') === 'Assessment' ? 
          <Grid item md={12} xs = {12} style={{marginTop:'40px'}} className="pdfViewer" >
            
              <DocumentViewer pdfUrl = {document[0].file}/>
          </Grid>
          :null}

          {sessionStorage.getItem('chapter-content-type') === 'Download' ? 
          <div className="downloadComponent">
            {console.log("downloadAble" , downloadAble)}
            {downloadAble && downloadAble.map((link) => (
              <div className="downloadLinks">
                {link.title}
              </div>
            ))}
          </div>
          :null}
          
          
           
        </Grid>
      
      </div>
    </Layout>
  );
};

export default AssignedSelfCoursesUnit;
