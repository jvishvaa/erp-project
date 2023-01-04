import React, { useContext, useState, useEffect } from 'react';
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
import { Drawer, Tooltip, Typography } from 'antd';
import { useFormik } from 'formik';
import {  Form, Select,  } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Loader from 'components/loader/loader';

const { Option } = Select;


const AssesmentDetails = ({
  test,
  onClick,
  onClose,
  filterData,
  handleClose,
  testselection,
  reportLoad,
  quizAccess,
  userLevel
}) => {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  console.log(filterData, 'filter');
  const [loading, setLoading] = useState(false);
  const [ isteacher , setIsTeacher ] = useState(false)
  const {
    test_id: id,
    id: assessmentId,
    testType,
    grade,
    enable,
    subjects,
    test_name: testName = 'Assessment',
    test_date: testDate,
    test_duration: testDuration,
    total_mark: totalMark,
    created_at: createdDate,
    updated_at: updatedDate,
    test_mode: testMode,
    section_name: sectionName,
    section_mapping,
    question_paper_id: question_paper_id,
    test_id: test_id,
  } = test;

  const formik = useFormik({
    initialValues: {
      section: '',
    },
  });

  const handleData = () => {
    sessionStorage.setItem('createfilterdata', JSON.stringify(filterData));
    let state = {
      // data: filterData,
      test: test,
    };
    history.push({ pathname: '/offline-student', state });
  };

  useEffect(() => {
    showDrawer();
  }, []);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClosedrawer = () => {
    setOpen(false);
    onClose();
  };

  const handleDownloadReport = () => {
    setLoading(true);
    let url = `${endpoints.assessmentReportTypes.reportPdf}?test=${JSON.stringify(
      assessmentId
    )}&section_mapping=${section_mapping.toString()}`;
    axiosInstance
      .get(url, {
        responseType: 'arraybuffer',
      })
      .then((res) => {
        setLoading(false);
        const {
          headers = {},
          message = 'Cannot download Test Report',
          data = '',
        } = res || {};
        const contentType = headers['content-type'] || '';
        if (contentType === 'application/pdf') {
          handleDownloadPdf(data, 'test report');
        } else {
          setAlert('info', message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.response.data.message || error.response.data.msg);
      });
  };

  const { setAlert } = useContext(AlertNotificationContext);
  const [testStart, setTestStart] = useState(false);
  const [confirmAlert, setConfirmAlert] = useState(false);

  const CancelStart = () => {
    setConfirmAlert(false);
  };

  const openStartModal = () => {
    setConfirmAlert(true);
  };

  const downloadAssessment = () => {
    reportLoad(true);
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
        reportLoad(false);
      })
      .catch((error) => {
        setAlert(error?.message);
        reportLoad(false);
      });
  };

  const getSection = () => {
    var sectionname = ' ';
    let getsectionname = sectionName.map((sec, i) => {
      // var check = sec.split('')
      // console.log(check[ check?.length - 1 ]);
      if (sectionname?.length - 1 == i) {
        sectionname += `${sec}`;
      } else {
        sectionname += `${sec},`;
      }
    });
    return sectionname;
  };

  const handleTest = () => {
    history.push(`/assessment/${question_paper_id}/${assessmentId}/attempt/`);
    console.log(test);
  };

  const handleTeststart = () => {
    var today = new Date().toISOString().replace('Z', '');
    today = today.replace(/\.\d+/, '');
    console.log(today);
    let payload = {
      test_duration: testDuration,
      test_date: today,
      id: assessmentId,
    };
    axiosInstance
      // .put(`/assessment/update-test/?test_duration=${testDuration}&test_date=${today}&id=${assessmentId}`)
      .put(`/assessment/update-test/`, payload)
      .then((res) => {
        console.log(res);
        if (res.data.status_code == 200) {
          setAlert('success', 'Test Started');
          setTestStart(true);
          setConfirmAlert(false);
        } else {
          setAlert('error', 'Failed to Start the Test');
          setConfirmAlert(false);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setConfirmAlert(false);
      });
  };

  const sectionOptions = sectionName?.map((each , index) => {
    return (
      <Option key={index} value={index}>
        {each}
      </Option>
    );
  });
  console.log(sectionOptions , section_mapping);

  const handleQuizstart = () => {
    if(formik.values.section != ''){
    let payload = {
      test_id: assessmentId,
      section_mapping: formik.values.section
    };
    axiosInstance
      // .put(`/assessment/update-test/?test_duration=${testDuration}&test_date=${today}&id=${assessmentId}`)
      .post(`${endpoints.academics.startQuiz}`, payload)
      .then((res) => {
        console.log(res);
        if (res.data.status_code == 200) {
          setAlert('success', 'Test Started');
          setTestStart(true);
          setConfirmAlert(false);
          onClosedrawer()
        } else {
          setAlert('error', 'Failed to Start the Test');
          setConfirmAlert(false);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setConfirmAlert(false);
      });
    }else {
      setAlert('error', 'Please Select Section');

    }
  };

  const handleSection = (e , value) => {
    console.log(e , value);
    formik.setFieldValue('section', section_mapping[0]);
  }

  useEffect(() => {
   if(quizAccess != [] && userLevel){
    if(quizAccess?.includes(userLevel) == true){
      setIsTeacher(true)
    } else{
      setIsTeacher(false)
    }
   }

  },[quizAccess])

  return (
    <Drawer
      title={testMode == 1 ? 'Online' : 'Offline'}
      zIndex={1300}
      width={'450px'}
      placement='right'
      onClose={onClosedrawer}
      open={open}
      visible={open}
    >
      {/* <div className='header-container'>
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
            }</span>
          </div>
        </div>
        {testDate != null ?
          <div className='secondary-header-container'>
            <div className='secondary-text font-lg'>{testName}</div>
            <div className='secondary-text font-sm sop'>
              <div>Created on</div>
              {console.log(testDate?.slice(11, 16), 'dateteimeeeeee')}
              <div>
                {testDate ? moment(testDate).format('DD-MM-YYYY') : '--'}{' '}
                {testDate ? testDate?.slice(11, 16) : '--'}
              </div>
            </div>
          </div>
          : ''}
      </div>
      <div className='parameters-container'>
        <div className='parameters-header'>
          <span className='header-text font-lg font-center'>Test Parameters</span>
        </div>
        <div className='parameters-content'>
          <Grid container>
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
                  {testType == 'Quiz' && test?.test_mode == 1 ?
                  <>
                  {testDate == null ?
                    <Button variant='contained' color='primary' onClick={handleTeststart}>
                      Start Test
                    </Button>  
                    : '' }
                    </>
                    : ''}
                </Grid>
                <Grid item xs={12}  >

                  {testType == 'Quiz' && test?.test_mode == 1 ?
                    <>
                      {testDate == null ?
                      <>
                      {!testStart ?
                        <Button variant='contained' color='primary' onClick={handleTeststart}>
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
                {((filterData?.status?.name === "Completed" || filterData?.status?.id === 2) || (testType == 'Quiz' && testDate != null)) && <Grid item xs={12} style={{margin : '4% 0'}}>
                  <Button variant='contained' color='primary' onClick={handleDownloadReport}>
                    <GetAppIcon fontSize="small" />
                    Download Report
                  </Button>
                </Grid>}
              </Grid>
            </div>}
        </div>
      </div> */}
      <div>
        <div className='row align-items-center'>
          <div className='col-10 px-0'>
            <div className='row'>
              <div className='col-4 px-0'>
                <span className='th-16'></span>Test Name:
              </div>
              <div className='col-8 pl-0'>
                <span className='th-16'>{testName}</span>
              </div>
            </div>
            {/* Test Name : <span>{testName}</span> */}
          </div>
          {filterData?.status?.children !== 'Completed' && (
            <div className='col-md-2 d-flex justify-content-end'>
              <Button
                color='primary'
                variant='contained'
                onClick={() => {
                  sessionStorage.setItem('createfilterdata', JSON.stringify(filterData));
                  history.push({
                    pathname: '/create-assesment',
                    state: {
                      isEdit: true,
                      data: test,
                      filterData: JSON.stringify(filterData),
                    },
                  });
                }}
              >
                Edit
              </Button>
            </div>
          )}
        </div>
        <div className='row py-3'>
          TestId : <Typography className='ml-2'>{test_id}</Typography>
        </div>
        <div className='row'>
          Section :
          <p
            title={getSection()}
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '15px',
            }}
          >
            {`${
              getSection().length > 25 ? getSection().slice(0, 40) + '...' : getSection()
            }`}
          </p>
        </div>
        {testType == 'Quiz' && test?.test_mode == 1 && isteacher && section_mapping[0] != null ?
        <div >
                <div className='mb-2 text-left'>Section</div>
                <Form.Item name='section'>
                  <Select
                    allowClear
                    placeholder= 'Select Section'                   
                    getPopupContainer={(trigger) => trigger.parentNode}
                    optionFilterProp='children'
                    showArrow={true}
                    suffixIcon={<DownOutlined className='th-grey' />}
                    filterOption={(input, options) => {
                      return (
                        options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    value={formik.values.section || []}
                    onChange={(e, value) => {
                      handleSection(e, value);
                    }}
                    // onClear={handleClearBoard}
                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                    bordered={false}
                  >
                    {sectionOptions}
                  </Select>
                </Form.Item>
              </div>
              : ''}
        <div className='parameters-container mt-2'>
          {/* <div className='parameters-header'>
          <span className='header-text font-lg font-center'>Test Parameters</span>
        </div> */}
          <div className='parameters-content'>
            <Grid
              className='pl-4 pt-2'
              container
              style={{ backgroundColor: '#F1F1F1', border: '1px solid black' }}
            >
              <Grid item md={3} className='parameter-cell-grid'>
                <div className='parameter-cell'>
                  <p className='cell-header font-weight-bold'>Test type</p>
                  <p className='cell-header left-align'>{testType}</p>
                </div>
              </Grid>
              <Grid item md={6}></Grid>
              {/* <Grid
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
            </Grid> */}
              <Grid item md={3} className='parameter-cell-grid'>
                <div className='parameter-cell'>
                  <p className='cell-header font-weight-bold'>Duration</p>
                  <p className='cell-header left-align'>{testDuration}</p>
                </div>
              </Grid>
              <div className='row mt-4'></div>
              <Grid item md={3} className='parameter-cell-grid'>
                <div className='parameter-cell'>
                  <p className='cell-header font-weight-bold'>Total marks</p>
                  <p className='cell-header left-align'>{totalMark}</p>
                </div>
              </Grid>
              <Grid item md={6}></Grid>
              <Grid item md={3} className='parameter-cell-grid'>
                <div className='parameter-cell'>
                  <p className='cell-header font-weight-bold'>Created</p>
                  <p className='cell-header left-align'>
                    {createdDate ? moment(createdDate).format('DD-MM-YYYY') : ''}
                  </p>
                </div>
              </Grid>
              {/* <Grid item md={4} className='parameter-cell-grid'>
              <div className='parameter-cell'>
                <p className='cell-header' style={{ color: '#ff6b6b' }}>
                  Updated
                </p>
                <p className='cell-header left-align'>
                  {updatedDate ? moment(updatedDate).format('DD-MM-YYYY') : ''}
                </p>
              </div>
            </Grid> */}
            </Grid>
            {(!testselection || !handleClose) && (
              <Grid container>
                {/* <Grid item xs={12} style={{ margin: '4% 0' }} >
                     <Button variant='contained' color='primary' onClick={handleData}>
                       Upload Marks
                     </Button>
                   </Grid> */}
                <div className='row mt-4'>
                  {filterData?.status?.children === 'Completed' &&
                    test?.test_mode == 2 && (
                      <div className='col-6-md'>
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={() => handleData()}
                        >
                          Upload Marks
                        </Button>
                      </div>
                    )}
                  {enable && (
                    <div
                      className='col-6-md '
                      style={{ marginLeft: test?.test_mode == 2 ? '43%' : '0' }}
                    >
                      <Button variant='contained' color='primary' onClick={handleTest}>
                        Preview
                      </Button>
                    </div>
                  )}
                </div>

                {/* <Grid item xs={12} style={{ margin: '4% 0' }} >
                  <Button variant='contained' color='primary' onClick={handleTest}>
                    Preview
                  </Button>
                  {testType == 'Quiz' && test?.test_mode == 1 ?
                  <>
                  {testDate == null ?
                    <Button variant='contained' color='primary' onClick={handleTeststart}>
                      Start Test
                    </Button>  
                    : '' }
                    </>
                    : ''}
                </Grid> */}
                <Grid item xs={12} className={testType == 'Quiz' ? 'mt-4' : ''}>
                  {testType == 'Quiz' && test?.test_mode == 1 && isteacher ? (
                    <>
                      {testDate == null ? (
                        <>
                          {!testStart ? (
                            <Button
                              variant='contained'
                              color='primary'
                              onClick={openStartModal}
                            >
                              Start Test
                            </Button>
                          ) : (
                            <Button variant='contained' color='primary' disabled>
                              In Progress
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button variant='contained' disabled color='primary'>
                          Test Completed
                        </Button>
                      )}
                    </>
                  ) : (
                    ''
                  )}
                </Grid>
                {enable && <Grid item xs={12} style={{marginTop:'5%'}}>
                  <Button variant='contained' color='primary' onClick={() => downloadAssessment()}>
                    <GetAppIcon fontSize="small" />
                    Download Question Paper
                  </Button>
                </Grid>}
                {((filterData?.status?.children === "Completed" || filterData?.status?.id === 2) || (testType == 'Quiz' && testDate != null)) && <Grid item xs={12} style={{margin : '4% 0'}}>
                  <Button variant='contained' color='primary' onClick={handleDownloadReport}>
                    <GetAppIcon fontSize="small" />
                    Download Report
                  </Button>
                </Grid>}
                {( (testType == 'Practice Test' || testType == 'Open Test')) && <Grid item xs={12} style={{margin : '4% 0'}}>
                  <Button variant='contained' color='primary' onClick={handleDownloadReport}>
                    <GetAppIcon fontSize="small" />
                    Download Report
                  </Button>
                </Grid>}
              </Grid>
            )}
          </div>
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
            onClick={handleQuizstart}
          >
            Start
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default AssesmentDetails;
