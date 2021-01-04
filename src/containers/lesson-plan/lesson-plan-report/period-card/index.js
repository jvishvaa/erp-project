import React, {useContext} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, useTheme, IconButton, Menu, MenuItem } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import GetAppIcon from '@material-ui/icons/GetApp';
import useStyles from './useStyles';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';

const PeriodCard = ({ lesson, setPeriodDataForView, setViewMoreData, setViewMore, viewMore, chapterId, chapterName,setLoading}) => {

  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
console.log(lesson,'===========')
  const handleViewMore = () => {
    axiosInstance.get(`${endpoints.lessonReport.lessonViewMoreData}?central_gs_mapping_id=${lesson.central_gs_mapping_id}&volume_id=${lesson.volume_id}&academic_year_id=${lesson.academic_year_id}&completed_by=${lesson.completed_by}`)
      .then(result => {
        console.log(result.data,'ooo')
        if (result.data.status_code === 200) {
          setLoading(false);
          setViewMore(true);
          setViewMoreData(result.data.result);
          setPeriodDataForView(lesson);
        } else {
          setLoading(false);
          setViewMore(false);
          setViewMoreData({});
          setAlert('error', result.data.message);
          setPeriodDataForView();
        }
      })
      .catch((error) => {
        // setLoading(false);
        setViewMore(false);
        setViewMoreData({});
        setAlert('error', error.message);
        setPeriodDataForView();
      })
  }

  return (
    <Paper className={classes.root} style={isMobile ? { margin: '0rem auto' } : { margin: '0rem auto -1.1rem auto' }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box>
            <Typography
              className={classes.title}
              variant='p'
              component='p'
              color='primary'
            >
              {lesson.first_name}
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
             {lesson.section_name}
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
              Completed - {lesson.completed}
              </Typography>
          </Box>
          <Box>
            {/* <Typography
              className={classes.content}
              variant='p'
              component='p'
              color='secondary'
            >
              {period.updated_at.substring(0, 10)}
            </Typography> */}
          </Box>
        </Grid>
        <Grid item xs={6} className={classes.textRight}> 
          {/* {!viewMore && */}
          <Button
            variant='contained'
            style={{ color: 'white' }}
            color="primary"
            className="custom_button_master"
            size='small'
            onClick={handleViewMore}
          >
            VIEW MORE
          </Button>
           {/* } */}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PeriodCard;
