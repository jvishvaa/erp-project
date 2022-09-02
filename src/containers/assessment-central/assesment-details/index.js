import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, IconButton, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment';
import './styles.scss';
import GetAppIcon from '@material-ui/icons/GetApp';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { handleDownloadPdf } from '../../../../src/utility-functions';

const AssesmentDetails = ({ test, onClick, onClose, filterData, handleClose }) => {
  const history = useHistory();
  console.log(test , "filter");
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
    test_id: test_id
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

  const downloadAssessment = () => {
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
      })
      .catch((error) => {
        setAlert(error?.message);
      });
  };

  const handleTest = () => {
    history.push(
      `/assessment/${question_paper_id}/${assessmentId}/attempt/`
    );
    console.log(test);
  };

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
        <div className='secondary-header-container'>
          <div className='secondary-text font-lg'>{testName}</div>
          <div className='secondary-text font-sm sop'>
            <div>Scheduled on</div>
            {console.log(testDate?.slice(11, 16), 'dateteimeeeeee')}
            <div>
              {testDate ? moment(testDate).format('DD-MM-YYYY') : '--'}{' '}
              {testDate ? testDate?.slice(11, 16) : '--'}
            </div>
            {/* <p style={{marginRight:'90px'}}>Scheduled on {testDate ? moment(testDate).format('DD-MM-YYYY') : '--'}</p> */}
          </div>
        </div>
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
              </Grid>
            </div>}
        </div>
      </div>
    </div>
  );
};

export default AssesmentDetails;
