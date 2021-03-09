import React, {useContext,useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, useTheme, IconButton ,Divider,SvgIcon} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import useStyles from './useStyles';
import './dairy-card.css'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import cardAttachment from '../../../assets/images/cardAttachment.svg'
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import {Context} from '../context/context'
import {useLocation} from 'react-router-dom';


const PeriodCard = ({ lesson, setPeriodDataForView, setViewMoreData, setViewMore ,setLoading,  index, periodColor, setPeriodColor, setSelectedIndex, handleDairyType}) => {

  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const classes = useStyles();
  const [showMenu, setShowMenu] = useState(false);
  const [showPeriodIndex, setShowPeriodIndex] = useState();
  const history=useHistory()
  const [state, setState] = useContext(Context)
  const location = useLocation();
  const isTeacher = location.pathname === '/dairy/teacher' ? true : false;

  const handlePeriodMenuOpen = (index, id) => {
    setShowMenu(true);
    setShowPeriodIndex(index);
  };

  const handlePeriodMenuClose = (index) => {
    setShowMenu(false);
    setShowPeriodIndex();
  };

  const handleViewMore = () => {
    setLoading(true)
    // axiosInstance.get(`${endpoints.lessonReport.lessonViewMoreData}?central_gs_mapping_id=${lesson.central_gs_mapping_id}&volume_id=${lesson.volume_id}&academic_year_id=${lesson.academic_year_id}&completed_by=${lesson.completed_by}`)
    //   .then(result => {
    //     // console.log(result.data,'ooo')
    //     if (result.data.status_code === 200) {
          setLoading(false);
          setViewMore(true);
          setViewMoreData(lesson);
          setPeriodDataForView(lesson);
          setSelectedIndex(index);
          setPeriodColor(true);
          handleDairyType(1);
        // } else {
        //   setLoading(false);
        //   setViewMore(false);
        //   setViewMoreData({});
        //   setAlert('error', result.data.message);
        //   setPeriodDataForView();
        //   setSelectedIndex(-1);
        //   setPeriodColor(true);
        // }
    //   })
    //   .catch((error) => {
    //     setViewMore(false);
    //     setViewMoreData({});
    //     setAlert('error', error.message);
    //     setPeriodDataForView();
    //     setSelectedIndex(-1);
    //     setPeriodColor(true);
    //   })
  }
  const handleDelete=(e,index)=>{
    console.log(e,index,'event')
    axiosInstance.delete(`${endpoints.generalDairy.updateDelete}${e.id}/update-delete-dairy/`)
    .then((result)=>{

      if(result.data.status_code===200){
        setAlert('success',result.data.message)
      }else{
        setAlert('errpr', 'ERROR!')
      }

    })


  }
  const handleEdit=(data)=>{
    // console.log(data,'PPP')
    // // setEditData(e)
    debugger
    setState({isEdit:true,editData:data});
    history.push('/create/general-dairy')
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
              Topic / {lesson.title}
            </Typography>
          </Box>
        <Typography style={{fontSize: '15px',marginTop: '10px'}}> GeneralDairy</Typography>
          <Divider className='divider'/>
          <Box mt={2}>
            <Typography
              className={classes.content}
              variant='p'
              component='p'
              color='secondary'
              noWrap
            >
             Message: {lesson.message}
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
              {isTeacher?
              <IconButton
              className="moreHorizIcon"
              color='primary'
              >
                <MoreHorizIcon />
              </IconButton> : ''
              }
              {(showPeriodIndex === index &&
                showMenu) ? (
                  <div className="tooltip" style={{display:'flex',justifyContent:'space-between'}}>
                  <span className='tooltiptext' >
                        <Button className='tooltip' onClick={e=> handleDelete(lesson)}>Delete</Button>
                        <Button className='tooltip' onClick={e=> handleEdit(lesson)}> Edit</Button>
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
              style={{fontSize: '15px'}}
              variant='p'
              component='p'
              color='secondary'
            >
              Created By -<p>{lesson.created_by.first_name} {lesson.created_at.substring(0, 10)}</p>
              </Typography>
          </Box>
          <div>
            <IconButton style={{fontSize:'1rem',color:'#042955',marginLeft:'.5rem'}}>
                <SvgIcon
                component={() => (
                  <img
                    style={{ height: '21px', width: '21px', marginLeft: '-18px', marginRight: '5px' }}
                    src={cardAttachment}
                    alt='attachment'
                  />
                )}/>
              {lesson.documents ? lesson.documents.length : 0} Files
            </IconButton>
            {/* <label></label> */}
          </div>
        </Grid>
       <Grid></Grid>
        <Grid item xs={6} className={classes.textRight}> 
          {/* {!viewMore && */}

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
           {/* } */}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PeriodCard;
