import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Badge,
  Paper,
  Grid,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Layout from '../../Layout';
import VisibilityIcon from '@material-ui/icons/Visibility';
import axiosInstance from '../../../config/axios';
import { AttachmentPreviewerContext } from '../../../components/attachment-previewer/attachment-previewer-contexts';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import FileValidators from 'components/file-validation/FileValidators';
import { uploadFile } from '../../../redux/actions';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import Attachment from '../../../containers/homework/teacher-homework/attachment';
import placeholder from '../../../assets/images/placeholder_small.jpg';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import './styles.scss';
import { useParams } from 'react-router-dom';
import Loader from '../../../components/loader/loader';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import DescriptiveTestcorrectionModule from '../../../components/EvaluationTool';
const desTestDetails = [{ asessment_response: { evaluvated_result: '' } }];
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 240,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  questionCard: {
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: '10px',
  },
  acceptedfiles: {
    color: theme.palette.secondary.main,
    width: '100%',
  },
  evaluatedAttachment: {
    flexShrink: 0,
    width: '250px',
  },
}));

const StudentSubmitHW = withRouter(({ history, ...props }) => {
  const fileUploadInput = useRef(null);
  const [homeWorkId, setHomeworkId] = useState(history?.location?.state?.homeworkId);
  const [homeworkdata, setHomeworkData] = useState(
    history?.location?.state?.homeworkdata
  );
  const [attachmentPreviews, setAttachmentPreviews] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [fileUploadInProgress, setFileUploadInProgress] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const [sizeValied, setSizeValied] = useState({});
  const classes = useStyles();
  const [resultdata, setresultdata] = useState();
  const [loading, setLoading] = useState(false);
  const [EvaluatedFiles, setEvaluatedFiles] = useState();
  const [overallRemark, setOverallRemark] = useState('');
  const [overallScore, setOverallScore] = useState('');
  const [instruction, setInstruction] = useState();
  const [hwName, setHwName] = useState();

  //For Preview//
  const [showPrev, setshowPrev] = useState(0);
  const attachmentsRef = useRef(null);

  // pentool //
  const [penToolOpen, setPenToolOpen] = useState(false);
  const [penToolUrl, setPenToolUrl] = useState('');
  const [penToolIndex, setPenToolIndex] = useState('');
  const [subjectQuestions, setSubjectQuestions] = useState([]);
  const [calssNameWise, setClassName] = useState('');
  const [bulkDataDisplay, setBulkDataDisplay] = useState([]);
  const [bulkData, setBulkData] = useState([]);
  const [HWstatus, setStatus] = useState();

  //submitted files
  const [submittedFiles, setSubmittedFiles] = useState([]);

  const mediaContent = {
    file_content: penToolUrl,
    id: 1,
    splitted_media: null,
  };

  const scrollableContainer = useRef(null);
  const openInPenTool = (url, index) => {
    setPenToolUrl(url);
    setPenToolIndex(index);
  };

  const handleCloseCorrectionModal = () => {
    setPenToolUrl('');
    setPenToolIndex('');
  };

  useEffect(() => {
    if (penToolUrl) {
      setPenToolOpen(true);
    } else {
      setPenToolOpen(false);
    }
  }, [penToolUrl]);

  const handleSaveEvaluatedFile = async (file) => {
    let maxAttachmentArray = resultdata.hw_questions; //
    let result = 0;
    let totalMaxAttachment = maxAttachmentArray.map((item) => {
      return (result += item.max_attachment);
    });

    if (bulkDataDisplay.length >= totalMaxAttachment[totalMaxAttachment.length - 1]) {
      setAlert(
        'warning',
        `Can\'t upload more than ${
          totalMaxAttachment[totalMaxAttachment.length - 1]
        } attachments in total.`
      );
      handleCloseCorrectionModal();
      return;
    }

    const fd = new FormData();
    fd.append('file', file);
    const filePath = await uploadFile(fd);
    // const list = bulkDataDisplay.slice();
    // list.push(filePath);
    // setBulkDataDisplay(list);
    // bulkData.push(filePath);
    const final = Object.assign({}, filePath);
    if (file.type === 'application/pdf') {
      setAttachments((prevState) => [...prevState, final]);
      setAttachmentPreviews((prevState) => [...prevState, final]);
    } else {
      setAttachments((prevState) => [...prevState, filePath]);
      setAttachmentPreviews((prevState) => [...prevState, filePath]);
    }
    setFileUploadInProgress(false);
    setAlert('success', 'File uploaded successfully');
    setSizeValied('');
    setPenToolUrl('');
  };

  ////////////////////////////////////////////////////////////
  useEffect(() => {
    setLoading(true);
    let status;
    if (homeworkdata?.status === 'un-opened') {
      status = 1;
      setStatus(1);
    } else if (homeworkdata?.hw_status) {
      status = homeworkdata?.hw_status;
      setStatus(homeworkdata?.hw_status);
    }
    axiosInstance
      .get(
        `${
          endpoints.homework.hwDelete
        }${homeWorkId}/hw-questions/?hw_status=${status}&module_id=${1}`
      )
      .then((result) => {
        if (result.data.status_code === 200 || result.data.status_code === 201) {
          if (homeworkdata?.status === 'un-opened' || homeworkdata?.hw_status === '1') {
            setresultdata(result.data.data);
            setSubjectQuestions(result.data.data?.hw_questions);
            setInstruction(result?.data?.data?.description);
            setHwName(result?.data?.data?.homework_name);
          } else if (homeworkdata?.hw_status === '2' || homeworkdata?.hw_status === '3') {
            if (homeworkdata?.hw_status === '2') {
              let submittedFile = result?.data?.data?.hw_questions?.submitted_files;

              if (submittedFile?.length) {
                setAttachments((prevState) => [...prevState, ...submittedFile]);
                setAttachmentPreviews((prevState) => [...prevState, ...submittedFile]);
              }
              setSubmittedFiles(submittedFile);
            }

            setresultdata(result.data.data);
            setInstruction(result?.data?.data?.homework?.description);
            setHwName(result?.data?.data?.homework?.homework_name);
            setEvaluatedFiles(result?.data?.data?.hw_questions?.evaluated_files);
            setOverallRemark(result.data.data?.overall_remark);
            setOverallScore(result.data.data?.score);
            setSubjectQuestions(result.data.data?.hw_questions?.questions);
          }
          setAlert('success', result.data.message);
          setLoading(false);
        } else {
          setAlert('error', result.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
    // if(homeworkdata?.hw_status){
    //   axiosInstance
    //       .get(`/academic/${history?.location?.homeworkId}/hw-questions/?hw_status=${2}`)
    //       .then((result) => {
    //           let submittedFile = result?.data?.data?.hw_questions?.submitted_files;
    //         if (result.data.status_code === 200 || result.data.status_code === 201) {
    //             if(submittedFile?.length){
    //                 setAttachments((prevState) => [...prevState, ...submittedFile]);
    //                 setAttachmentPreviews((prevState) => [...prevState, ...submittedFile]);
    //             }
    //             setSubmittedFiles(submittedFile)
    //           setAlert('success', result.data.message);
    //         } else {
    //           setAlert('error', result.data.message);
    //         }
    //       })
    //       .catch((error) => {
    //         setAlert('error', error.message);
    //       });
    // }
  }, [homeWorkId]);

  const handleFileUpload = async (file) => {
    setLoading(true);
    if (!file) {
      return null;
    }
    const isValid = FileValidators(file);
    !isValid?.isValid && isValid?.msg && setAlert('error', isValid?.msg);

    if (isValid?.isValid) {
      try {
        if (
          file.name.toLowerCase().lastIndexOf('.pdf') > 0 ||
          file.name.toLowerCase().lastIndexOf('.jpeg') > 0 ||
          file.name.toLowerCase().lastIndexOf('.jpg') > 0 ||
          file.name.toLowerCase().lastIndexOf('.png') > 0 ||
          file.name.toLowerCase().lastIndexOf('.mp3') > 0 ||
          file.name.toLowerCase().lastIndexOf('.mp4') > 0
        ) {
          setLoading(false);
          const fd = new FormData();
          fd.append('file', file);
          setFileUploadInProgress(true);
          const filePath = await uploadFile(fd);
          const final = Object.assign({}, filePath);
          if (file.type === 'application/pdf') {
            setAttachments((prevState) => [...prevState, ...filePath]);
            setAttachmentPreviews((prevState) => [...prevState, ...filePath]);
          } else {
            setAttachments((prevState) => [...prevState, filePath]);
            setAttachmentPreviews((prevState) => [...prevState, filePath]);
          }
          setFileUploadInProgress(false);
          setAlert('success', 'File uploaded successfully');
          setSizeValied('');
        } else {
          setAlert('error', 'Please upload valid file');
          setLoading(false);
        }
      } catch (e) {
        setFileUploadInProgress(false);
        setAlert('error', 'File upload failed');
        setLoading(false);
      }
    }
  };

  const handleScroll = (dir) => {
    if (dir === 'left') {
      attachmentsRef.current.scrollLeft -= 150;
    } else {
      attachmentsRef.current.scrollLeft += 150;
    }
  };

  const removeAttachment = (pageIndex, pdfIndex, deletePdf, item) => {
    // const extension = item.split('.').pop();

    if (item !== undefined) {
      if (deletePdf) {
        setAttachmentPreviews((prevState) => {
          prevState.splice(pdfIndex, 1);
          return [...prevState];
        });
        setAttachments((prevState) => {
          prevState.splice(pdfIndex, 1);
          return [...prevState];
        });
      } else {
        setAttachmentPreviews((prevState) => {
          let newObj = prevState[pdfIndex];
          delete newObj[pageIndex];
          prevState[pdfIndex] = newObj;
          return [...prevState];
        });
        setAttachments((prevState) => {
          let newObj = prevState[pdfIndex];
          delete newObj[pageIndex];
          prevState[pdfIndex] = newObj;
          return [...prevState];
        });
      }
    } else {
      setAttachmentPreviews((prevState) => {
        prevState.splice(pdfIndex, 1);
        return [...prevState];
      });
      setAttachments((prevState) => {
        prevState.splice(pdfIndex, 1);
        return [...prevState];
      });
    }
  };

  const handleHomeworkSubmit = () => {
    let attachmentData = [
      {
        homework_question: '',
        attachments: [],
        comments: '',
      },
    ];
    let requestData = {
      homework: resultdata?.id, //
      is_question_wise: false,
      questions: [{ attachments: attachments, attachmentData: attachmentData }],
      comment: '',
    };
    if (attachments.length !== 0) {
      if (HWstatus === 1) {
        axiosInstance
          .post(`${endpoints.homeworkStudent.submitHomework}`, requestData)
          .then((result) => {
            if (result.data.status_code === 201) {
              setAlert('success', result.data.message);
              //   handleHomeworkCancel();
              history.goBack();
            } else setAlert('error', result.data.message);
          })
          .catch((error) => {
            setAlert('error', error.message);
          });
      } else {
        axiosInstance
          .put(
            `${endpoints.homeworkStudent.hwupdate}${homeWorkId}/update-hw/`,
            requestData
          )
          .then((result) => {
            if (result.data.status_code === 200) {
              setAlert('success', result.data.message);
              history.goBack();
            } else setAlert('error', result.data.message);
          })
          .catch((error) => {
            setAlert('error', error.message);
          });
      }
    } else setAlert('error', 'No file attached!');
  };

  return (
    <Layout>
      {loading && <Loader />}
      <Grid
        container
        xs={12}
        sm={12}
        md={12}
        spacing={2}
        style={{ marginTop: '10px', width: '90%', marginLeft: '5%' }}
      >
        <Grid item xs={12} sm={12} md={12}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              margin: '5px 0px 0px 0px',
            }}
          >
            <ArrowBackIosIcon
              style={{ cursor: 'pointer', fontSize: 'medium' }}
              onClick={(e) => history.goBack()}
            />
            <b>View Home Work</b>
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <div>
            <div>
              <TextField
                // label='Subject'
                // style={{ background: 'white' }}
                type='text'
                fullWidth
                value={resultdata?.homework?.subject?.subject_slag || 'Subject'}
                disabled
                InputProps={{
                  endAdornment: (
                    <div style={{ width: '70px' }}>
                      {moment(resultdata?.homework?.class_date).format('Do MMM')}
                    </div>
                  ),
                }}
                //   onChange={(e) => { setError(false); setDescription(e.target.value) }}
                // multiline
                // rows={1}
                variant='outlined'
              />
              {/* {error && <p style={{ marginLeft: '5%', color: 'red' }}>Please fill the description to proceed.</p>} */}
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={12} spacing={0}>
          <div>
            <TextField
              label='Title'
              style={{ background: 'white' }}
              type='text'
              fullWidth
              value={hwName || 'Topic Name'}
              disabled
              multiline
              rows={1}
              variant='outlined'
            />
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={12} spacing={0}>
          <div>
            <div>
              <TextField
                label='Description'
                style={{ background: 'white' }}
                type='text'
                fullWidth
                disabled
                value={instruction || 'Description'}
                //   onChange={(e) => { setError(false); setDescription(e.target.value) }}
                multiline
                rows={2}
                variant='outlined'
              />
              {/* {error && <p style={{ marginLeft: '5%', color: 'red' }}>Please fill the description to proceed.</p>} */}
            </div>
          </div>
        </Grid>

        <Grid item xs={12} sm={12} md={12} spacing={0}>
          <div style={{ minHeight: '200px' }}>
            {subjectQuestions?.map((question, index) => (
              <>
                <div
                  className={`homework-question-container student-view ${calssNameWise}`}
                  key={`homework_student_question_${index}`}
                >
                  <div className={` ${classes.homeworkQuestion} ${calssNameWise}`}>
                    <span className='question'>
                      Q{index + 1}: {question.question}
                    </span>
                  </div>

                  {question.question_files?.length > 0 && (
                    <div className='attachments-container'>
                      {/* <Typography component='h4' color='primary' className='header'>
                        Attachments
                      </Typography> */}
                      <div className='attachments-list-outer-container'>
                        <div className='prev-btn'>
                          {question.question_files.length > 2 && (
                            <IconButton onClick={() => handleScroll(index, 'left')}>
                              <ArrowBackIosIcon />
                            </IconButton>
                          )}
                        </div>
                        <SimpleReactLightbox>
                          <div
                            className='attachments-list'
                            ref={scrollableContainer}
                            id={`homework_student_question_container_${index}`}
                            onScroll={(e) => {
                              e.preventDefault();
                            }}
                          >
                            {question.question_files.map((url, i) => {
                              if (typeof url == 'object') {
                                return Object.values(url).map((item, i) => {
                                  return (
                                    <div className='attachment'>
                                      <Attachment
                                        key={`homework_student_question_attachment_${i}`}
                                        fileUrl={item}
                                        fileName={`Attachment-${i + 1}`}
                                        urlPrefix={
                                          item.includes('lesson_plan_file')
                                            ? `${endpoints.discussionForum.s3}`
                                            : `${endpoints.discussionForum.s3}/homework`
                                        }
                                        index={i}
                                        onOpenInPenTool={(item) =>
                                          openInPenTool(item, index)
                                        }
                                        actions={[
                                          'preview',
                                          'download',
                                          question.is_pen_editor_enable && 'pentool',
                                        ]}
                                      />
                                    </div>
                                  );
                                });
                              } else
                                return (
                                  <div className='attachment'>
                                    <Attachment
                                      key={`homework_student_question_attachment_${i}`}
                                      fileUrl={url}
                                      fileName={`Attachment-${i + 1}`}
                                      urlPrefix={
                                        url.includes('lesson_plan_file')
                                          ? `${endpoints.discussionForum.s3}`
                                          : `${endpoints.discussionForum.s3}/homework`
                                      }
                                      index={i}
                                      onOpenInPenTool={(url) => openInPenTool(url, index)}
                                      actions={[
                                        'preview',
                                        'download',
                                        question.is_pen_editor_enable &&
                                          (homeworkdata?.status === 'un-opened' ||
                                            homeworkdata?.hw_status === '2') &&
                                          'pentool',
                                      ]}
                                    />
                                  </div>
                                );
                            })}
                            <div style={{ position: 'absolute', visibility: 'hidden' }}>
                              <SRLWrapper>
                                {question.question_files.map((url, i) => {
                                  if (typeof url == 'object') {
                                    return Object.values(url).map((item, i) => {
                                      return (
                                        <img
                                          src={`${endpoints.discussionForum.s3}/homework/${item}`}
                                          onError={(e) => {
                                            e.target.src = placeholder;
                                          }}
                                          alt={`Attachment-${i + 1}`}
                                          style={{ width: '0', height: '0' }}
                                        />
                                      );
                                    });
                                  } else
                                    return (
                                      <img
                                        src={`${endpoints.discussionForum.s3}/homework/${url}`}
                                        onError={(e) => {
                                          e.target.src = placeholder;
                                        }}
                                        alt={`Attachment-${i + 1}`}
                                        style={{ width: '0', height: '0' }}
                                      />
                                    );
                                })}
                              </SRLWrapper>
                            </div>
                          </div>
                        </SimpleReactLightbox>
                        <div className='next-btn'>
                          {question.question_files.length > 2 && (
                            <IconButton onClick={() => handleScroll(index, 'right')}>
                              <ArrowForwardIosIcon color='primary' />
                            </IconButton>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ))}
          </div>
        </Grid>
        {penToolOpen && (
          <DescriptiveTestcorrectionModule
            desTestDetails={desTestDetails}
            mediaContent={mediaContent}
            handleClose={handleCloseCorrectionModal}
            alert={undefined}
            open={penToolOpen}
            callBackOnPageChange={() => {}}
            handleSaveFile={handleSaveEvaluatedFile}
          />
        )}

        {/* Preview of Bulk upload */}
        {attachmentPreviews?.length > 0 && (
          <Grid
            item
            xs={12}
            className='attachments-grid'
            style={{ overflow: 'hidden', position: 'relative' }}
          >
            <Typography component='h4' color='primary' className='header'>
              Attachments
            </Typography>
            <div className='attachments-list-outer-container'>
              <div className='prev-btn'>
                {attachmentPreviews?.length > 1 && (
                  <IconButton onClick={() => handleScroll('left')}>
                    <ArrowBackIosIcon />
                  </IconButton>
                )}
              </div>
              <SimpleReactLightbox>
                <div
                  className='attachments-list'
                  ref={attachmentsRef}
                  onScroll={(e) => {
                    e.preventDefault();
                  }}
                >
                  {attachmentPreviews?.map((url, pdfindex) => {
                    let cindex = 0;
                    attachmentPreviews.forEach((item, index) => {
                      if (index < pdfindex) {
                        if (typeof item == 'string') {
                          cindex = cindex + 1;
                        } else {
                          cindex = Object.keys(item).length + cindex;
                        }
                      }
                    });
                    if (typeof url == 'object') {
                      return Object.values(url).map((item, i) => {
                        let imageIndex = Object.keys(url)[i];
                        return (
                          <div className='attachment'>
                            <Attachment
                              key={`homework_student_question_attachment_${i}`}
                              fileUrl={item}
                              fileName={`${i + 1 + cindex}`}
                              urlPrefix={`${endpoints.discussionForum.s3}/homework`}
                              index={i}
                              actions={['preview', 'download', 'delete']}
                              onDelete={(index, deletePdf) =>
                                removeAttachment(imageIndex, pdfindex, deletePdf, {
                                  item,
                                })
                              }
                              ispdf={true}
                            />
                          </div>
                        );
                      });
                    } else
                      return (
                        <div className='attachment'>
                          <Attachment
                            key={`homework_student_question_attachment_${pdfindex}`}
                            fileUrl={url}
                            fileName={`${1 + cindex}`}
                            urlPrefix={
                              url.includes('lesson_plan_file')
                                ? `${endpoints.discussionForum.s3}`
                                : `${endpoints.discussionForum.s3}/homework`
                            }
                            index={pdfindex}
                            actions={['preview', 'download', 'delete']}
                            onDelete={(index, deletePdf) =>
                              removeAttachment(index, pdfindex, deletePdf)
                            }
                            ispdf={false}
                          />
                        </div>
                      );
                  })}

                  <div style={{ position: 'absolute', visibility: 'hidden' }}>
                    <SRLWrapper>
                      {attachmentPreviews?.map((url, i) => {
                        if (typeof url == 'object') {
                          return Object.values(url).map((item, i) => {
                            return (
                              <img
                                src={`${endpoints.discussionForum.s3}/homework/${item}`}
                                onError={(e) => {
                                  e.target.src = placeholder;
                                }}
                                alt={`Attachment-${i + 1}`}
                              />
                            );
                          });
                        } else
                          return (
                            <img
                              src={`${endpoints.discussionForum.s3}/homework/${url}`}
                              onError={(e) => {
                                e.target.src = placeholder;
                              }}
                              alt={`Attachment-${i + 1}`}
                            />
                          );
                      })}
                    </SRLWrapper>
                  </div>
                </div>
              </SimpleReactLightbox>
              <div className='next-btn'>
                {attachmentPreviews?.length > 1 && (
                  <IconButton onClick={() => handleScroll('right')}>
                    <ArrowForwardIosIcon color='primary' />
                  </IconButton>
                )}
              </div>
            </div>
          </Grid>
        )}

        {EvaluatedFiles?.length > 0 && (
          <Grid
            item
            xs={12}
            className='attachments-grid'
            style={{ overflow: 'hidden', position: 'relative' }}
          >
            <Typography component='h4' color='primary' className='header'>
              Evaluated Files
            </Typography>
            <div className='attachments-list-outer-container'>
              <div className='prev-btn'>
                {EvaluatedFiles?.length > 1 && (
                  <IconButton onClick={() => handleScroll('left')}>
                    <ArrowBackIosIcon />
                  </IconButton>
                )}
              </div>
              <SimpleReactLightbox>
                <div
                  className='attachments-list'
                  ref={attachmentsRef}
                  onScroll={(e) => {
                    e.preventDefault();
                  }}
                >
                  {EvaluatedFiles?.map((url, pdfindex) => {
                    let cindex = 0;
                    EvaluatedFiles.forEach((item, index) => {
                      if (index < pdfindex) {
                        if (typeof item == 'string') {
                          cindex = cindex + 1;
                        } else {
                          cindex = Object.keys(item).length + cindex;
                        }
                      }
                    });
                    if (typeof url == 'object') {
                      return Object.values(url).map((item, i) => {
                        let imageIndex = Object.keys(url)[i];
                        return (
                          <div className={classes.evaluatedAttachment}>
                            <Attachment
                              key={`homework_student_question_attachment_${i}`}
                              fileUrl={item}
                              fileName={`${i + 1 + cindex}`}
                              urlPrefix={
                                item.includes('lesson_plan_file')
                                  ? `${endpoints.discussionForum.s3}`
                                  : `${endpoints.discussionForum.s3}/homework`
                              }
                              index={i}
                              actions={['preview', 'download']}
                              // onDelete={(index, deletePdf) =>
                              //   removeAttachment(imageIndex, pdfindex, deletePdf, {
                              //     item,
                              //   })
                              // }
                              ispdf={true}
                            />
                          </div>
                        );
                      });
                    } else
                      return (
                        <div className={classes.evaluatedAttachment}>
                          <Attachment
                            key={`homework_student_question_attachment_${pdfindex}`}
                            fileUrl={url}
                            fileName={`${1 + cindex}`}
                            urlPrefix={
                              url.includes('lesson_plan_file')
                                ? `${endpoints.discussionForum.s3}`
                                : `${endpoints.discussionForum.s3}/homework`
                            }
                            index={pdfindex}
                            actions={['preview', 'download']}
                            // onDelete={(index, deletePdf) =>
                            //   removeAttachment(index, pdfindex, deletePdf)
                            // }
                            ispdf={false}
                          />
                        </div>
                      );
                  })}

                  <div style={{ position: 'absolute', visibility: 'hidden' }}>
                    <SRLWrapper>
                      {EvaluatedFiles?.map((url, i) => {
                        if (typeof url == 'object') {
                          return Object.values(url).map((item, i) => {
                            return (
                              <img
                                src={`${endpoints.discussionForum.s3}/homework/${item}`}
                                onError={(e) => {
                                  e.target.src = placeholder;
                                }}
                                alt={`Attachment-${i + 1}`}
                              />
                            );
                          });
                        } else
                          return (
                            <img
                              src={`${endpoints.discussionForum.s3}/homework/${url}`}
                              onError={(e) => {
                                e.target.src = placeholder;
                              }}
                              alt={`Attachment-${i + 1}`}
                            />
                          );
                      })}
                    </SRLWrapper>
                  </div>
                </div>
              </SimpleReactLightbox>
              <div className='next-btn'>
                {EvaluatedFiles?.length > 1 && (
                  <IconButton onClick={() => handleScroll('right')}>
                    <ArrowForwardIosIcon color='primary' />
                  </IconButton>
                )}
              </div>
            </div>
          </Grid>
        )}

        {homeworkdata?.hw_status === '3' ? (
          <>
            {overallScore && (
              <div className='scoreBox'>Overall Score : {overallScore}</div>
            )}
            {overallRemark && (
              <div className='remarkBox'>Overall Remark : {overallRemark}</div>
            )}
          </>
        ) : null}

        {homeworkdata?.hw_status !== '3' && (
          <Grid item xs={12} sm={12} md={12} spacing={0}>
            <Paper elevation={5} style={{ padding: '10px' }}>
              <Button
                variant='contained'
                color='primary'
                onClick={() => fileUploadInput.current.click()}
                title='Attach files'
                startIcon={<AttachFileIcon style={{ color: 'black' }} />}
              >
                <span>
                  <b style={{ color: 'black' }}>Upload</b>
                </span>{' '}
                <span style={{ fontSize: '11px', marginLeft: '5px' }}>
                  {' '}
                  Accepted files: jpeg,mp3,mp4,pdf,png
                </span>
              </Button>
              <Button
                variant='contained'
                color='primary'
                style={{ marginLeft: '57%' }}
                onClick={handleHomeworkSubmit}
              >
                Submit Homework
              </Button>
            </Paper>
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={12}>
          <input
            className='file-upload-input'
            type='file'
            name='attachments'
            style={{ display: 'none' }}
            accept='.png, .jpg, .jpeg, .mp3, .mp4, .pdf, .PNG, .JPG, .JPEG, .MP3, .MP4, .PDF'
            onChange={(e) => {
              handleFileUpload(e.target.files[0]);
              e.target.value = null;
              // onChange('attachments', Array.from(e.target.files)[]);
            }}
            ref={fileUploadInput}
          />
        </Grid>
      </Grid>
    </Layout>
  );
});
export default StudentSubmitHW;
