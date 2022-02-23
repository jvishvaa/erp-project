import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import './academicStyles.scss';
import { IconButton, Button, SvgIcon } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Attachment as AttachmentIcon } from '@material-ui/icons';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import axiosInstance from 'config/axios';
import { AttachmentPreviewerContext } from './../../../components/attachment-previewer/attachment-previewer-contexts/attachment-previewer-contexts';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../.././context-api/alert-context/alert-state';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    marginTop: '1%',
    minHeight: '400px',
  },
  tab: {
    width: '730px',
  },
  attachmentIconhover: {
    color: 'black',
    '&:hover': {
      backgroundColor: '#fff!important',
    },
  },
}));

const LessonPlanTabs = ({
  data,
  setPeriodUI,
  periodId,
  TopicId,
  isAccordian,
  checkid,
  assignedTopic,
  upcomingTopicId,
}) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [filesData, setFilesData] = React.useState([]);
  const [uploadedData, setUploadedData] = React.useState([]);
  const [addbtnStatus, setAddbtnStatus] = React.useState(false);
  const { setAlert } = useContext(AlertNotificationContext);

  const { openPreview, closePreview } =
    React.useContext(AttachmentPreviewerContext) || {};

  const addbtnState = () => {
    setAddbtnStatus((prev) => !prev);
  };

  const [fileId, setFileId] = useState(-1);

  const TopicContentView = (topicId) => {
    axiosInstance
      .get(`${endpoints.lessonPlanTabs.topicData}?topic_id=${topicId}`)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          const FilesData = result.data?.result;
          setFilesData(FilesData);
          FilesData.filter((tabs) => {
            if (tabs.document_type === 'my_files') {
              setFileId(tabs.id);
            }
          });
        } else {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
  };

  const previousUploadedFiles = (tempFileId) => {
    if (tempFileId !== null) {
      axiosInstance
        .get(
          `${endpoints.lessonPlanTabs.previousData.replace('<tempfile-id>', tempFileId)}`
        )
        .then((result) => {
          if (result?.data?.status_code === 200) {
            const UploadData = result.data?.result?.my_files;
            setUploadedData(UploadData);
          } else {
            setAlert('error', result?.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error?.message);
        });
    }
  };

  useEffect(() => {
    if (fileId !== -1) {
      previousUploadedFiles(fileId);
    }
  }, [fileId]);

  useEffect(() => {
    if (TopicId && isAccordian) {
      // periodId = props?.TopicId
      TopicContentView(TopicId);
    } else TopicContentView(upcomingTopicId);
  }, [isAccordian, TopicId]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [markCompleted, isMarkCompleted] = useState(false);
  const [selectedFiles3, setSelectedFile3] = React.useState(null);

  const uploadFileHandler3 = (e) => {
    setSelectedFile3(e.target.files[0]);
  };

  const handleComplete = () => {
    isMarkCompleted(true);
  };
  const handleTopicCompleted = () => {
    axiosInstance
      .put(`/period/${assignedTopic}/assign-topic-period/`, {
        status: 2,
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setAlert('success', result?.data?.message);
          window.location.reload();
        } else if (result?.data?.status_code === 404) {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((err) => {
        setAlert('error', err?.message);
      });
  };
  const handlePartiallyCompleted = () => {
    axiosInstance
      .put(`/period/${assignedTopic}/assign-topic-period/`, {
        status: 1,
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setAlert('success', result?.data?.message);
          window.location.reload();
        } else if (result?.data?.status_code === 404) {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((err) => {
        setAlert('error', err?.message);
      });
  };
  const handleAddTopic = () => {
    setPeriodUI('addTopic');
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', selectedFiles3);
    const exten = '.' + selectedFiles3?.name.split('.')[selectedFiles3?.name.split('.').length - 1];
    axiosInstance
      .post(`${endpoints.lessonPlanTabs.postData}`, formData)
      .then((res) => {
        if (res?.data?.data) {
          let uploadedFiles = res?.data?.data;
          if (!uploadedData.length) {
            axiosInstance
              .post(`${endpoints.lessonPlanTabs.postData2}`, {
                topic_id: upcomingTopicId,
                my_files: [res?.data?.data],
              })
              .then((response) => {
                setFileId(response?.data?.result?.id);
              })
              .catch((err) => {
                // console.log('File Upload Error');
              });
          } else {
            let my_file;
            if (exten === '.pdf') {
              my_file = [...uploadedData, ...uploadedFiles];
            } else {
              my_file = [...uploadedData, uploadedFiles]
            }
            axiosInstance
              .put(`${endpoints.lessonPlanTabs.getData2.replace('<file-id>', fileId)}`, {
                my_files: my_file,
              })
              .then((response) => {
                previousUploadedFiles(fileId);
              })
              .catch((err) => {
                // console.log('File Upload Error');
              });
          }
        }
      })
      .catch((err) => console.log('File Upload Error'));
  };

  return (
    <div className={classes.root} style={{ minHeight: isAccordian ? '300px' : '300px', width: '800px' }}>
      <AppBar position='static'>
        <Tabs
          value={value}
          onChange={handleChange}
          size='small'
          variant="scrollable"
          scrollButtons="auto"
          aria-label='simple tabs example'
          style={{ backgroundColor: 'white' }}
        >
          {filesData.map((tabs, i) => {
            if (tabs?.document_type) {
              return <Tab
                label={tabs.document_type}
                key={tabs.document_type}
                {...a11yProps(i)}
                size='small'
                style={{ minWidth: 54, fontSize: '15px' }}
              />
            }
          })}
          {filesData.length === 0 &&
            <>
              <Tab
                label='Question Paper'
                {...a11yProps('0')}
                size='small'
                style={{ minWidth: 54, fontSize: '15px' }}
              />
              <Tab
                label='My Files'
                {...a11yProps('1')}
                size='small'
                style={{ minWidth: 54, fontSize: '15px' }}
              />
            </>}
        </Tabs>
      </AppBar>
      {filesData.filter((tempData) => tempData.document_type).map((tabs, i) => {
        if (tabs?.document_type) {
          if (tabs.document_type !== 'my_files') {
            console.log("DEBUG the value of rest tabs is: ", i)
            return <TabPanel value={value} index={i} className={classes.tab}>
              <div>
                <div
                  style={{
                    display: 'flex',
                    height: '80%',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flexDirection: 'column',
                  }}
                >
                  {tabs?.media_file?.map((data) => {
                    const name = data.split('/')[data.split('/').length - 1];
                    const fileNewName = name.split('.')[name.split('.').length - 2];
                    const exten = '.' + name.split('.')[name.split('.').length - 1];
                    const newFileName = name + '.' + exten;
                    return (
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <InsertDriveFileIcon style={{ height: 60, width: 60 }} />
                        <p className='fileName' title={name || ''}>{fileNewName}</p>
                        <p className='fileNameext' title={name || ''}>{exten}</p>
                        <SvgIcon
                          component={() => (
                            <VisibilityIcon
                              onClick={() => {
                                const fileSrc = `${endpoints.lessonPlan.s3}${data}`;
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
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className='attachment-material'>
                <IconButton
                  fontSize='small'
                  id='file-icon'
                  disableRipple
                  component='label'
                ></IconButton>
              </div>
            </TabPanel>
          } else {
            return <TabPanel value={value} index={i} className={classes.tab}>
              <div style={{ height: '200' }}>
                {uploadedData?.map((data) => {
                  {
                    /* <div style={{ display: 'flex', height: 50 }}> */
                  }
                  const name = data.split('/')[data.split('/').length - 1];
                  const fileNewName = name.split('.')[name.split('.').length - 2];
                  const exten = '.' + name.split('.')[name.split('.').length - 1];
                  const newFileName = name + '.' + exten;
                  return (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <InsertDriveFileIcon style={{ height: 60, width: 60 }} />
                      <p className='fileName' title={name || ''}>{fileNewName}</p>
                      <p className='fileNameext' title={name || ''}>{exten}</p>
                      <SvgIcon
                        component={() => (
                          <VisibilityIcon
                            onClick={() => {
                              const fileSrc = `${endpoints.lessonPlan.s3erp}homework/${data}`;
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
                      {/* <a style={{ paddingTop: '6px' }} href={`https://d3ka3pry54wyko.cloudfront.net/${data}`}>{data.split('/')[data.split('/').length - 1]}</a> */}
                      {/* {uploadedata} */}
                      {/* </div> */}
                    </div>
                  );
                })}
              </div>
              {data?.status !== 2 && (
                <div className='attachment-material'>
                  <IconButton
                    fontSize='small'
                    id='file-icon'
                    disableRipple
                    component='label'
                    className={classes.attachmentIconhover}
                  >
                    <AttachmentIcon fontSize='small' />
                    <input
                      type='file'
                      accept='.png, .jpg, .jpeg, .mp3, .mp4, .pdf, .PNG, .JPG, .JPEG, .MP3, .MP4, .PDF'
                      onChange={(e) => {
                        uploadFileHandler3(e);
                      }}
                    // className={classes.fileInput}
                    />
                  </IconButton>
                  <Button
                    variant='contained'
                    color='secondary'
                    // className={classes.button}
                    startIcon={<AddCircleOutlineRoundedIcon />}
                    onClick={handleUpload}
                  >
                    Upload
                  </Button>
                </div>
              )}
            </TabPanel>
          }
        }
      })}
      {filesData.length === 0 && <TabPanel value={value} index={1} className={classes.tab}>
        <div style={{ height: '200' }}>
          {uploadedData?.map((data) => {
            {
              /* <div style={{ display: 'flex', height: 50 }}> */
            }
            const name = data.split('/')[data.split('/').length - 1];
            const fileNewName = name.split('.')[name.split('.').length - 2];
            const exten = '.' + name.split('.')[name.split('.').length - 1];
            const newFileName = name + '.' + exten;
            return (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <InsertDriveFileIcon style={{ height: 60, width: 60 }} />
                <p className='fileName' title={name || ''}>{fileNewName}</p>
                <p className='fileNameext' title={name || ''}>{exten}</p>
                <SvgIcon
                  component={() => (
                    <VisibilityIcon
                      onClick={() => {
                        const fileSrc = `${endpoints.lessonPlan.s3erp}homework/${data}`;
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
                {/* <a style={{ paddingTop: '6px' }} href={`https://d3ka3pry54wyko.cloudfront.net/${data}`}>{data.split('/')[data.split('/').length - 1]}</a> */}
                {/* {uploadedata} */}
                {/* </div> */}
              </div>
            );
          })}
        </div>
        {data?.status !== 2 && (
          <div className='attachment-material'>
            <IconButton
              fontSize='small'
              id='file-icon'
              disableRipple
              component='label'
              className={classes.attachmentIconhover}
            >
              <AttachmentIcon fontSize='small' />
              <input
                type='file'
                accept='.png, .jpg, .jpeg, .mp3, .mp4, .pdf, .PNG, .JPG, .JPEG, .MP3, .MP4, .PDF'
                onChange={(e) => {
                  uploadFileHandler3(e);
                }}
              // className={classes.fileInput}
              />
            </IconButton>
            <Button
              variant='contained'
              color='secondary'
              // className={classes.button}
              startIcon={<AddCircleOutlineRoundedIcon />}
              onClick={handleUpload}
            >
              Upload
            </Button>
          </div>
        )}
      </TabPanel>}
      <div>
        {markCompleted ? (
          <>
            <div
              className='addTopic'
              style={{ padding: '5px', marginTop: '25%', background: '#d5d2d2' }}
            >
              <Button
                variant='contained'
                size='small'
                onClick={(event) => {
                  handleTopicCompleted();
                  addbtnState();
                }}
                style={{
                  color: 'black',
                  backgroundColor: '#4a90e2',
                  marginRight: '16px',
                  color: 'white',
                }}
              >
                {' '}
                Topic Completed
              </Button>
              <Button
                variant='contained'
                size='small'
                onClick={handlePartiallyCompleted}
                style={{
                  color: 'black',
                  backgroundColor: '#4a90e2',
                  color: 'white',
                }}
              >
                {' '}
                Partially Completed{' '}
              </Button>
              {addbtnStatus && checkid === 'default' && (
                <Button
                  variant='contained'
                  color='secondary'
                  // className={classes.button}
                  style={{ marginLeft: '650px', backgroundColor: '#4a90e2' }}
                  startIcon={<AddCircleOutlineRoundedIcon />}
                  onClick={handleAddTopic}
                >
                  Add Topic
                </Button>
              )}
            </div>
          </>
        ) : (
          data?.status !== 2 && (
            <div style={{ padding: '5px', marginTop: '25%', background: '#d5d2d2' }}>
              <Button size='small' onClick={handleComplete} style={{ marginLeft: '43%' }} variant='contained'>
                {' '}
                Mark Completed{' '}
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default LessonPlanTabs;

