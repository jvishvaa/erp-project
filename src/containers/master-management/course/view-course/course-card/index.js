import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, useTheme, IconButton, Popover, withStyles } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Box from '@material-ui/core/Box';
import useStyles from './useStyles';
import '../../create-course/style.css';
import endpoints from '../../../../../config/endpoints';
import axiosInstance from '../../../../../config/axios';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
import { Context } from '../context/ViewStore';

const StyledButton = withStyles({
  root: {
    color: '#FFFFFF',
    backgroundColor: '#FF6B6B',
    '&:hover': {
      backgroundColor: '#FF6B6B',
    },
  }
})(Button);

const CancelButton = withStyles({
  root: {
    color: '#8C8C8C',
    backgroundColor: '#e0e0e0',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  }
})(Button);

const CourseCard = ({
  period,
  setPeriodDataForView,
  setViewMoreData,
  setViewMore,
  setLoading,
  index,
  periodColor,
  setPeriodColor,
  setSelectedIndex,
  deleteFlag,
  setDeleteFlag,
  handleCourseList,
  sendGrade,
  selectedIndex,
  tabVal
}) => {
  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const classes = useStyles();

  const [showMenu, setShowMenu] = useState(false);
  const [showPeriodIndex, setShowPeriodIndex] = useState();

  const [state, setState] = useContext(Context);
  const history = useHistory();

  const handlePeriodMenuOpen = (index, id) => {
    setShowMenu(true);
    setShowPeriodIndex(index);
  };

  const handlePeriodMenuClose = (index) => {
    setShowMenu(false);
    setShowPeriodIndex();
  };

  const handleViewMore = () => {
    axiosInstance
      .get(`${endpoints.onlineCourses.courseDetails}?periods=all&course_id=${period.id}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setLoading(false);
          setViewMore(true);
          setViewMoreData(result.data.result);
          setState({ ...state, viewPeriodData: result.data.result, editData: period });
          setPeriodDataForView(period);
          setSelectedIndex(index);
          setPeriodColor(true);
        } else {
          setLoading(false);
          setViewMore(false);
          setViewMoreData([]);
          setAlert('error', result.data.message);
          setPeriodDataForView();
          setSelectedIndex(-1);
          setPeriodColor(true);
        }
      })
      .catch((error) => {
        setViewMore(false);
        setViewMoreData([]);
        setAlert('error', error.message);
        setPeriodDataForView();
        setSelectedIndex(-1);
        setPeriodColor(true);
      });
  };

  const handleDelete = (e, index) => {
    //https://erpnew.letseduvate.com/qbox/aol/160/update-course/
    //https://erpnew.letseduvate.com/qbox/aol/132/update-course/
    alert(e.id);
    axiosInstance
      .delete(`${endpoints.onlineCourses.deleteCourse}${e.id}/update-course/`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', 'Course successfully Deleted');
          setDeleteFlag(!deleteFlag);
          setViewMore(false);
          setSelectedIndex(-1);
          setPeriodColor(false);
          setPeriodDataForView();
        } else {
          setAlert('error', 'ERROR!');
        }
        handleClose();
      })
      .catch((error) =>
        setAlert('error', error.response?.data?.message || error.response?.data?.msg)
      );
  };
  // const handleEdit = () => {
  //   history.push(`/create/course/${sendGrade}`);
  //   sessionStora ge.setItem('selectedIndex', selectedIndex);
  // };
  const handleStatus = (e,index)=>{
    if(tabVal === 1){
      axiosInstance.put(`${endpoints.onlineCourses.updateCourse}${e.id}/update-course/`,{
        "is_active":0
      }).then(result=>{
        if(result.data.status_code === 200){
          setAlert('success',result.data.message)
          handleCourseList(sendGrade,tabVal);
        }
        else{
          setAlert('error','Not Updated, Try After Few Mins.')
        }
      })
    }
    if(tabVal === 2){
      axiosInstance.put(`${endpoints.onlineCourses.updateCourse}${e.id}/update-course/`,{
        "is_active":1
      }).then(result=>{
        if(result.data.status_code === 200){
          setAlert('success',result.data.message)
          handleCourseList(sendGrade,tabVal);
        }
        else{
          setAlert('error','Not Updated, Try After Few Mins.')
        }
      })
    }
    
  }
  // Confirm Popover 
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
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
              {period?.course_name}
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
              Level - {period?.level === 'Low' ? 'Beginner' : null}{' '}
              {period?.level === 'High' ? 'Advance' : null}{' '}
              {period?.level === 'Mid' ? 'Intermediate' : null}
            </Typography>
          </Box>
        </Grid>
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
                <div
                  className='tooltip'
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span className='tooltiptext'>
                    <div className='tooltip' onClick={(e) => handleClick(e)}>
                      Delete
                    </div>
                    <div onClick={() => handleStatus(period)} style={{marginTop: '5px'}}>
                     {/* {tabVal ==0 || tabVal == undefined ? 'Active' : '' } */}
                     {tabVal == 1  ? 'Inactive' : '' }
                     {tabVal == 2  ? 'Active' : '' }
                    </div>
                  </span>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <div style={{ padding: '20px 30px'}}>
                      <Typography style={{ fontSize: '20px', marginBottom: '15px'}}>Are you sure you want to delete??</Typography>
                      <div>
                        <CancelButton onClick={(e) => handleClose()}>Cancel</CancelButton>
                        <StyledButton onClick={() => handleDelete(period)} style={{float: 'right'}}>Confirm</StyledButton>
                      </div>
                    </div>
                  </Popover>
                </div>
              ) : null}
            </span>
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
              No Of Periods - {period?.no_of_periods}
            </Typography>
          </Box>
          <Box></Box>
        </Grid>
        <Grid item xs={6} className={classes.textRight}>
          {!periodColor && (
            <Button
              variant='contained'
              style={{ color: 'white' }}
              color='primary'
              className='custom_button_master buttonModifiedDesign'
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

export default CourseCard;
