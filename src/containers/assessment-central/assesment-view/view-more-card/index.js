import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import { IconButton, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import './view-more-card.css';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import QuestionDetailCard from '../question-details-card';
import './styles.scss';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '94%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: 'auto',
    flexShrink: 0,
    color: '#014b7e',
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  expanded: {
    margin: '10px auto',
  },
}));

const ViewMoreCard = ({
  viewMoreData,
  setViewMore,
  filterDataDown,
  periodDataForView,
  setSelectedIndex,
  setPublishFlag,
}) => {
  const { setAlert } = useContext(AlertNotificationContext);
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (index) => (event, isExpanded) => {
    setExpanded(isExpanded ? index : false);
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
    <Paper className='rootViewMore'>
      <div className='viewMoreHeader'>
        <div className='leftHeader'>
          <div className='headerTitle'>{periodDataForView?.paper_name}</div>
          <div className='headerContent'>
            {periodDataForView?.is_draft ? 'Draft' : null}
            {periodDataForView?.is_review ? 'Review' : null}
            {periodDataForView?.is_verified ? 'Published' : null}
          </div>
        </div>
        <div className='rightHeader'>
          <div className='headerTitle closeIcon'>
            <IconButton
              onClick={() => {
                setViewMore(false);
                setSelectedIndex(-1);
              }}
            >
              <CloseIcon color='primary' />
            </IconButton>
          </div>
          <div className='headerContent'>
            <div>Created on</div>
            <div className='viewUpdatedDate'>
              {periodDataForView?.created_at?.substring(0, 10)}
            </div>
          </div>
        </div>
      </div>
      <div className='resourceBulkDownload'>
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

                  {/* <AccordionDetails> */}
                  <div className='section-content'>
                    {section.questions?.map((q) => (
                      <div
                        className='question-detail-card-wrapper'
                        style={{ width: '100%' }}
                      >
                        <QuestionDetailCard question={q} />
                      </div>
                    ))}
                  </div>
                  {/* </AccordionDetails> */}
                </Accordion>
              ))}
            </div>
            <div style={{ margin: '5px 15px 15px 5px' }}>
              {periodDataForView?.is_review && (
                <Button
                  style={{ marginRight: '1rem' }}
                  onClick={() => handlePublish(true)}
                  color='primary'
                  variant='contained'
                  size='small'
                >
                  PUBLISH
                </Button>
              )}
              {(periodDataForView?.is_verified || periodDataForView?.is_review) && (
                <Button
                  style={{ marginRight: '1rem' }}
                  onClick={() => handlePublish(false)}
                  color='secondary'
                  variant='contained'
                  size='small'
                >
                  REJECT
                </Button>
              )}
            </div>
          </div>

          <div className='downloadAllText' />
        </div>
      </div>
    </Paper>
  );
};

export default ViewMoreCard;
