import React, { useContext } from 'react';
import {
  makeStyles,
} from '@material-ui/core';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../Layout';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { useHistory } from 'react-router';
import '../studentRefferal/referstudent.scss';
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

const style = {
  fontSize: '1.5em',
  color: '#fe6b6b',
};

const TeacherReferSuccess = () => {
  const classes = useStyles({});
  const { setAlert } = useContext(AlertNotificationContext);
  const history = useHistory();



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
