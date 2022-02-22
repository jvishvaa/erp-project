import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LessonPlanTabs from './studentLessonPlanTabs';
import './academicStyles.scss';
import {
  IconButton,
  Button,
  SvgIcon,
  AccordionSummary,
  Accordion,
  AccordionDetails,
} from '@material-ui/core';
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
const LessonPlanTabsStudent = ({ upcomingTopicId, topicDetails, periodDetails, id }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [topicId, setTopicId] = useState(null);
  const [topicDataValue, setTopicDataValue] = useState(null);
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
  if (upcomingTopicId) {
    upcomingTopicId.forEach((topic) => {
      ids.push(topic?.topic_id);
    });
  }
  const concaticatedIds = ids.join(',');
  const TopicContentView = (concaticatedIds) => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.lessonPlanTabs.topicData}?topic_id=${concaticatedIds}&period_id=${id}`)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          const FilesData = result.data?.result;
          setTopicDataValue(result.data?.result);
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
  const [accordianOpen, setAccordianOpen] = useState(false);
  const handleAccordionChange = (value, head) => (event, newExpanded) => {
    setTopicId(head);
    if (value > 0) {
      setAccordianOpen(newExpanded ? value : false);
    }
  };
  const [selectedFiles3, setSelectedFile3] = React.useState(null);
  return (
    <div style={{ width: '100% !important' }}>
      {periodDetails?.info?.type_name !== 'Examination' &&
        topicDetails?.map((value, index) => {
          return (
            <div className={`acc${index + 1}`} style={{}}>
              {value ? (
                <Accordion
                  expanded={accordianOpen === index + 1}
                  onChange={handleAccordionChange(index + 1)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                  >
                    {value?.topic_name}{' '}
                    <div style={{ marginLeft: '76%', display: 'flex' }}>
                      {value?.status === 2
                        ? 'Completed'
                        : value?.status === 1
                          ? 'Partially completed'
                          : 'Not completed'}
                      {/* <CheckIcon style={{ fontSize: 'large', color: '#53E24A' }} /> */}
                    </div>
                  </AccordionSummary>
                  {accordianOpen && (
                    <>
                      <AccordionDetails>
                        <LessonPlanTabs
                          // filesData = {filesData}
                          periodId={value?.period}
                          data={value}
                          TopicId={value?.topic_id}
                          isAccordian={accordianOpen}
                          checkid={'accordian'}
                          assignedTopic={value?.id}
                        />
                      </AccordionDetails>
                      <div></div>
                    </>
                  )}
                </Accordion>
              ) : (
                <></>
              )}
            </div>
          );
        })}
    </div>
  );
};
export default LessonPlanTabsStudent;