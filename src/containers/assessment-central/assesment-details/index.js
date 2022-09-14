import React, { useContext , useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, IconButton, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';
import './styles.scss';
import GetAppIcon from '@material-ui/icons/GetApp';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from '../../../config/endpoints';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import axiosInstance from '../../../config/axios';
import { handleDownloadPdf } from '../../../../src/utility-functions';

const AssesmentDetails = ({ test, onClick, onClose, filterData, handleClose  , reportLoad}) => {
  const history = useHistory();
  console.log(test, "filter");
  const {
    test_id: id,
    id: assessmentId,
    testType,
    grade,
    subjects,
    test_name: testName = 'Assessment',
    test_date: testDate,
    test_duration: testDuration,
    total_mark: totalMark,
    created_at: createdDate,
    updated_at: updatedDate,
    sectionMap: section_mapping,
    question_paper_id: question_paper_id,
    test_id: test_id,
    section_name: section_name
  } = test;

  const handleData = () => {
    sessionStorage.removeItem('filterData')
    history.push({
      pathname: '/offline-student',
      state: {
        data: filterData,
        test: test
      }
    })

  }

  const { setAlert } = useContext(AlertNotificationContext);
  const [ testStart , setTestStart ] = useState(false)
  const [confirmAlert, setConfirmAlert] = useState(false);

  const CancelStart = () => {
    setConfirmAlert(false)
  }

  const openStartModal = () => {
    setConfirmAlert(true)
  }


  const downloadAssessment = () => {
    reportLoad(true)
    axiosInstance
      .get(`${endpoints.assessmentErp.downloadAssessmentPdf}?test_id=${assessmentId}`, {
        responseType: 'blob',
      })
      .then((response) => {
        const {
          headers = {},
          message = 'Cannot download question paper',
          data = '',
        } = response || {};
        const contentType = headers['content-type'] || '';
        if (contentType === 'application/pdf') {
          handleDownloadPdf(data, testName);
        } else {
          setAlert('info', message);
        }
        reportLoad(false)
      })
      .catch((error) => {
        setAlert(error?.message);
        reportLoad(false)
      });
  };

  const handleTest = () => {
    history.push(
      `/assessment/${question_paper_id}/${assessmentId}/attempt/`
    );
    console.log(test);
  };

  const handleTeststart = () => {
    var today = new Date().toISOString().replace('Z', '');
    today = today.replace(/\.\d+/, "");
    console.log(today);
    let payload = {
      test_duration: testDuration,
      test_date: today,
      id: assessmentId
    }
    axiosInstance
      // .put(`/assessment/update-test/?test_duration=${testDuration}&test_date=${today}&id=${assessmentId}`)
      .put(`/assessment/update-test/`, payload)
      .then((res) => {
        console.log(res);
        if (res.data.status_code == 200) {
          setAlert('success', 'Test Started')
          setTestStart(true)
          setConfirmAlert(false)
        } else {
          setAlert('error', 'Failed to Start the Test')
          setConfirmAlert(false)
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setConfirmAlert(false)
      });
  };

  const getSection = () => {
    var sectionName = ''
    let getsectionname = section_name.map((sec , i ) => {
      if(section_name?.length - 1 == i )
      {
        sectionName +=  `${sec}`
      }else{
        sectionName +=  `${sec},`
      }
    })
    return sectionName;
  }

  return (
    <div className='assesment-details-container'>
      <div className='header-container'>
        <div
          className='primary-header-container'
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div className='primary-header-text-container'>
            <span className='primary-text font-lg'>{testType}</span>
            <br />
            <span className='secondary-text'>{
              `${grade}`
              //  ${subjects.join(', ')}`
            }</span>
          </div>
          {/* <div>
            <IconButton
              style={{ padding: 0 }}
              onClick={() => downloadAssessment()}
              title='Download Question Paper'
            >
              <GetAppIcon />
            </IconButton>
          </div> */}
          <div>
            <IconButton style={{ padding: 0 }} onClick={onClose} title='Close'>
              <CloseIcon color='primary' />
            </IconButton>
          </div>
        </div>
        {/* {testDate != null ? */}
          <div className='secondary-header-container'>
            <div style={{minWidth: '60%'}} >
            <div className='secondary-text font-lg'>{testName}
            {/* {getSection()} */}
            </div>
            <div className='secondary-text font-lg' style={{maxWidth: '65%' , fontSize: '14px'}} >{getSection()}</div>
            </div>
        {testDate != null ?
            <div className='secondary-text font-sm sop'>
              <div>Scheduled on</div>
              {console.log(testDate?.slice(11, 16), 'dateteimeeeeee')}
              <div>
                {testDate ? moment(testDate).format('DD-MM-YYYY') : '--'}{' '}
                {testDate ? testDate?.slice(11, 16) : '--'}
              </div>
              {/* <p style={{marginRight:'90px'}}>Scheduled on {testDate ? moment(testDate).format('DD-MM-YYYY') : '--'}</p> */}
            </div>
          : ''}
          </div>
          {/* : ''} */}
      </div>
      <div className='parameters-container'>
        <div className='parameters-header'>
          <span className='header-text font-lg font-center'>Test Parameters</span>
        </div>
        <div className='parameters-content'>
          <Grid container>
            {/* {Array.from({ length: 25 }, () => (
              <Grid item md={4} className='parameter-cell-grid'>
                <div className='parameter-cell'>
                  <p className='cell-header'>Marks type</p>
                  <p className='cell-header right-align'>Text book answer</p>
                </div>
              </Grid>
            ))} */}
            <Grid item md={4} className='parameter-cell-grid'>
              <div className='parameter-cell'>
                <p className='cell-header' style={{ color: '#ff6b6b' }}>
                  Test type
                </p>
                <p className='cell-header left-align'>{testType}</p>
              </div>
            </Grid>
            <Grid
              item
              md={4}
              className='parameter-cell-grid'
              style={{ backgroundColor: '#f6f6f6' }}
            >
              <div className='parameter-cell'>
                <p className='cell-header' style={{ color: '#ff6b6b' }}>
                  Test ID
                </p>
                <p className='cell-header left-align'>{id}</p>
              </div>
            </Grid>
            <Grid item md={4} className='parameter-cell-grid'>
              <div className='parameter-cell'>
                <p className='cell-header' style={{ color: '#ff6b6b' }}>
                  Duration
                </p>
                {/* <p className='cell-header right-align'>{testDuration}</p> */}
                <p className='cell-header left-align'>{testDuration}</p>
              </div>
            </Grid>
            <Grid item md={4} className='parameter-cell-grid'>
              <div className='parameter-cell'>
                <p className='cell-header' style={{ color: '#ff6b6b' }}>
                  Total marks
                </p>
                <p className='cell-header left-align'>{totalMark}</p>
              </div>
            </Grid>
            <Grid
              item
              md={4}
              className='parameter-cell-grid'
              style={{ backgroundColor: '#f6f6f6' }}
            >
              <div className='parameter-cell'>
                <p className='cell-header' style={{ color: '#ff6b6b' }}>
                  Created
                </p>
                <p className='cell-header left-align'>
                  {createdDate ? moment(createdDate).format('DD-MM-YYYY') : ''}
                </p>
              </div>
            </Grid>
            <Grid item md={4} className='parameter-cell-grid'>
              <div className='parameter-cell'>
                <p className='cell-header' style={{ color: '#ff6b6b' }}>
                  Updated
                </p>
                <p className='cell-header left-align'>
                  {updatedDate ? moment(updatedDate).format('DD-MM-YYYY') : ''}
                </p>
              </div>
            </Grid>
          </Grid>
          {!handleClose &&
            <div style={{ margin: '1rem' }}>
              <Grid container >
                <Grid item xs={12} >
                  <Button variant='contained' color='primary' onClick={() => downloadAssessment()}>
                    <GetAppIcon fontSize="small" />
                    Download Question Paper
                  </Button>
                </Grid>
                {test?.test_mode == 2 ?
                  <Grid item xs={12} style={{ margin: '4% 0' }} >
                    <Button variant='contained' color='primary' onClick={handleData}>
                      Upload Marks
                    </Button>
                  </Grid>
                  : ''}
                <Grid item xs={12} style={{ margin: '4% 0' }} >
                  <Button variant='contained' color='primary' onClick={handleTest}>
                    Preview
                  </Button>
                </Grid>
                <Grid item xs={12}  >

                  {testType == 'Quiz' && test?.test_mode == 1 ?
                    <>
                      {testDate == null ?
                      <>
                      {!testStart ?
                        <Button variant='contained' color='primary' onClick={openStartModal}>
                          Start Test
                        </Button>
                        : 
                        <Button variant='contained' color='primary' disabled>
                          In Progress
                        </Button>
                        }
                        </>
                        :
                        <Button variant='contained' disabled color='primary' >
                          Test Completed
                        </Button>
                      }
                    </>
                    : ''}
                </Grid>
              </Grid>
            </div>}
        </div>
      </div>
      <Dialog open={confirmAlert} onClose={CancelStart}>
          <DialogTitle id='draggable-dialog-title'>Confirm Start</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Once The Test Is Started, You Can't Stop It.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={CancelStart} className='labelColor cancelButton'>
              Cancel
            </Button>
            <Button
              color='primary'
              variant='contained'
              style={{ color: 'white' }}
              onClick={handleTeststart}
            >
              Start
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  );
};

export default AssesmentDetails;
