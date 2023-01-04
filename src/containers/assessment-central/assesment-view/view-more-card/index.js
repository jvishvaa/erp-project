import React, { useContext, useEffect , useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { IconButton, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import './view-more-card.css';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import { useHistory } from 'react-router-dom';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import QuestionDetailCard from '../question-details-card';
import './styles.scss';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';
import { Drawer } from 'antd';
import axios from 'v2/config/axios';
import { message, Spin } from 'antd';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  rootViewMore: theme.rootViewMore,
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: 'auto',
    flexShrink: 0,
    color: theme.palette.secondary.main,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  expanded: {
    margin: '10px auto',
  },
  margin: {
    margin: theme.spacing(1),
  },
  resourceBulkDownload: {
    fontSize: '1.1rem',
    color: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
  },
}));

const ViewMoreCard = ({
  period,
  viewMoreData,
  setViewMore,
  filterDataDown,
  periodDataForView,
  setSelectedIndex,
  setPublishFlag,
  tabValue
}) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (index) => (event, isExpanded) => {
    setExpanded(isExpanded ? index : false);
  };

  const [showNewAsses, setShowNewAsses] = useState(false);
  const selectedBranch = useSelector(
    (state) => state.commonFilterReducer?.selectedBranch
  );
  const fetchquesPaperStatus = () => {
    // setLoading(true);
    axios
      .get(`${endpoints.doodle.checkDoodle}?config_key=asmt_enhancement`)
      .then((response) => {
        if (response?.data?.result) {
          if (response?.data?.result.includes(String(selectedBranch?.branch?.id))) {
            setShowNewAsses(true);
          } else {
            setShowNewAsses(false);
          }
        }
        // setLoading(false);
      })
      .catch((error) => {
        // setLoading(false);
        message.error('error', error?.message);
      });
  };

  useEffect(() => {
    fetchquesPaperStatus()
  },[selectedBranch])

  useEffect(() => {
    showDrawer()
  },[])

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setViewMore(false);
    setSelectedIndex(-1);
  };

  const handleOpenEdit = () => {
    
      if(showNewAsses){
        history.push({ 
          pathname : `/create-questionpaper/`,
          state:{
            isEdit : true,
            paperId : periodDataForView?.id
          }
      }
        )
      }else{

    history.push({ 
      pathname : `/create-question-paper/${periodDataForView?.id}`,
      state:{
        isEdit : true
      }
  }
    )
}
    
  };
 


  const handlePublish = (isPublish = true) => {
    setPublishFlag(false);
    let requestBody = {
      is_verified: isPublish,
      is_draft: !isPublish,
      is_review: false,
    };
    const url = endpoints.assessmentErp?.publishQuestionPaper.replace(
      '<question-paper-id>',
      periodDataForView?.id
    );
    axiosInstance
      .put(url, requestBody)
      .then((result) => {
        if (result?.data?.status_code > 199 && result?.data?.status_code < 300) {
          setAlert('success', result?.data?.message);
          setPublishFlag(true);
          setSelectedIndex(-1);
        } else {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  };

  return (
    // <Paper className={classes.rootViewMore}>
    <Drawer title = {periodDataForView?.paper_name} zIndex={1300} width={'500px'} placement="right" onClose={onClose} open={open} visible={open}>
      <div className='viewMoreHeader'>
        <div className='leftHeader'>
          {/* <div className='headerTitle'>{periodDataForView?.paper_name}</div> */}
          <div className='row'>
            <div className='col-md-6 d-flex justify-content-center headerContent'>
            {periodDataForView?.is_draft ? 'Draft' : null}
            {periodDataForView?.is_review ? 'Review' : null}
            {periodDataForView?.is_verified ? 'Published' : null}
            </div>
            <div className='d-flex col-md-6 justify-content-end'>
            {!periodDataForView?.is_central && (
            <Button
              size='small'
              className={classes.margin}
              onClick={() => handleOpenEdit()}
              variant='contained'
              color='primary'
            >
              Edit
            </Button>
          )}
          </div>
          </div>
          {/* <div style={{ display: 'flex' }}>
            <h6>Created on - </h6>
            <span>
              {periodDataForView?.created_at?.substring(0, 10)}
            </span>
          </div> */}
        </div>
        <div className='rightHeader'>
          {/* <div className='headerTitle closeIcon'>
            <IconButton
              onClick={() => {
                setViewMore(false);
                setSelectedIndex(-1);
              }}
            >
              <CloseIcon color='primary' />
            </IconButton>
          </div> */}
        </div>
      </div>
      <div className={classes.resourceBulkDownload}>
        <div className='downloadAllContainer' style={{ width: '100%' }}>
          <div className='downloadAllIcon' style={{ width: '100%' }}>
            <div className={classes.root}>
              {viewMoreData?.map((section, index) => (
                <Accordion
                  expanded={expanded === index}
                  onChange={handleChange(index)}
                  mb={3}
                  className='downloadAllIcon'
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1bh-content'
                    id='panel1bh-header'
                    mb={3}
                  >
                    <Typography className={classes.heading}>
                      {`SECTION ${section?.name}`}
                    </Typography>
                  </AccordionSummary>
                  <div className='section-content'>
                    {section.questions?.map((q,i) => (
                      <div
                        className='question-detail-card-wrapper'
                        style={{ width: '100%' }}
                      >
                        <QuestionDetailCard question={q} index={i} />
                        <hr/>
                      </div>
                    ))}
                  </div>
                </Accordion>
              ))}
            </div>
            {tabValue !== 4 && <div style={{ display: 'flex', margin: '5px 15px 15px 5px' }}>
              {((periodDataForView?.is_verified || periodDataForView?.is_review) && (!periodDataForView?.is_central)) && (
                <Button
                  style={{ margin: '0.5rem', color: 'white', width: '100%' }}
                  onClick={() => handlePublish(false)}
                  color='secondary'
                  variant='contained'
                  size='small'
                >
                  REJECT
                </Button>
              )}
              {periodDataForView?.is_review && (
                <Button
                  style={{ margin: '0.5rem', color: 'white', width: '100%' }}
                  onClick={() => handlePublish(true)}
                  color='primary'
                  variant='contained'
                  size='small'
                >
                  PUBLISH
                </Button>
              )}
            </div>}
          </div>

          <div className='downloadAllText' />
        </div>
      </div>
    {/* </Paper > */}
    </Drawer>
  );
};

export default ViewMoreCard;
