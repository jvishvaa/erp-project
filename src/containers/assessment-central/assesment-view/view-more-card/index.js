import React, { useContext, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { useTheme, IconButton, SvgIcon } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import './view-more-card.css';

import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import downloadAll from '../../../../assets/images/downloadAll.svg';
import download from '../../../../assets/images/download.svg';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';

import QuestionDetailCard from '../question-details-card';
import './styles.scss';

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
}) => {
  const { setAlert } = useContext(AlertNotificationContext);

  // const qData = viewMoreData?.questions;
  // const sData = viewMoreData?.sections

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (index) => (event, isExpanded) => {
    setExpanded(isExpanded ? index : false);
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
          </div>

          <div className='downloadAllText' />
        </div>
      </div>
    </Paper>
  );
};

export default ViewMoreCard;
