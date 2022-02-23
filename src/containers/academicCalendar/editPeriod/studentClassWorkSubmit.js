import React, { useEffect, useState, useRef, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useLightbox } from 'simple-react-lightbox';
import Grid from '@material-ui/core/Grid';
import Layout from 'containers/Layout';
import deleteIcon from '../../../assets/images/delete.svg';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Button } from '@material-ui/core';
import { SvgIcon } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import axiosInstance from 'config/axios';
import apiRequest from '../../../config/apiRequest';
import endpoints from 'config/endpoints';
import { withRouter } from 'react-router-dom';
import attachmenticon from '../../../assets/images/attachmenticon.svg';
import { AlertNotificationContext } from '../../.././context-api/alert-context/alert-state';
import { AttachmentPreviewerContext } from './../../../components/attachment-previewer/attachment-previewer-contexts/attachment-previewer-contexts';
import CloseIcon from '@material-ui/icons/Close';
import Loader from '../../../components/loader/loader';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    height: '50px',
  },
  bottom: {
    position: 'absolute',
    bottom: '0',
    left: '0',
  },
}));

const StudentCwSubmit = withRouter(({ history, ...props }) => {
  const { classWorkId, online_class_id, class_date ,submitted} = props?.location?.state;
  const classes = useStyles();
  const [studentClasswork, setStudentClassWork] = useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const { openLightbox } = useLightbox();
  const [filePath, setFilePath] = useState([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const attachmentsRef = useRef(null);
  const [image, setImage] = useState('');
  const [details, setDetail] = useState('');
  const [title, setTitle] = useState('');
  const { openPreview, closePreview } = useContext(AttachmentPreviewerContext) || {};

  const handleStudentClassworkData = () => {
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.period.confirmAttendance}${classWorkId}/get-update-period-classwork/`
      )
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setStudentClassWork(result?.data?.result);
          setImage(result?.data?.result?.classwork_files[0]);
          setAlert('success', result?.data?.message);
          setLoading(false);
        } else {
          setAlert('error', result?.data?.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
        setLoading(false);
      });
  };

  const FileRow = (props) => {
    const { file, onClose, index } = props;
    setFiles(file);
    return (
      <>
        <div className='file_row_image'>
          <div className='file_name_container'>{index + 1}</div>
          <div className='file_closeCircular'>
            <div style={{ display: 'flex' }}>
              <span>
                <VisibilityIcon
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginRight: 10,
                    marginLeft: 10,
                  }}
                  onClick={() => {
                    const fileSrc = `${endpoints.discussionForum.s3}/${file}`;
                    openPreview({
                      currentAttachmentIndex: 0,
                      attachmentsArray: [
                        {
                          src: fileSrc,
                          name: file.split('.')[file.split('.').length - 2],
                          extension: '.' + file.split('.')[file.split('.').length - 1],
                        },
                      ],
                    });
                  }}
                />
              </span>

              <span onClick={onClose}>
                <SvgIcon
                  component={() => (
                    <img
                      style={{
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        marginRight: '15px',
                      }}
                      src={deleteIcon}
                      alt='given'
                    />
                  )}
                />
              </span>
            </div>
          </div>
        </div>
      </>
    );
  };

  const handleImageChange = (event) => {
    let fileType = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    let selectedFileType = event.target.files[0]?.type;
    if (!fileType.includes(selectedFileType)) {
      setAlert('error', 'File Type not supported');
      event.target.value = '';
      return;
    }
    const fileSize = event.target.files[0]?.size;
    if (!validateFileSize(fileSize)) {
      setAlert('error', 'File size must be less than 25MB');
      event.target.value = '';
      return;
    }

    const data = event.target.files[0];
    const fd = new FormData();
    fd.append('file', data);
    setLoading(true);
    axiosInstance.post(`academic/dairy-upload/`, fd).then((result) => {
      if (result?.data?.status_code === 200) {
        setLoading(false);
        setFilePath([...filePath, result?.data?.result]);
        setAlert('success', result?.data?.message);
      } else {
        setLoading(false);
        setAlert('error', result?.data?.message);
      }
    });
  };

  const removeFileHandler = (i, file) => {
    setLoading(true);
    const list = [...filePath];
    axiosInstance
      .post(`${endpoints.circular.deleteFile}`, {
        file_name: `${file}`,
      })
      .then((result) => {
        if (result?.data?.status_code === 204) {
          list.splice(i, 1);
          setFilePath(list);
          setLoading(false);
          setAlert('success', result?.data?.message);
        } else {
          setAlert('error', result?.data?.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      })
      .finally(() => setLoading(false));
  };
  const validateFileSize = (size) => {
    return size / 1024 / 1024 > 25 ? false : true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    let payload = {
      online_class_id: online_class_id, //To do import online class id as prop
    };
    if (filePath?.length) {
      payload['submitted_files'] = filePath;
    }
    try {
      const result = await apiRequest('post', '/oncls/v1/submit-classwork/', payload)
      if (result?.data?.status_code === 200) {
        setTitle('');
        setFilePath([]);
        setDetail('');
        setLoading(false);
        setAlert('success', result?.data?.message);
        handleback();
      } else {
        setAlert('error', 'Something Went Wrong');
        setLoading(false);
      }
    } catch (error) {
      setAlert('error', error.message);
      setLoading(false);
    }
  };

  const handleback = () => {
    history.goBack();
  };

  useEffect(() => {
    handleStudentClassworkData();
    if (online_class_id && class_date) {
      apiRequest('get', `/oncls/v1/oncls-classwork/?online_class_id=${online_class_id}&date=${class_date}`)
        .then((response) => {
          if (response.data.status_code === 200) {
            setFilePath(response?.data.data);
          } else {
            // console.log('t')
          }
        })
        .catch((e) => {
          setAlert('error', e.message);
        });
    }
  }, []);

  return (
    <div className={classes.root}>
      {loading && <Loader />}
      <Layout>
        <Grid container xs={12} alignItems='center' justifyContent='center' spacing={3}>
          <Grid item xs={12}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <ArrowBackIosIcon
                  style={{
                    marginLeft: '20px',
                    marginTop: '11px',
                    fontSize: '20px',
                    float: 'left',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                  onClick={handleback}
                />
                <h3 style={{ float: 'left', textAlign: 'left', marginTop: '10px' }}>
                  {' '}
                  Class Work{' '}
                </h3>
              </div>
              <CloseIcon onClick={handleback} style={{ cursor: 'pointer', marginTop: '9px' }} />
            </div>
          </Grid>
          <Grid item xs={11}>
            <p>Description</p>
          </Grid>
          <Grid item xs={11}>
            <Paper className={classes.paper} style={{ height: '70px' }}>
              <p>{studentClasswork?.discription}</p>
            </Paper>
          </Grid>
          <Grid item xs={11} sm={11} style={{ height: '300px', overflowX: 'hidden' }}>
            {studentClasswork?.classwork_files?.map((value, index) => {
              const name = value.split('/')[value.split('/').length - 1];
              return (
                <Paper className={classes.paper} style={{ margin: '5px' }}>
                  <PictureAsPdfIcon style={{ float: 'left', textAlign: 'left' }} />
                  <p
                    style={{
                      float: 'left',
                      width: '80%',
                      textAlign: 'left',
                      marginLeft: '20px',
                    }}
                  >
                    {value.split('/')[value.split('/').length - 1]}
                  </p>
                  <SvgIcon
                    component={() => (
                      <VisibilityIcon
                        style={{ float: 'right', width: '4%' }}
                        onClick={() => {
                          const fileSrc = `${endpoints.lessonPlan.s3}${value}`;
                          openPreview({
                            currentAttachmentIndex: 0,
                            attachmentsArray: [
                              {
                                src: fileSrc,
                                name: name.split('.')[name.split('.').length - 2],
                                extension:
                                  '.' + name.split('.')[name.split('.').length - 1],
                              },
                            ],
                          });
                        }}
                        color='primary'
                      />
                    )}
                  />
                </Paper>
              );
            })}
          </Grid>
          <Grid
            item
            xs={11}
            sm={11}
            style={{
              position: 'absolute',
              bottom: '10px',
              width: '90%',
              justifyContent: 'center',
            }}
          >
            <Paper
              className={classes.paper}
              style={{ height: '70px', display: 'flex', justifyContent: 'space-between' }}
            >
              <Button
                variant='contained'
                color='secondary'
                title='Attach Supporting File'
                size='medium'
                disableRipple
                disableElevation
                disableFocusRipple
                disableTouchRipple
                component='label'
              >
                <input
                  type='file'
                  style={{ display: 'none' }}
                  id='raised-button-file'
                  accept='image/*, .pdf'
                  onChange={handleImageChange}
                />
                <AttachFileIcon style={{ color: 'black' }} />
                <p style={{ color: 'black' }}>Upload Answers</p>
                <p style={{ fontSize: '10px', marginLeft: '5px' }}>
                  Accepted file formate : .jpg, .png, .pdf
                </p>
              </Button>

              <div style={{ width: '40%' }}>
                <div style={{ display: 'flex' }}>
                  {filePath?.length > 0 &&
                    filePath?.map((file, i) => (
                      <div style={{ display: 'flex', justifyContent: 'row' }}>
                        <FileRow
                          key={`homework_student_question_attachment_${i}`}
                          file={file}
                          index={i}
                          onClose={() => removeFileHandler(i, file)}
                        />
                      </div>
                    ))}
                </div>
              </div>
              {class_date ? (
                <></>
              ) : (
                <Button variant='contained' color='secondary' onClick={handleSubmit}>
                  Submit Class Work
                </Button>
              )}
              {submitted && <Button variant='contained' color='secondary' onClick={handleSubmit}>
                  Update Class Work
                </Button>}
            </Paper>
          </Grid>
        </Grid>
      </Layout>
    </div>
  );
});

export default StudentCwSubmit;
