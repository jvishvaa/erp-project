import React, { useState, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, useTheme, IconButton, SvgIcon } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import useStyles from './useStyles';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';
import axios from 'axios';
import '../lesson.css';
import downloadAll from '../../../../assets/images/downloadAll.svg';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import { useLocation } from 'react-router-dom';

const PeriodCard = ({
  period,
  setPeriodDataForView,
  setViewMoreData,
  setViewMore,
  viewMore,
  filterDataDown,
  setLoading,
  index,
  setCompletedStatus,
  periodColor,
  setPeriodColor,
  setSelectedIndex,
  centralGradeName,
  centralSubjectName,
}) => {
  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const classes = useStyles();
  const [showMenu, setShowMenu] = useState(false);
  const [showPeriodIndex, setShowPeriodIndex] = useState();
  const location = useLocation();

  const handlePeriodMenuOpen = (index, id) => {
    setShowMenu(true);
    setShowPeriodIndex(index);
  };

  const handlePeriodMenuClose = (index) => {
    setShowMenu(false);
    setShowPeriodIndex();
  };

  const handleViewMore = (index) => {
    setLoading(true);
    let request = `${endpoints.lessonPlan.periodCardData}?lesson_plan_id=${period?.id}`;
    if (location.pathname === '/lesson-plan/student-view') {
      request += `&student=1`;
    }
    axios
      .get(request, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          if (result.data.result?.length > 0) {
            setLoading(false);
            setViewMore(true);
            setViewMoreData(result.data.result);
            setPeriodDataForView(period);
            setSelectedIndex(index);
            setPeriodColor(true);
            axiosInstance
              .get(
                `${endpoints.lessonPlan.periodCompletedStatus}?subject=${filterDataDown?.subject?.subject_id}&chapter=${filterDataDown?.chapter?.id}&period=${period?.id}`
              )
              .then((result) => {
                setCompletedStatus(result?.data?.is_completed);
              })
              .catch((error) => {
                setAlert('error', error?.message);
              });
          } else {
            setLoading(false);
            setPeriodColor(true);
            setAlert('error', 'No data available');
          }
        } else {
          setLoading(false);
          setViewMore(false);
          setViewMoreData({});
          setPeriodDataForView();
          setAlert('error', result?.data?.message);
          setSelectedIndex(-1);
          setPeriodColor(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        setViewMore(false);
        setViewMoreData({});
        setPeriodDataForView();
        setAlert('error', error?.message);
        setSelectedIndex();
        setPeriodColor(true);
      });
  };

  const handleBulkDownload = () => {
    const formData = new FormData();
    formData.append('academic_year', filterDataDown?.year?.session_year);
    formData.append('volume', filterDataDown?.volume?.volume_name);
    formData.append('grade', centralGradeName);
    formData.append('subject', centralSubjectName);
    formData.append('chapter', filterDataDown?.chapter?.chapter_name);
    formData.append('period', period?.period_name);
    axios
      .post(`${endpoints.lessonPlan.bulkDownload}`, formData, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          let a = document.createElement('a');
          if (result?.data?.result) {
            a.href = result?.data?.result;
            a.click();
            a.remove();
          } else {
            setAlert('error', 'Nothing to download!');
          }
        } else {
          setAlert('error', result?.data?.description);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
  };

  return (
    <Paper
      className={periodColor ? classes.selectedRoot : classes.root}
      style={isMobile ? { margin: '0rem auto' } : { margin: '0rem auto -1.1rem auto' }}
    >
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box>
            <Typography
              className={classes.title}
              variant='p'
              component='p'
              color='primary'
            >
              {period.period_name}
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
              {filterDataDown?.chapter?.chapter_name}
            </Typography>
          </Box>
        </Grid>
        {/* <Grid item xs={4} className={classes.textRight}>
          <Box>
            <span
              className='period_card_menu'
              onClick={() => handlePeriodMenuOpen(index)}
              onMouseLeave={handlePeriodMenuClose}
            >
              <IconButton
                className="moreHorizIcon"
                color='primary'
              >
                <MoreHorizIcon />
              </IconButton>
              {(showPeriodIndex === index &&
                showMenu) ? (
                  <div className="tooltipContainer">
                    <span className='tooltiptext'>
                      Download All
                      <IconButton onClick={handleBulkDownload} className="bulkDownloadIconPeriodCard">
                        <SvgIcon
                          component={() => (
                            <img
                              style={{ height: '21px', width: '21px' }}
                              src={downloadAll}
                              alt='downloadAll'
                            />
                          )}
                        />
                      </IconButton>
                    </span>
                  </div>
                ) : null}
            </span>
          </Box>
        </Grid> */}
        <Grid item xs={12} sm={12} />
        <Grid item xs={6}>
          <Box>
            <Typography
              className={classes.title}
              variant='p'
              component='p'
              color='secondary'
            >
              Last Updated On
            </Typography>
          </Box>
          <Box>
            <Typography
              className={classes.content}
              variant='p'
              component='p'
              color='secondary'
            >
              {period.updated_at.substring(0, 10)}
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
              onClick={() => handleViewMore(index)}
            >
              VIEW MORE
            </Button>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PeriodCard;
