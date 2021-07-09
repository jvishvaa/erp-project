import React, { useState, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, useTheme, IconButton, SvgIcon } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { connect } from 'react-redux';
import useStyles from './useStyles';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';
import axios from 'axios';
import { addQuestionPaperToTest } from '../../../../redux/actions';
import Divider from '@material-ui/core/Divider';

// import '../../lesson-plan-view/lesson.css';
// import downloadAll from '../../../../assets/images/downloadAll.svg';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';

const AssessmentCard = ({
  period,
  setPeriodDataForView,
  setViewMoreData,
  setViewMore,
  viewMore,
  filterDataDown,
  setLoading,
  index,
  periodColor,
  setPeriodColor,
  setSelectedIndex,
  initAddQuestionPaperToTest,
  setPublishFlag,
}) => {
  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const classes = useStyles();
  const [showMenu, setShowMenu] = useState(false);
  const [showPeriodIndex, setShowPeriodIndex] = useState();

  const history = useHistory();

  const handlePeriodMenuOpen = (index, id) => {
    setShowMenu(true);
    setShowPeriodIndex(index);
  };

  const handlePeriodMenuClose = (index) => {
    setShowMenu(false);
    setShowPeriodIndex();
  };

  const handleAssign = () => {
    initAddQuestionPaperToTest(period);
    history.push('/create-assesment');
  };

  const handlePublish = () => {
    setPublishFlag(false);
    const url = endpoints.assessmentErp?.publishQuestionPaper.replace(
      '<question-paper-id>',
      period?.id
    );
    axiosInstance
      .put(url, {
        is_verified: true,
        is_draft: false,
        is_review: false,
      })
      .then((result) => {
        if (result.data.status_code > 199 && result.data.status_code < 300) {
          setAlert('success', result.data.message);
          setPublishFlag(true);
          setSelectedIndex(-1);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  };

  const handleDelete = () => {
    setPublishFlag(false);
    const url = endpoints.assessmentErp?.publishQuestionPaper.replace(
      '<question-paper-id>',
      period?.id
    );
    axiosInstance
      .put(url, {
        is_delete: true,
      })
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
        setAlert('error', error?.message);
      });
  };

  const handleViewMore = () => {
    setLoading(true);
    setPeriodDataForView({});
    const url = endpoints.assessmentErp?.questionPaperViewMore.replace(
      '<question-paper-id>',
      period?.id
    );

    axiosInstance
      .get(url)
      .then((result) => {
        if (result.data.status_code === 200) {
          const { sections, questions } = result.data.result;
          const parsedResponse = [];
          sections.forEach((sec) => {
            const sectionObject = { name: '', questions: [] };
            const sectionName = Object.keys(sec)[0];
            sectionObject.name = sectionName;
            sec[sectionName].forEach((qId) => {
              const questionFound = questions.find((q) => q?.identifier === qId);
              if (questionFound) {
                sectionObject.questions.push(questionFound);
              }
            });
            parsedResponse.push(sectionObject);
          });

          setLoading(false);
          setViewMore(true);
          // setViewMoreData(result.data.result);
          setViewMoreData(parsedResponse);
          setPeriodDataForView(period);
          setSelectedIndex(index);
          setPeriodColor(true);
        } else {
          setLoading(false);
          setViewMore(false);
          setViewMoreData([]);
          setPeriodDataForView();
          setAlert('error', result.data.message);
          setSelectedIndex(-1);
          setPeriodColor(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        setViewMore(false);
        setViewMoreData([]);
        setPeriodDataForView();
        setAlert('error', error.message);
        setSelectedIndex(-1);
        setPeriodColor(true);
      });
  };

  return (
    <Paper
      className={periodColor ? classes.selectedRoot : classes.root}
      style={
        (isMobile ? { margin: '0rem auto' } : { margin: '0rem auto -1.1rem auto' },
        period.is_verified ? { background: '#FCEEEE' } : { background: '#FFF' })
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box>
            <Typography
              className={classes.title}
              variant='p'
              component='p'
              color='primary'
              noWrap
            >
              {period.paper_name}
            </Typography>
          </Box>
          <Box>
            <Typography
              className={classes.content}
              variant='p'
              component='p'
              color='secondary'
              noWrap
            >
              {period.is_draft ? 'Draft' : null}
              {period.is_review ? 'Review' : null}
              {period.is_verified ? 'Published' : null}
            </Typography>
          </Box>
        </Grid>
        {/* {period.is_verified && ( */}
        <Grid item xs={4} className={classes.textRight}>
          <Box>
            <span
              className='period_card_menu'
              onClick={() => handlePeriodMenuOpen(index)}
              onMouseLeave={handlePeriodMenuClose}
            >
              <IconButton className='moreHorizIcon' color='primary'>
                <MoreHorizIcon />
              </IconButton>
              {showPeriodIndex === index && showMenu ? (
                <div className='tooltipContainer'>
                  {period.is_verified && (
                    <span className='tooltiptext' style={{width:'105px'}}>
                      <span onClick={handleAssign}>Assign Test</span>
                      <Divider/>
                      <span onClick={handleDelete}>Delete</span>
                    </span>
                  )}
                  {!period.is_verified && (
                    <span className='tooltiptext'>
                      <span onClick={handlePublish}>Publish Paper</span>
                      <span onClick={handleDelete}>Delete</span>
                    </span>
                  )}
                </div>
              ) : null}
            </span>
          </Box>
        </Grid>
        {/* )} */}
        <Grid item xs={12} sm={12} />
        <Grid item xs={6}>
          <Box>
            <Typography
              className={classes.title}
              variant='p'
              component='p'
              color='secondary'
            >
              Created On
            </Typography>
          </Box>
          <Box>
            <Typography
              className={classes.content}
              variant='p'
              component='p'
              color='secondary'
            >
              {period.created_at.substring(0, 10)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} className={classes.textRight}>
          {!periodColor && (
            <Button
              variant='contained'
              style={{ color: 'white' }}
              color='primary'
              className='custom_button_master modifyDesign'
              size='small'
              onClick={handleViewMore}
            >
              VIEW MORE
            </Button>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

const mapDispatchToProps = (dispatch) => ({
  initAddQuestionPaperToTest: (data) => dispatch(addQuestionPaperToTest(data)),
});

export default connect(null, mapDispatchToProps)(AssessmentCard);
