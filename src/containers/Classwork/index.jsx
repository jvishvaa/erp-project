import React, { useEffect, useState } from 'react';
import Layout from '../Layout';
import axiosInstance from '../../config/axios';
import DateFnsUtils from '@date-io/date-fns';
import Attachment from '../../components/attachment/index';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import { IconButton, Typography } from '@material-ui/core';
import placeholder from '../../assets/images/placeholder_small.jpg';
import moment from 'moment';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import FileDialogOpen from './dialogOpen/dialogOpen';

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import './style.scss';
import { Folder } from '@material-ui/icons';

const ClassWork = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [responseData, setResponseData] = useState();
  const [uploadData, setUploadData] = useState();
  const [openDialog, setOpenDiaolg] = useState(false);
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  let dateString = moment(selectedDate).format('YYYY-MM-DD');
  console.log(dateString, 'date wdawd==');
  useEffect(() => {
    callingClassWorkAPI();
  }, [selectedDate]);
  const callingClassWorkAPI = () => {
    let paramOne = props.match.params.param1;
    let paramTwo = props.match.params.param2;
    let dateString = moment(selectedDate).format('YYYY-MM-DD');
    axiosInstance
      .get(
        `/academic/classwork-submitted-list/?zoom_id=${paramTwo}&date=${dateString}&online_class_id=${paramOne}`,
        {}
      )
      .then((res) => {
        setResponseData(res.data);
        console.log(res.data, 'show responce');
      })
      .catch((error) => {
        console.log(error, 'error responce');
      });
  };
  const handleOpenDialog = (data) => {
    setOpenDiaolg(true);
    setUploadData(data);
  };
  const handleCloaseDialog = () => {
    setOpenDiaolg(false);
  };
  return (
    <div>
      <Layout>
        <div className='class-work-module'>
          <div className='calsswork-breadcrums-container'>
            <CommonBreadcrumbs componentName='classwork' />
          </div>
          <div className='date-picker-container'>
            {' '}
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin='normal'
                id='date-picker-dialog'
                label='Date picker dialog'
                format='MM/dd/yyyy'
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </div>

          {responseData &&
            responseData.map((data, index) => (
              <div
                key={index}
                className='folder-container'
                onClick={() => handleOpenDialog(data)}
              >
                <div className='top-filter-container'></div>
                <div className='outer-box'>
                  <div className='inner-box'></div>
                  <div className='lower-box'>
                    <div>{data.student_name}</div>
                    <div>{data.erp_id}</div>{' '}
                  </div>
                </div>
              </div>
            ))}
          {openDialog ? (
            <div className='file-preview-container'>
              <div className='all-files'>
                <div className='attachment-files'>
                  <div className='homework-question-container student-view'>
                    <div className='attachments-container'>
                      <Typography component='h4' color='primary' className='header'>
                        All Submitted Files
                      </Typography>
                      <div className='attachments-list-outer-container'>
                        <SimpleReactLightbox>
                          <div
                            className='attachments-list'
                            onScroll={(e) => {
                              e.preventDefault();
                            }}
                          >
                            {uploadData?.submitted_files &&
                              uploadData?.submitted_files?.map((url, i) => (
                                <>
                                  <div className='attachment'>
                                    <Attachment
                                      key={`homework_student_question_attachment_${i}`}
                                      fileUrl={url}
                                      fileName={`Attachment-${i + 1}`}
                                      index={i}
                                      actions={['preview', 'download']}
                                    />
                                  </div>
                                </>
                              ))}
                            <div style={{ position: 'absolute', visibility: 'hidden' }}>
                              <SRLWrapper>
                                {uploadData?.submitted_files &&
                              uploadData?.submitted_files?.map((url, i) => (
                                  <img
                                    src={`${url}`}
                                    onError={(e) => {
                                      e.target.src = placeholder;
                                    }}
                                    alt={`Attachment-${i + 1}`}
                                  />
                                ))}
                              </SRLWrapper>
                            </div>
                          </div>
                        </SimpleReactLightbox>
                        {/* {submittedEvaluatedFilesBulk.length > 5 && (
                          <div className='next-btn'>
                            <IconButton onClick={() => handleScroll('right')}>
                              <ArrowForwardIosIcon color='primary' />
                            </IconButton>
                          </div>
                        )} */}
                      </div>
                    </div>
                    {/* {homeworkSubmission.status === 3 ? (
                      <div className='overallContainer'>
                        {questionwiseComment && (
                          <div className='scoreBox1'>
                            Overall Score : {questionwiseComment}
                          </div>
                        )}
                        {questionwiseRemark && (
                          <div className='remarkBox1'>
                            Overall Remark : {questionwiseRemark}
                          </div>
                        )}
                      </div>
                    ) : null} */}
                  </div>
                </div>
              </div>{' '}
            </div>
          ) : (
            <></>
          )}

          {/* <FileDialogOpen
            openDialog={openDialog}
            handleCloseDialog={handleCloaseDialog}
            uploadData={uploadData}
          /> */}
        </div>
      </Layout>
    </div>
  );
};

export default ClassWork;
