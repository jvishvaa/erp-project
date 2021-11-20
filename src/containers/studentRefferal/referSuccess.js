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
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../Layout';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { Autocomplete, Pagination } from '@material-ui/lab';
import { connect, useSelector } from 'react-redux';
import { Divider, TextField } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import axiosInstance from '../../config/axios';
import endpoints from 'config/endpoints';
import FileSaver from 'file-saver';
import IMGPIC from 'assets/images/img1.png';
import Orchids from 'assets/images/orchids.png';
import { CSVLink } from 'react-csv';
import TablePagination from '@material-ui/core/TablePagination';
import { useHistory } from 'react-router';

import './referstudent.scss';
import axios from 'axios';

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
  headers : {
      color : theme.palette.primary.main
  }
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

const StyledButtonUnblock = withStyles({
  root: {
    backgroundColor: '#228B22',
    color: '#FFFFFF',
    padding: '2px 8px',
    fontSize: '10px',
    '&:hover': {
      backgroundColor: '#228B22 !important',
    },
  },
})(Button);

const StyledButtonBlock = withStyles({
  root: {
    backgroundColor: '#FF2E2E',
    color: '#FFFFFF',
    padding: '2px 8px',
    fontSize: '10px',
    '&:hover': {
      backgroundColor: '#FF2E2E !important',
    },
  },
})(Button);

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

const ReferSuccess = () => {
  const classes = useStyles({});
  const fileRef = useRef();
  const { setAlert } = useContext(AlertNotificationContext);
  const history = useHistory();


  const [moduleId, setModuleId] = useState('');
  // const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');

  const referOther = () => {
    history.push('/studentrefer')
  }

  return (
    <Layout className='student-refer-whole-container'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Student Refer'
          childComponentName='Orchids Ambassador Program'
          isAcademicYearVisible={true}
        />
        <Paper>
          <div className='success-refer-container'>
            <div className='refer-header'>
              <p className={classes.headers} id='refer-para'>Referral Successful</p>
            </div>
            <div className='city-res' style={{display: 'flex' , flexDirection: 'column'}}  >
                <p style={{textAlign: 'center' , fontSize: '23px' , fontWeight: '600' , color: '' }} className={classes.headers} >City</p>
                <p style={{textAlign: 'center' , fontSize: '18px' , fontWeight: '600' , marginTop: '10px' }} >{history?.location?.state?.data?.city}</p>
            </div>
            <div className='city-res' style={{display: 'flex' , flexDirection: 'column'}}  >
                <p style={{textAlign: 'center' , fontSize: '23px' , fontWeight: '600' , color: '' }} className={classes.headers} >Student Name</p>
                <p style={{textAlign: 'center' , fontSize: '18px' , fontWeight: '600' , marginTop: '10px' }} >{history?.location?.state?.data?.student_name}</p>
            </div>
            <div className='city-res' style={{display: 'flex' , flexDirection: 'column'}}  >
                <p style={{textAlign: 'center' , fontSize: '23px' , fontWeight: '600' , color: '' }} className={classes.headers} >Parents Name</p>
                <p style={{textAlign: 'center' , fontSize: '18px' , fontWeight: '600' , marginTop: '10px' }} >{history?.location?.state?.data?.parent_name}</p>
            </div>
            <div className='city-res' style={{display: 'flex' , flexDirection: 'column'}}  >
                <p style={{textAlign: 'center' , fontSize: '23px' , fontWeight: '600' , color: '' }} className={classes.headers} >Phone Number</p>
                <p style={{textAlign: 'center' , fontSize: '18px' , fontWeight: '600' , marginTop: '10px' }} >{history?.location?.state?.data?.phone_number}</p>
            </div>
            <div className='city-res' style={{display: 'flex' , flexDirection: 'column'}}  >
                <p style={{textAlign: 'center' , fontSize: '23px' , fontWeight: '600' , color: '' }} className={classes.headers} >Mail Id</p>
                <p style={{textAlign: 'center' , fontSize: '18px' , fontWeight: '600' , marginTop: '10px' }} >{history?.location?.state?.data?.email_id}</p>
            </div>
            <div className='city-res' style={{display: 'flex' , flexDirection: 'column'}}  >
                <p style={{textAlign: 'center' , fontSize: '23px' , fontWeight: '600' , color: '' }} className={classes.headers} >Referral Number :</p>
                <p style={{textAlign: 'center' , fontSize: '40px' , fontWeight: '600' , margin: 'auto' , width: 'fit-content' , background: 'aliceblue' }} >{history?.location?.state?.data?.referral_code}</p>
            </div>
            <div id='thank-res' >
                <p style={{textAlign: 'center' , marginTop: '10px' , fontSize: '20px'}} >Thank You for Referring us.  </p>

                <p id='refer-another' style={{textAlign: 'center'  , fontSize: '20px' , cursor: 'pointer'}} className={classes.headers} onClick={referOther} >Refer Another</p>
            </div>

          </div>
        </Paper>
      </div>
    </Layout>
  );
};

export default ReferSuccess;
