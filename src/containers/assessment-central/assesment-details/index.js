import React, { useContext, useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, IconButton, Button } from '@material-ui/core';
import FileValidators from 'components/file-validation/FileValidators';
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
import {
  Drawer,
  Tooltip,
  Typography,
  message,
  Modal,
  Progress,
  Spin,
  Badge,
  Divider,
} from 'antd';
import { useFormik } from 'formik';
import { Form, Select, Checkbox } from 'antd';
import Loader from 'components/loader/loader';
import {
  DownOutlined,
  FileAddOutlined,
  EyeFilled,
  DownloadOutlined,
} from '@ant-design/icons';
import { uploadFilePortion, uploadFilePortionUpdate } from 'redux/actions';
import { getFileIcon } from 'v2/getFileIcon';
import { AttachmentPreviewerContext } from 'components/attachment-previewer/attachment-previewer-contexts';
import { saveAs } from 'file-saver';

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
  userLevel,
  filterResults,
  allowChangeReviewStatus,
}) => {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  console.log(filterData, 'filter');
  const [loading, setLoading] = useState(false);
  const [isteacher, setIsTeacher] = useState(false);
  const [allowReview, setAllowReview] = useState(test?.is_review_enabled);
  const [isdisable, setIsDisable] = useState(false);
  const fileUploadInput = useRef(null);
  const [percentValue, setPercentValue] = useState(10);
  const [uploadStart, setUploadStart] = useState(false);
  const [attachments, setAttachments] = useState(null);
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  const [fileUploadInProgress, setFileUploadInProgress] = useState(false);
  const { openPreview } = React.useContext(AttachmentPreviewerContext) || {};

  let idInterval = null;
  useEffect(() => {
    if (uploadStart == true && percentValue < 90) {
      idInterval = setInterval(
        () => setPercentValue((oldCount) => checkCount(oldCount)),
        1000
      );
    }

    return () => {
      clearInterval(idInterval);
      setPercentValue(10);
    };
  }, [uploadStart]);

  const checkCount = (count) => {
    if (count < 90) {
      return count + 5;
    } else {
      return count;
    }
  };

  const {
    test_id: id,
    id: assessmentId,
    testType,
    grade,
    enable,
    subjects,
    document_portion: portionDocumentData,
    can_upload: uploadPortion,
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
    is_review_enabled,
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

  const handleTestReviewStatus = (status) => {
    axiosInstance
      .patch(`/assessment/${assessmentId}/test/`, { is_review_enabled: status })
      .then((res) => {
        if (res?.data?.status_code == 200) {
          message.success('Successfully updated status');
        } else {
          message.error(res?.data?.message);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
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
  const [inProgress, setInprogress] = useState(false);

  const CancelStart = () => {
    setConfirmAlert(false);
  };
  let currDate = new Date();
  useEffect(() => {
    if (testDate != null) {
      var add_minutes = function (dt, minutes) {
        return new Date(dt.getTime() + minutes * 60000);
      };

      let endTime = add_minutes(new Date(testDate), testDuration).toString();
      const inProgressQuiz = moment(endTime).isAfter(currDate);
      setInprogress(inProgressQuiz);
      console.log(inProgressQuiz, 'inprogress');
    }
  }, []);

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

  const sectionOptions = sectionName?.map((each, index) => {
    return (
      <Option key={index} value={index}>
        {each}
      </Option>
    );
  });
  console.log(sectionOptions, section_mapping);

  const handleQuizstart = () => {
    if (formik.values.section != '') {
      setIsDisable(true);
      let payload = {
        test_id: assessmentId,
        section_mapping: formik.values.section,
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
            onClosedrawer();
            filterResults(1);
            setIsDisable(false);
          } else {
            setAlert('error', 'Failed to Start the Test');
            setConfirmAlert(false);
          }
        })
        .catch((error) => {
          setAlert('error', error?.message);
          setConfirmAlert(false);
        });
    } else {
      setAlert('error', 'Please Select Section');
    }
  };

  const handleSection = (e, value) => {
    console.log(e, value);
    formik.setFieldValue('section', section_mapping[e]);
  };

  useEffect(() => {
    if (quizAccess != [] && userLevel) {
      if (quizAccess?.includes(userLevel) == true) {
        setIsTeacher(true);
      } else {
        setIsTeacher(false);
      }
    }
  }, [quizAccess]);

  const handleFileUpload = async (file) => {
    if (!file) {
      return null;
    }
    const isValid = FileValidators(file);
    if (isValid?.isValid) {
      try {
        if (file.name.toLowerCase().lastIndexOf('.pdf') > 0) {
          const fd = new FormData();
          fd.append('file', file);
          fd.append('test_id', assessmentId);

          setUploadStart(true);
          setPercentValue(10);
          if (portionDocumentData?.id) {
            const filePath = await uploadFilePortionUpdate(fd, portionDocumentData?.id);

            console.log(filePath, 'path');
            if (filePath != undefined) {
              setAttachments(filePath);
              setAttachmentPreviews(filePath);
              setPercentValue(100);
              setUploadStart(false);
              setAlert('success', 'File uploaded successfully');
            } else {
              setAlert('error', 'Failed to Upload file');
              setPercentValue(100);
              setUploadStart(false);
            }
          } else {
            const filePath = await uploadFilePortion(fd);

            console.log(filePath, 'path');
            if (filePath != undefined) {
              setAttachments(filePath);
              setAttachmentPreviews(filePath);
              setPercentValue(100);
              setUploadStart(false);
              setAlert('success', 'File uploaded successfully');
            } else {
              setAlert('error', 'Failed to Upload file');
              setPercentValue(100);
              setUploadStart(false);
            }
          }
        } else {
          setAlert('error', 'Please upload valid file');
          setPercentValue(100);
          setUploadStart(false);
        }
      } catch (e) {
        // setFileUploadInProgress(false);
        setPercentValue(100);
        setUploadStart(false);
        setAlert('error', 'File upload failed');
      }
    } else {
      if (isValid?.msg) {
        setAlert('error', isValid?.msg);
      } else {
        setAlert('error', 'Please upload valid file');
      }
    }
  };

  console.log(
    attachmentPreviews,
    attachments,
    uploadPortion,
    portionDocumentData,
    'previews'
  );
  useEffect(() => {
    if (portionDocumentData?.document_portion) {
      setAttachments(portionDocumentData?.document_portion);
    }
  }, [portionDocumentData]);

  const downloadMaterial = async (url, filename) => {
    const res = await fetch(url);
    const blob = await res.blob();
    saveAs(blob, filename);
  };

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
          <div
            className={`${
              filterData?.status?.children !== 'Completed' ? 'col-10' : 'col-12'
            } px-0`}
          >
            <div className='row'>
              <div className='col-3 px-0'>
                <span className='th-16'></span>Test Name :
              </div>
              <div className='col-9 text-wrap pl-0' title={testName}>
                <span className='th-16'>{testName}</span>
              </div>
            </div>
            {/* Test Name : <span>{testName}</span> */}
          </div>
          {filterData?.status?.children !== 'Completed' && (
            <div className='col-2 d-flex justify-content-end'>
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
          Test Id : <Typography className='ml-2'>{test_id}</Typography>
        </div>
        <div className='row'>
          <div className='col-12 px-0 text-truncate'>
            Section :{' '}
            <Tooltip
              placement='bottomLeft'
              title={
                <span className=''>{sectionName.map((sec, i) => sec).join(', ')}</span>
              }
              trigger='hover'
              className='th-pointer'
              zIndex={2000}
            >
              <span className='ml-2'>{sectionName.map((sec, i) => sec).join(', ')}</span>
            </Tooltip>
          </div>
          {allowChangeReviewStatus && (
            <div className='col-12 pl-0 py-2'>
              <Checkbox
                onChange={() => {
                  setAllowReview(!allowReview);
                  handleTestReviewStatus(!allowReview);
                }}
                checked={allowReview}
              >
                <span className='th-16 th-fw-600'>Allow Review</span>
              </Checkbox>
            </div>
          )}
        </div>

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
            <div
              className='col-md-12 p-2 my-2'
              style={{ borderColor: 'black', border: '1px solid' }}
            >
              {uploadPortion ? (
                <div className='col-md-12 p-0'>
                  <div>
                    <div className='th-17 th-fw-600 p-0 mt-2'>Portion Document</div>
                    <Divider className='m-1' />
                    <div
                      className='col-md-12 p-0 card w-100'
                      onClick={() => fileUploadInput.current.click()}
                      style={{ padding: '5px', height: '35px', cursor: 'pointer' }}
                    >
                      <input
                        className='file-upload-input-portion-pdf '
                        type='file'
                        name='attachments'
                        accept='.pdf, .PDF'
                        onChange={(e) => {
                          handleFileUpload(e.target.files[0]);
                          e.target.value = null;
                        }}
                        ref={fileUploadInput}
                      />
                      {fileUploadInProgress ? (
                        <div>
                          <Spin
                            color='primary'
                            style={{ width: '25px', height: '25px', margin: '5px' }}
                          />
                        </div>
                      ) : (
                        <>
                          <div className='row'>
                            <Badge
                              count={attachments != null ? 1 : 0}
                              color='primary'
                              size='small'
                              className='p-1'
                            >
                              <FileAddOutlined
                                color='primary'
                                onClick={() => fileUploadInput.current.click()}
                                title='Attach files'
                                style={{ color: 'primary', fontSize: '20px' }}
                              />
                            </Badge>
                            <span
                              className='th-16 mx-3'
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              Attach Portion Document
                            </span>
                          </div>
                          {/* <span className='th-12'>Accepted: jpg,png,pdf,mp4</span> */}
                        </>
                      )}
                    </div>
                    <div className='row th-13 justify-content-between mt-1'>
                      <span className='my-1 th-14'>Accepted : pdf</span>
                      <span className='my-1 th-14'> Max File size: 30MB </span>
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}

              {attachments != null ? (
                <div
                  className='row mt-2 py-2 align-items-center'
                  style={{ border: '1px solid #d9d9d9' }}
                >
                  <div className='col-2'>
                    <img src={getFileIcon('pdf')} />
                  </div>
                  <div className='col-10 px-0 th-pointer'>
                    <div className='row align-items-center'>
                      <div className='col-9 px-0'>
                        <a
                          onClick={() => {
                            openPreview({
                              currentAttachmentIndex: 0,
                              attachmentsArray: [
                                {
                                  src: `${endpoints.assessment.erpBucket}/${attachments}`,

                                  name: attachments,
                                  extension: '.pdf',
                                },
                              ],
                            });
                          }}
                          rel='noopener noreferrer'
                          target='_blank'
                        >
                          {attachments}
                        </a>
                      </div>

                      <div className='col-1'>
                        <a
                          onClick={() => {
                            openPreview({
                              currentAttachmentIndex: 0,
                              attachmentsArray: [
                                {
                                  src: `${endpoints.assessment.erpBucket}/${attachments}`,

                                  name: attachments,
                                  extension: '.pdf',
                                },
                              ],
                            });
                          }}
                          rel='noopener noreferrer'
                          target='_blank'
                        >
                          <EyeFilled />
                        </a>
                      </div>
                      <div className='col-1'>
                        <a
                          rel='noopener noreferrer'
                          target='_self'
                          onClick={() =>
                            downloadMaterial(
                              `${endpoints.assessment.erpBucket}/${attachments}`,
                              attachments
                            )
                          }
                        >
                          <DownloadOutlined />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
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
                        <>
                          {testType == 'Quiz' && test?.test_mode == 1 && inProgress ? (
                            <Button variant='contained' disabled color='primary'>
                              In Progress
                            </Button>
                          ) : (
                            <Button variant='contained' disabled color='primary'>
                              Test Completed
                            </Button>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    ''
                  )}
                </Grid>
                {enable && (
                  <Grid item xs={12} style={{ marginTop: '5%' }}>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => downloadAssessment()}
                    >
                      <GetAppIcon fontSize='small' />
                      Download Question Paper
                    </Button>
                  </Grid>
                )}
                {((filterData?.status?.children === 'Completed' &&
                  testType != 'Open Test') ||
                  filterData?.status?.id === 2 ||
                  (testType == 'Quiz' && testDate != null)) && (
                  <Grid item xs={12} style={{ margin: '4% 0' }}>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={handleDownloadReport}
                    >
                      <GetAppIcon fontSize='small' />
                      Download Report
                    </Button>
                  </Grid>
                )}
                {testType == 'Open Test' && (
                  <Grid item xs={12} style={{ margin: '4% 0' }}>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={handleDownloadReport}
                    >
                      <GetAppIcon fontSize='small' />
                      Download Report
                    </Button>
                  </Grid>
                )}
              </Grid>
            )}
          </div>
        </div>
      </div>
      <Dialog open={confirmAlert} onClose={CancelStart} maxWidth='sm' fullWidth>
        <DialogTitle id='draggable-dialog-title'>Confirm Start</DialogTitle>
        <DialogContent style={{ minHeight: '200px' }}>
          <DialogContentText>
            Once The Test Is Started, You Can't Stop It.
          </DialogContentText>
          {testType == 'Quiz' &&
          test?.test_mode == 1 &&
          isteacher &&
          section_mapping[0] != null ? (
            <div>
              <div className='mb-2 text-left'>Section</div>
              <Form.Item name='section'>
                <Select
                  allowClear
                  placeholder='Select Section'
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
          ) : (
            ''
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={CancelStart} className='labelColor cancelButton'>
            Cancel
          </Button>
          {isdisable ? (
            <Button
              color='primary'
              variant='contained'
              style={{ color: 'white' }}
              onClick={handleQuizstart}
              disabled
            >
              Start
            </Button>
          ) : (
            <Button
              color='primary'
              variant='contained'
              style={{ color: 'white' }}
              onClick={handleQuizstart}
            >
              Start
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Modal
        maskClosable={false}
        closable={false}
        footer={null}
        visible={uploadStart}
        width={1000}
        centered
      >
        <Progress
          strokeColor={{
            from: '#108ee9',
            to: '#87d068',
          }}
          percent={percentValue}
          status='active'
          className='p-4'
        />
      </Modal>
    </Drawer>
  );
};

export default AssesmentDetails;
