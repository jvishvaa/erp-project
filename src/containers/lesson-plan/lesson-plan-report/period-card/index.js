import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, useTheme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import useStyles from './useStyles';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';

const PeriodCard = ({
  lesson,
  setPeriodDataForView,
  setViewMoreData,
  setViewMore,
  setLoading,
  index,
  periodColor,
  setPeriodColor,
  setSelectedIndex,
  apiParams,
  setApiParams,
}) => {
  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const classes = useStyles();
  // const [showPeriodIndex, setShowPeriodIndex] = useState();

  const handlePeriodMenuOpen = (index, id) => {
    // setShowMenu(true);
    // setShowPeriodIndex(index);
  };

  const handlePeriodMenuClose = (index) => {
    // setShowMenu(false);
    // setShowPeriodIndex();
  };

  const handleViewMore = () => {
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.lessonReport.lessonViewMoreData}?central_gs_mapping_id=${lesson.central_gs_mapping_id}&volume_id=${lesson.volume_id}&academic_year_id=${lesson.academic_year_id}&completed_by=${lesson.completed_by}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          setLoading(false);
          setViewMore(true);
          setViewMoreData(result?.data?.result);
          setPeriodDataForView(lesson);
          setSelectedIndex(index);
          setPeriodColor(true);

          //after getting card
          // setApiParams({...apiParams,central_gs_mapping_id:1,volume_id:2,acad_year_id:3,completed_by:4})

          // setApiParams({...apiParams,central_gs_mapping_id:lesson.central_gs_mapping_id,volume_id:lesson.volume_id,acad_year_id:lesson.academic_year_id,completed_by:lesson.completed_by})
        } else {
          setLoading(false);
          setViewMore(false);
          setViewMoreData({});
          setAlert('error', result?.data?.message);
          setPeriodDataForView();
          setSelectedIndex(-1);
          setPeriodColor(true);
        }
      })
      .catch((error) => {
        setViewMore(false);
        setViewMoreData({});
        setAlert('error', error?.message);
        setPeriodDataForView();
        setSelectedIndex(-1);
        setPeriodColor(true);
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
              {lesson?.first_name}
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
              {lesson?.section_name}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} />
        <Grid item xs={6}>
          <Box>
            <Typography
              className={classes.title}
              variant='p'
              component='p'
              color='secondary'
            >
              Completed Periods - {lesson?.completed}
            </Typography>
          </Box>
          <Box>
            <Typography
              className={classes.title}
              variant='p'
              component='p'
              color='secondary'
            >
              Total Periods - {lesson?.no_of_periods}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} className={classes.textRight}>
          {/* {!viewMore && */}

          {!periodColor && (
            <Button
              variant='contained'
              color='primary'
              style={{ color: 'white', width: '100%' }}
              size='small'
              onClick={handleViewMore}
            >
              VIEW MORE
            </Button>
          )}
          {/* } */}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PeriodCard;
