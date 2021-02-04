/* eslint-disable react/jsx-wrap-multilines */
import React, { useState ,useContext} from 'react';
import { withStyles, makeStyles,useTheme } from '@material-ui/core/styles';
import { Grid, Card, Button, Typography, Divider ,SvgIcon} from '@material-ui/core';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Face from '@material-ui/icons/Face'

import endpoints from '../../../config/endpoints';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

import moment from 'moment';

import unfiltered from '../../../assets/images/unfiltered.svg'

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginLeft: -30,
  },
  card: {
    textAlign: 'center',
    margin: theme.spacing(1),
    backgroundPosition: 'center',
    backgroundSize: 'auto',
  },
}));

function GridList(props) {
  const classes = useStyles();
  const { data } = props;
  const {tabValue} = props.tabValue;
  const [showMenu, setShowMenu] = useState(false);
  const [showPeriodIndex, setShowPeriodIndex] = useState();
  const [selectedIndex, setSelectedIndex] = useState();
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false)
  const themeContext = useTheme();
  const handlePeriodMenuOpen = (index, id) => {
    setShowMenu(true);
    setShowPeriodIndex(index);
  };

  const handlePeriodMenuClose = (index) => {
    setShowMenu(false);
    setShowPeriodIndex();
  };
//   const handleDeleteBlog = (blogId) => {

//     let requestData = {
//       "blog_id": blogId ,
//       "status": "1"
  
//     }
//   axiosInstance.put(`${endpoints.blog.Blog}`, requestData)

//   .then(result=>{
//   if (result.data.status_code === 200) {
//     setLoading(false);
//     setAlert('success', result.data.message);
//   } else {        
//     setLoading(false);
//     setAlert('error', result.data.message);
//   }
//   }).catch((error)=>{
//     setLoading(false);        
//     setAlert('error', error.message);
//   })
// };


  return (
    <div className={classes.root}>
      {data.length ? (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Grid item>
              <Card
                className={classes.card}
                style={{
                  width: '100%',
                  height: '230px',
                  backgroundSize: '360px',
                  backgroundImage: `url(${data[0] && data[0].thumbnail})`,
                  display:data.length >= 1 ? 'flex' : 'none',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <CardHeader
//                 action=       {
//                   props.tabValue === 2 ?
// <IconButton
//                   title='Delete'
//                   onClick={()=>handleDeleteBlog(data[0] && data[0].id)}
//                 >
//                   <DeleteOutlinedIcon
//                     style={{ color: themeContext.palette.primary.main }}
//                   />
//                 </IconButton>
//       : '' 
//               }
                  subheader={
                    <Typography
                      gutterBottom
                      variant='body2'
                      align='left'
                      component='p'
                      style={{ color: 'white' }}
                    >
                      {data[0] && moment(data[0].created_at).format('MMM DD YYYY')}
                      
                    </Typography>
                    
                  }
                />
           
                <CardActionArea>
                   <CardContent style ={{ padding:'5px'}}>
                    <Typography
                      style={{
                        marginTop: '-35px',
                        fontWeight: 'bold',
                        color: 'white',
                      }}
                      color='textSecondary'
                      component='p'
                    >
                      {data[0] && data[0].title}
                    </Typography>
                    <Typography
                      style={{
                        color: 'white',
                        paddingRight:'360px'
                      }}
                      color='textSecondary'
                      component='p'
                    > <IconButton aria-label="settings" style={{fontSize: '15px'}}>
                     <Face style={{ color: 'white' ,fontSize: '25px' }}/>
                   </IconButton>
                      {data[0] && data[0].author.first_name}
                    </Typography>
                   
                  </CardContent>
                </CardActionArea>
                <CardActions style={{ float: 'right' }}>
                  <Button
                    size='small'
                    color='primary'
                    style={{ width: 150 }}
                    onClick={() =>
                      props.history.push({
                        pathname: '/blog/student/view-blog',
                        state: { data: data[0] ,tabValue :props.tabValue},
                      })}
                  >
                    Read more
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card
                  style={{
                    display:data.length >= 2 ? 'flex' : 'none',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '290px',
                    backgroundSize: '360px',
                    backgroundImage: `url(${data[1] && data[1].thumbnail})`,
                  }}
                  className={classes.card}
                >
                  <CardHeader
          //            action=       {
          //             props.tabValue === 2 ?
          //             <IconButton
          //             title='Delete'
          //             onClick={()=>handleDeleteBlog(data[1] && data[1].id)}
          //           >
          //             <DeleteOutlinedIcon
          //               style={{ color: themeContext.palette.primary.main }}
          //             />
          //           </IconButton>
          // : '' 
          //         }
                    subheader={
                      <Typography
                        gutterBottom
                        variant='body2'
                        align='left'
                        component='p'
                        style={{ color: 'white' }}
                      >
                        {data[1] && moment(data[1].created_at).format('MMM DD YYYY')}
                      </Typography>
                    }
                  />
                  <CardActionArea>
                  <CardContent style ={{ padding:'5px'}}>
                      <Typography
                        // variant='body2'
                        style={{
                          marginTop: '-10px',
                          // fontSize: 'x-large',
                          fontWeight: 'bold',
                          color: 'white',
                        }}
                        color='textSecondary'
                        component='p'
                      >
                        {data[1] && data[1].title}
                      </Typography>
                      <Typography
                      style={{
                        color: 'white',
                        paddingRight:'100px'
                      }}
                      color='textSecondary'
                      component='p'
                    > <IconButton aria-label="settings" style={{fontSize: '15px'}}>
                     <Face style={{ color: 'white' ,fontSize: '25px' }}/>
                   </IconButton>
                      {data[1] && data[1].author.first_name}
                    </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions style={{ float: 'right' }}>
                    <Button
                      size='small'
                      color='primary'
                      style={{ width: 150 }}
                      onClick={() =>
                        props.history.push({
                          pathname: '/blog/student/view-blog',
                          state: { data: data[1],tabValue :props.tabValue },
                        })}
                    >
                      Read more
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card
                 style={{
                  display:data.length >= 3 ? 'flex' : 'none',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  width: '100%',
                  height: '290px',
                  backgroundSize: '360px',
                  backgroundImage: `url(${data[2] && data[2].thumbnail})`,
                }}
                 
                  className={classes.card}
                >
                  <CardHeader
    //                  action=       {
    //                   props.tabValue === 2 ?
    // <IconButton
    //                   title='Delete'
    //                   onClick={()=>handleDeleteBlog(data[2] && data[2].id)}
    //                 >
    //                   <DeleteOutlinedIcon
    //                     style={{ color: themeContext.palette.primary.main }}
    //                   />
    //                 </IconButton>
    //       : '' 
    //               }
                    subheader={
                      <Typography
                        gutterBottom
                        variant='body2'
                        align='left'
                        component='p'
                        style={{ color: 'white' }}
                      >
                        {data[2] && moment(data[2].created_at).format('MMM DD YYYY')}
                      </Typography>
                    }
                  />
                  <CardActionArea>
                     <CardContent style ={{ padding:'5px'}}>
                      <Typography
                        // variant='body2'
                        style={{
                          marginTop: '-15px',
                          // fontSize: 'x-large',
                          fontWeight: 'bold',
                          color: 'white',
                        }}
                        color='textSecondary'
                        component='p'
                      >
                        {data[2] && data[2].title}
                      </Typography>
                      <Typography
                      style={{
                        color: 'white',
                        paddingRight:'100px'
                      }}
                      color='textSecondary'
                      component='p'
                    > <IconButton aria-label="settings" style={{fontSize: '15px'}}>
                     <Face style={{ color: 'white' ,fontSize: '25px' }}/>
                   </IconButton>
                      {data[2] && data[2].author.first_name}
                    </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions style={{ float: 'right' }}>
                    <Button
                      size='small'
                      color='primary'
                      style={{  width: 150 }}
                      onClick={() =>
                        props.history.push({
                          pathname: '/blog/student/view-blog',
                          state: { data: data[2] ,tabValue :props.tabValue},
                        })}
                    >
                      Read more
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card
                  style={{
                    display:data.length >= 4 ? 'flex' : 'none',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '290px',
                    backgroundSize: '360px',
                    backgroundImage: `url(${data[3] && data[3].thumbnail})`,
                  }}
                  className={classes.card}
                >
                  <CardHeader
    //                 action=       {
    //                   props.tabValue === 2 ?
    // <IconButton
    //                   title='Delete'
    //                   onClick={()=>handleDeleteBlog(data[3].id)}
    //                 >
    //                   <DeleteOutlinedIcon
    //                     style={{ color: themeContext.palette.primary.main }}
    //                   />
    //                 </IconButton>
    //       : '' 
    //               }
                    subheader={
                      <Typography
                        gutterBottom
                        variant='body2'
                        align='left'
                        component='p'
                        style={{ color: 'white' }}
                      >
                        {data[3] && moment(data[3].created_at).format('MMM DD YYYY')}
                      </Typography>
                    }
                  />
                  <CardActionArea>
                     <CardContent style ={{ padding:'5px'}}>
                      <Typography
                        // variant='body2'
                        style={{
                          marginTop: '-15px',
                          // fontSize: 'x-large',
                          fontWeight: 'bold',
                          color: 'white',
                        }}
                        color='textSecondary'
                        component='p'
                      >
                        {data[3] && data[3].title}
                      </Typography>
                      <Typography
                      style={{
                        color: 'white',
                        paddingRight:'100px'
                      }}
                      color='textSecondary'
                      component='p'
                    > <IconButton aria-label="settings" style={{fontSize: '15px'}}>
                     <Face style={{ color: 'white' ,fontSize: '25px' }}/>
                   </IconButton>
                      {data[3] && data[3].author.first_name}
                    </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions style={{ float: 'right' }}>
                    <Button
                      size='small'
                      color='primary'
                      style={{ width: 150 }}
                      onClick={() =>
                        props.history.push({
                          pathname: '/blog/student/view-blog',
                          state: { data: data[3],tabValue :props.tabValue },
                        })}
                    >
                      Read more
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card
                  style={{
                    width: '100%',
                    height: '290px',
                    backgroundSize: '360px',
                    display:data.length >= 5 ? 'flex' : 'none',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundImage: `url(${data[4] && data[4].thumbnail})`,
                  }}
                  
                  className={classes.card}
                >
                  <CardHeader
    //                 action=       {
    //                   props.tabValue === 2 ?
    // <IconButton
    //                   title='Delete'
    //                   onClick={()=>handleDeleteBlog(data[4].id)}
    //                 >
    //                   <DeleteOutlinedIcon
    //                     style={{ color: themeContext.palette.primary.main }}
    //                   />
    //                 </IconButton>
    //       : '' 
    //               }
                    subheader={
                      <Typography
                        gutterBottom
                        variant='body2'
                        align='left'
                        component='p'
                        style={{ color: 'white' }}
                      >
                        {data[4] && moment(data[4].created_at).format('MMM DD YYYY')}
                      </Typography>
                    }
                  />
                  <CardActionArea>
                     <CardContent style ={{ padding:'5px'}}>
                      <Typography
                        // variant='body2'
                        style={{
                          marginTop: '-15px',
                          // fontSize: 'x-large',
                          fontWeight: 'bold',
                          color: 'white',
                        }}
                        color='textSecondary'
                        component='p'
                      >
                        {data[4] && data[4].title}
                      </Typography>
                      <Typography
                      style={{
                        color: 'white',
                        paddingRight:'100px'
                      }}
                      color='textSecondary'
                      component='p'
                    > <IconButton aria-label="settings" style={{fontSize: '15px'}}>
                     <Face style={{ color: 'white' ,fontSize: '25px' }}/>
                   </IconButton>
                      {data[4] && data[4].author.first_name}
                    </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions style={{ float: 'right' }}>
                    <Button
                      size='small'
                      color='primary'
                      style={{ width: 150 }}
                      onClick={() =>
                        props.history.push({
                          pathname: '/blog/student/view-blog',
                          state: { data: data[4] ,tabValue :props.tabValue},
                        })}
                    >
                      Read more
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
            <Grid item>
              <Card
                style={{
                  width: '100%',
                  height: '230px',
                  display:data.length >= 6 ? 'flex' : 'none',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundSize: '360px',
                  backgroundImage: `url(${data[5] && data[5].thumbnail})`,
                }}
                className={classes.card}
              >
                <CardHeader
  //                  action=       {
  //                   props.tabValue === 2 ?
  // <IconButton
  //                   title='Delete'
  //                   onClick={()=>handleDeleteBlog(data[5].id)}
  //                 >
  //                   <DeleteOutlinedIcon
  //                     style={{ color: themeContext.palette.primary.main }}
  //                   />
  //                 </IconButton>
  //       : '' 
  //               }
                  subheader={
                    <Typography gutterBottom variant='body2' align='left' component='p' style={{color:'white'}}>
                      {data[5] && moment(data[5].created_at).format('MMM DD YYYY')}
                    </Typography>
                  }
                />
                <CardActionArea>
                   <CardContent style ={{ padding:'5px'}}>
                    <Typography
                      // variant='body2'
                      style={{
                        marginTop: '-35px',
                        // fontSize: 'x-large',
                        fontWeight: 'bold',
                        color: 'white',
                      }}
                      color='textSecondary'
                      component='p'
                    >
                      {data[5] && data[5].title}
                    </Typography>
                    <Typography
                      style={{
                        color: 'white',
                        paddingRight:'360px'
                      }}
                      color='textSecondary'
                      component='p'
                    > <IconButton aria-label="settings" style={{fontSize: '15px'}}>
                     <Face style={{ color: 'white' ,fontSize: '25px' }}/>
                   </IconButton>
                      {data[5] && data[5].author.first_name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions style={{ float: 'right' }}>
                  <Button
                    size='small'
                    color='primary'
                    style={{  width: 150 }}
                    onClick={() =>
                      props.history.push({
                        pathname: '/blog/student/view-blog',
                        state: { data: data[5],tabValue :props.tabValue},
                      })}
                  >
                    Read more
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      ) : 
      // (
      //   <Typography align='center'>Oops... No blogs Posted</Typography>
      // )
      (
        <div className="periodDataUnavailable">
            <SvgIcon
                component={() => (
                    <img
                        src={unfiltered}
                    />
                )}
            />
           
        </div>
    )
      }
    </div>
  );
}

export default withRouter(GridList);
