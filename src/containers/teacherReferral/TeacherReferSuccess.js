import React, { useContext, useRef, useState, useEffect } from 'react';
import {
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
import '../studentRefferal/referstudent.scss';
import axios from 'axios';
import { Button } from 'antd';

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
  headers: {
    color: theme.palette.primary.main,
  },
  referButton: {
    '&:hover': {
      backgroundColor: 'rgb(80, 139, 235)',
    },
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

const style = {
  fontSize: '1.5em',
  color: '#fe6b6b',
};

const TeacherReferSuccess = () => {
  const classes = useStyles({});
  const fileRef = useRef();
  const { setAlert } = useContext(AlertNotificationContext);
  const history = useHistory();

  console.log(history, 'history');

  const [moduleId, setModuleId] = useState('');
  // const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');

  const referOther = () => {
    history.push('/teacher-refer');
  };

  return (
    <Layout className='student-refer-whole-container'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Teacher Refer'
          childComponentName='Orchids Ambassador Program'
          isAcademicYearVisible={true}
        />
        <div style={{ marginLeft: '1%' }}>
          <Button
            type='primary'
            size='large'
            style={{ borderRadius: '10px' }}
            className={classes.referButton}
            onClick={referOther}
          >
            Back
          </Button>
        </div>
        {/* <Paper>
<div className='success-refer-container'>
<div className='refer-header'>
<p className={classes.headers} id='refer-para'>
Referral Successful
</p>
</div>
<div
className='city-res'
style={{ display: 'flex', flexDirection: 'column' }}
>
<p
style={{
textAlign: 'center',
fontSize: '23px',
fontWeight: '600',
color: '',
}}
className={classes.headers}
>
City
</p>
<p
style={{
textAlign: 'center',
fontSize: '18px',
fontWeight: '600',
marginTop: '10px',
}}
>
{history?.location?.state?.data?.city}
</p>
</div>
<div
className='city-res'
style={{ display: 'flex', flexDirection: 'column' }}
>
<p
style={{
textAlign: 'center',
fontSize: '23px',
fontWeight: '600',
color: '',
}}
className={classes.headers}
>
Student Name
</p>
<p
style={{
textAlign: 'center',
fontSize: '18px',
fontWeight: '600',
marginTop: '10px',
}}
>
{history?.location?.state?.data?.student_name}
</p>
</div>
<div
className='city-res'
style={{ display: 'flex', flexDirection: 'column' }}
>
<p
style={{
textAlign: 'center',
fontSize: '23px',
fontWeight: '600',
color: '',
}}
className={classes.headers}
>
Parents Name
</p>
<p
style={{
textAlign: 'center',
fontSize: '18px',
fontWeight: '600',
marginTop: '10px',
}}
>
{history?.location?.state?.data?.parent_name}
</p>
</div>
<div
className='city-res'
style={{ display: 'flex', flexDirection: 'column' }}
>
<p
style={{
textAlign: 'center',
fontSize: '23px',
fontWeight: '600',
color: '',
}}
className={classes.headers}
>
Phone Number
</p>
<p
style={{
textAlign: 'center',
fontSize: '18px',
fontWeight: '600',
marginTop: '10px',
}}
>
{history?.location?.state?.data?.phone_number}
</p>
</div>
<div
className='city-res'
style={{ display: 'flex', flexDirection: 'column' }}
>
<p
style={{
textAlign: 'center',
fontSize: '23px',
fontWeight: '600',
color: '',
}}
className={classes.headers}
>
Mail Id
</p>
<p
style={{
textAlign: 'center',
fontSize: '18px',
fontWeight: '600',
marginTop: '10px',
}}
>
{history?.location?.state?.data?.email_id}
</p>
</div>
<div
className='city-res'
style={{ display: 'flex', flexDirection: 'column' }}
>
<p
style={{
textAlign: 'center',
fontSize: '23px',
fontWeight: '600',
color: '',
}}
className={classes.headers}
>
Referral Number :
</p>
<p
style={{
textAlign: 'center',
fontSize: '40px',
fontWeight: '600',
margin: 'auto',
width: 'fit-content',
background: 'aliceblue',
}}
>
{history?.location?.state?.data?.referral_code}
</p>
</div>
<div id='thank-res'>
<p style={{ textAlign: 'center', marginTop: '10px', fontSize: '20px' }}>
Thank You for Referring us.{' '}
</p>

<p
id='refer-another'
style={{ textAlign: 'center', fontSize: '20px', cursor: 'pointer' }}
className={classes.headers}
onClick={referOther}
>
Refer Another
</p>
</div>
</div>
</Paper> */}
        <div
          className='teacher-refer-sucess-container m-auto d-flex justify-content-center flex-column'
          style={{
            width: '70%',
            padding: '15px',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
          }}
        >
          <div
            className='refer-header'
            style={{ textAlign: 'center', marginTop: '10px', marginBottom: '25px' }}
          >
            <h2 id='refer-para' style={{ fontWeight: 'bold', color: 'green' }}>
              Referral Successful
            </h2>
          </div>

          <div
            className='referal-box'
            style={{ display: 'flex', gap: '35px', justifyContent: 'center' }}
          >
            <div className='referal-details' style={{ width: '40%' }}>
              <p
                style={{
                  textAlign: 'right',
                  fontSize: '23px',
                  fontWeight: '600',
                  color: '',
                }}
                className={classes.headers}
              >
                User Name
              </p>

              <p
                style={{
                  textAlign: 'right',
                  fontSize: '23px',
                  fontWeight: '600',
                  color: '',
                }}
                className={classes.headers}
              >
                Contact Number
              </p>

              <p
                style={{
                  textAlign: 'right',
                  fontSize: '23px',
                  fontWeight: '600',
                  color: '',
                }}
                className={classes.headers}
              >
                Email Address
              </p>

              <p
                style={{
                  textAlign: 'right',
                  fontSize: '23px',
                  fontWeight: '600',
                  color: '',
                }}
                className={classes.headers}
              >
                Position
              </p>

              <p
                style={{
                  textAlign: 'right',
                  fontSize: '23px',
                  fontWeight: '600',
                  color: '',
                }}
                className={classes.headers}
              >
                Referral Number
              </p>
            </div>

            <div
              className='refer-information'
              style={{ width: '40%', textAlign: 'left' }}
            >
              <p
                style={{
                  textAlign: 'left',
                  fontSize: '18px',
                  fontWeight: '600',
                  marginTop: '4px',
                }}
              >
                {history?.location?.state?.data?.candidate_name}
              </p>
              <p
                style={{
                  textAlign: 'left',
                  fontSize: '18px',
                  fontWeight: '600',
                  marginTop: '33px',
                }}
              >
                {history?.location?.state?.data?.candidate_phone_number}
              </p>
              <p
                style={{
                  textAlign: 'left',
                  fontSize: '18px',
                  fontWeight: '600',
                  marginTop: '30px',
                }}
              >
                {history?.location?.state?.data?.email}
              </p>
              <p
                style={{
                  textAlign: 'left',
                  fontSize: '18px',
                  fontWeight: '600',
                  marginTop: '28px',
                }}
              >
                {/* {history?.location?.state?.data?.student_name} */}
                {history?.location?.state?.data?.role}
              </p>

              <p
                style={{
                  textAlign: 'left',
                  fontSize: '18px',
                  fontWeight: '600',
                  marginTop: '30px',
                }}
              >
                {history?.location?.state?.data?.referral_code}
              </p>
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '15px',
            marginBottom: '15px',
          }}
        >
          <p style={style}>Thank You for Referring us.</p>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '15px',
            marginBottom: '15px',
          }}
        >
          <Button
            type='primary'
            size='large'
            style={{ borderRadius: '10px' }}
            className={classes.referButton}
            onClick={referOther}
          >
            Refer More
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherReferSuccess;
// box-shadow: ;
