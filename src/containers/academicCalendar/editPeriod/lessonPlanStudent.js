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
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import axiosInstance from 'config/axios';
import { AttachmentPreviewerContext } from './../../../components/attachment-previewer/attachment-previewer-contexts/attachment-previewer-contexts';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../.././context-api/alert-context/alert-state';
import Loader from '../../../components/loader/loader';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

const LessonPlanTabsStudent = ({ upcomingTopicId }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [filesData, setFilesData] = React.useState(null);
  const [uploadedData, setUploadedData] = React.useState([]);
  const [addbtnStatus, setAddbtnStatus] = React.useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);

  const { openPreview, closePreview } =
    React.useContext(AttachmentPreviewerContext) || {};

  const addbtnState = () => {
    setAddbtnStatus((prev) => !prev);
  };

  const [fileId, setFileId] = useState(-1);



  let ids = [];
  if (upcomingTopicId){
  upcomingTopicId.forEach((topic) => {
    ids.push(topic?.topic_id)
  });
}

  const concaticatedIds = ids.join(',');


  const TopicContentView = (concaticatedIds) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.lessonPlanTabs.topicData}?topic_id=${concaticatedIds}`)
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
        setLoading(false);
      })     
      .catch((error) => {
        setAlert('error', error?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (concaticatedIds) {
      TopicContentView(concaticatedIds);
    }
  }, [concaticatedIds]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedFiles3, setSelectedFile3] = React.useState(null);

  return (
    <div className={classes.root} style={{ minHeight: '300px' }}>
    {loading && <Loader />} 
      <AppBar position='static'>
        <Tabs
          value={value}
          onChange={handleChange}
          size='small'
          aria-label='simple tabs example'
          style={{ backgroundColor: 'white' }}
        >
          <Tab
            label='Teacher Material'
            {...a11yProps(0)}
            size='small'
            style={{ minWidth: 54, fontSize: '15px' }}
          />
          <Tab
            label='PPT'
            {...a11yProps(1)}
            size='small'
            style={{ minWidth: 54, fontSize: '15px' }}
          />
          <Tab
            label='Videos'
            {...a11yProps(2)}
            size='small'
            style={{ minWidth: 54, fontSize: '15px' }}
          />
          <Tab
            label='Audio'
            {...a11yProps(3)}
            size='small'
            style={{ minWidth: 54, fontSize: '15px' }}
          />
          <Tab
            label='Activity Sheet'
            {...a11yProps(4)}
            size='small'
            style={{ minWidth: 54, fontSize: '15px' }}
          />
          <Tab
            label='Question Paper'
            {...a11yProps(5)}
            size='small'
            style={{ minWidth: 54, fontSize: '15px' }}
          />
          <Tab
            label='Teachers_File'
            {...a11yProps(6)}
            size='small'
            style={{ minWidth: 54, fontSize: '15px' }}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} className={classes.tab}>
        <div>
          {filesData
            ?.filter((file) => file.document_type === 'Teacher_Reading_Material')
            .map((file) => (
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
                {file.media_file.map((data) => {
                  const name = data.split('/')[data.split('/').length - 1];
                  return (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <InsertDriveFileIcon style={{ height: 60, width: 60 }} />
                      <p style={{ marginRight: 30 }}>{name}</p>
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
            ))}
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
      <TabPanel value={value} index={1} className={classes.tab}>
        <div>
          {filesData
            ?.filter((file) => file.document_type === 'PPT')
            .map((file) => (
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
                {file.media_file.map((data) => {
                  const name = data.split('/')[data.split('/').length - 1];
                  return (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <InsertDriveFileIcon style={{ height: 60, width: 60 }} />
                      <p style={{ marginRight: 30 }}>{name}</p>
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
            ))}
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
      <TabPanel value={value} index={2} className={classes.tab}>
        <div>
          {filesData
            ?.filter((file) => file.document_type === 'Video')
            .map((file) => (
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
                {file.media_file.map((data) => {
                  const name = data.split('/')[data.split('/').length - 1];
                  return (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <InsertDriveFileIcon style={{ height: 60, width: 60 }} />
                      <p style={{ marginRight: 30 }}>{name}</p>
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
            ))}
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
      <TabPanel value={value} index={3} className={classes.tab}>
        <div>
          {filesData
            ?.filter((file) => file.document_type === 'Audio')
            .map((file) => (
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
                {file.media_file.map((data) => {
                  const name = data.split('/')[data.split('/').length - 1];
                  return (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <InsertDriveFileIcon style={{ height: 60, width: 60 }} />
                      <p style={{ marginRight: 30 }}>{name}</p>
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
            ))}
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
      <TabPanel value={value} index={4} className={classes.tab}>
        <div>
          {filesData
            ?.filter((file) => file.document_type === 'Activity_Sheet')
            .map((file) => (
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
                {file.media_file.map((data) => {
                  const name = data.split('/')[data.split('/').length - 1];
                  return (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <InsertDriveFileIcon style={{ height: 60, width: 60 }} />
                      <p style={{ marginRight: 30 }}>{name}</p>
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
            ))}
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
      <TabPanel value={value} index={5} className={classes.tab}>
        <div>
          {filesData
            ?.filter((file) => file.document_type === 'Question_Paper')
            .map((file) => (
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
                {file.media_file.map((data) => {
                  const name = data.split('/')[data.split('/').length - 1];
                  return (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <InsertDriveFileIcon style={{ height: 60, width: 60 }} />
                      <p style={{ marginRight: 30 }}>{name}</p>
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
            ))}
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
      <TabPanel value={value} index={6}>
        <div>
          {filesData
            ?.filter((file) => file.document_type === 'my_files')
            .map((file) => (
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
                {file.media_file.map((data) => {
                  const name = data.split('/')[data.split('/').length - 1];
                  return (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <InsertDriveFileIcon style={{ height: 60, width: 60 }} />
                      <p style={{ marginRight: 30 }}>{name}</p>
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
            ))}
        </div>
      </TabPanel>
    </div>
  );
};

export default LessonPlanTabsStudent;
