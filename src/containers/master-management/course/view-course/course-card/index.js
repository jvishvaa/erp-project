import React, {useContext,useState} from 'react';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, useTheme ,IconButton} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Box from '@material-ui/core/Box';
import useStyles from './useStyles';
// import './circular-card.css'
import endpoints from '../../../../../config/endpoints';
import axiosInstance from '../../../../../config/axios';
import { AlertNotificationContext } from '../../../../../context-api/alert-context/alert-state';
import {Context} from '../context/ViewStore'

const CourseCard = ({period, setPeriodDataForView, setViewMoreData, setViewMore ,setLoading,  index, periodColor, setPeriodColor, setSelectedIndex,   setEditData}) => {

  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const classes = useStyles();

  const [showMenu, setShowMenu] = useState(false);
  const [showPeriodIndex, setShowPeriodIndex] = useState();

  const [state,setState] = useContext(Context);
  const history =useHistory();

  const handlePeriodMenuOpen = (index, id) => {
    setShowMenu(true);
    setShowPeriodIndex(index);
  };

  const handlePeriodMenuClose = (index) => {
    setShowMenu(false);
    setShowPeriodIndex();
  };
  
  const handleViewMore = () => {
    axiosInstance.get(`${endpoints.onlineCourses.courseDetails}?periods=all&course_id=${period.id}`)
      .then(result => {
        if (result.data.status_code === 200) {
          setLoading(false);
          setViewMore(true);
          setViewMoreData(result.data.result);
          setState({...state,viewPeriodData:result.data.result,editData:period})
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
      })
  }

  const handleDelete=(e,index)=>{
    axiosInstance.delete(`${endpoints.onlineCourses.deleteCourse}${e.id}/update-course/`).then((result)=>{

      if(result.data.status_code===200){
        setAlert('success',result.data.message)
        
      }else{
        setAlert('error', 'ERROR!')
      }

    }).catch(error=>setAlert('error',error.response?.data?.message||error.response?.data?.msg));


  }
  const handleEdit=(data)=>{
    // console.log(data,'PPP')
    // setEditData(e)
    // setState({isEdit:true,editData:data});
    // history.push('/create-circular')
  }

  return (
    <Paper className={periodColor?classes.selectedRoot:classes.root} style={isMobile ? { margin: '0rem auto' } : { margin: '0rem auto -1.1rem auto' }}>
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
             Level - {period?.level === 'Low' ? 'Beginner' : null} {period?.level === 'High' ? 'Advance' : null} {period?.level === 'Mid' ? 'Intermediate' : null} 
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
              <IconButton
                className="moreHorizIcon"
                color='primary'
              >
                <MoreHorizIcon />
              </IconButton>
              {(showPeriodIndex === index &&
                showMenu) ? (
                  <div className="tooltip" style={{display:'flex',justifyContent:'space-between'}}>
                    <span className='tooltiptext' >
                        <div className='tooltip' onClick={e=> handleDelete(period)}>Delete</div>
                    </span>
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
          <Box>
          </Box>
        </Grid>
        <Grid item xs={6} className={classes.textRight}> 
         {!periodColor && 
          <Button
            variant='contained'
            style={{ color: 'white' }}
            color="primary"
            className="custom_button_master"
            size='small'
            onClick={handleViewMore}
          >
            VIEW MORE
          </Button>}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CourseCard;
